const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const COMFYUI_URL = process.env.COMFYUI_URL || 'http://localhost:8188';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

class ComfyUIClient {
  constructor(serverAddress) {
    this.serverAddress = serverAddress;
    this.clientId = this.generateClientId();
    this.ws = null;
  }

  generateClientId() {
    return Math.random().toString(36).substring(2, 15);
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`ws://${this.serverAddress.replace('http://', '')}/ws?clientId=${this.clientId}`);
      
      this.ws.on('open', () => {
        console.log('WebSocket接続が確立されました');
        resolve();
      });

      this.ws.on('error', (error) => {
        console.error('WebSocketエラー:', error);
        reject(error);
      });
    });
  }

  async queuePrompt(prompt) {
    const response = await axios.post(`${this.serverAddress}/prompt`, {
      prompt: prompt,
      client_id: this.clientId
    });
    return response.data.prompt_id;
  }

  async getHistory(promptId) {
    const response = await axios.get(`${this.serverAddress}/history/${promptId}`);
    return response.data;
  }

  async getImage(filename, subfolder, folderType) {
    const response = await axios.get(`${this.serverAddress}/view`, {
      params: { filename, subfolder, type: folderType },
      responseType: 'arraybuffer'
    });
    return response.data;
  }

  listenForUpdates(callback) {
    if (!this.ws) return;

    this.ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      callback(message);
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const comfyClient = new ComfyUIClient(COMFYUI_URL);

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, negativePrompt, width, height, steps, cfg, seed, sampler, model } = req.body;

    const workflow = {
      "3": {
        "inputs": {
          "seed": seed || Math.floor(Math.random() * 1000000),
          "steps": steps || 20,
          "cfg": cfg || 7,
          "sampler_name": sampler || "euler",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": {
          "ckpt_name": model || "sd_xl_base_1.0.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": width || 512,
          "height": height || 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": prompt || "a beautiful landscape",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": negativePrompt || "",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "filename_prefix": "ComfyUI",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };

    await comfyClient.connect();
    const promptId = await comfyClient.queuePrompt(workflow);

    res.json({ 
      success: true, 
      promptId,
      message: '画像生成を開始しました'
    });

  } catch (error) {
    console.error('生成エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/progress/:promptId', async (req, res) => {
  try {
    const { promptId } = req.params;
    const history = await comfyClient.getHistory(promptId);
    
    if (history[promptId]) {
      const outputs = history[promptId].outputs;
      const images = [];
      
      for (const nodeId in outputs) {
        if (outputs[nodeId].images) {
          for (const image of outputs[nodeId].images) {
            const imageData = await comfyClient.getImage(
              image.filename,
              image.subfolder,
              image.type
            );
            images.push({
              data: Buffer.from(imageData).toString('base64'),
              filename: image.filename
            });
          }
        }
      }
      
      res.json({ 
        success: true, 
        status: 'completed',
        images 
      });
    } else {
      res.json({ 
        success: true, 
        status: 'processing' 
      });
    }
  } catch (error) {
    console.error('進捗確認エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get(`${COMFYUI_URL}/object_info`);
    const models = response.data.CheckpointLoaderSimple.input.required.ckpt_name[0];
    res.json({ success: true, models });
  } catch (error) {
    console.error('モデル取得エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/samplers', async (req, res) => {
  try {
    const response = await axios.get(`${COMFYUI_URL}/object_info`);
    const samplers = response.data.KSampler.input.required.sampler_name[0];
    res.json({ success: true, samplers });
  } catch (error) {
    console.error('サンプラー取得エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('クライアントが接続しました');
  
  comfyClient.listenForUpdates((message) => {
    ws.send(JSON.stringify(message));
  });

  ws.on('close', () => {
    console.log('クライアントが切断しました');
  });
});