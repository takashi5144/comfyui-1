const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const COMFYUI_URL = process.env.COMFYUI_URL || 'http://localhost:8188';
const DEMO_MODE = !process.env.COMFYUI_URL;

app.post('/api/prompt', async (req, res) => {
  if (DEMO_MODE) {
    // デモモード：ダミーのレスポンスを返す
    res.json({ 
      prompt_id: 'demo-' + Date.now(),
      message: 'デモモードです。実際の画像生成にはCOMFYUI_URL環境変数を設定してください。'
    });
    return;
  }
  
  try {
    const response = await axios.post(`${COMFYUI_URL}/prompt`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history/:promptId', async (req, res) => {
  try {
    const response = await axios.get(`${COMFYUI_URL}/history/${req.params.promptId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;