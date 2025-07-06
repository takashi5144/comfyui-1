const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const COMFYUI_URL = process.env.COMFYUI_URL || 'http://localhost:8188';

app.post('/api/prompt', async (req, res) => {
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