import axios from 'axios';

const API_BASE_URL = '/api';

export const comfyAPI = {
  async generateImage(params) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, params);
      return response.data;
    } catch (error) {
      console.error('画像生成エラー:', error);
      throw error;
    }
  },

  async checkProgress(promptId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/${promptId}`);
      return response.data;
    } catch (error) {
      console.error('進捗確認エラー:', error);
      throw error;
    }
  },

  async getModels() {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`);
      return response.data;
    } catch (error) {
      console.error('モデル取得エラー:', error);
      throw error;
    }
  },

  async getSamplers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/samplers`);
      return response.data;
    } catch (error) {
      console.error('サンプラー取得エラー:', error);
      throw error;
    }
  },

  connectWebSocket(onMessage) {
    const ws = new WebSocket(`ws://localhost:5000`);
    
    ws.onopen = () => {
      console.log('WebSocket接続が確立されました');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocketエラー:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket接続が切断されました');
    };

    return ws;
  }
};