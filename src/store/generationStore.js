import { create } from 'zustand';
import { comfyAPI } from '../api/comfyui';

const useGenerationStore = create((set, get) => ({
  // 基本設定
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  steps: 20,
  cfg: 7,
  seed: -1,
  sampler: 'euler',
  model: '',
  
  // 利用可能なオプション
  models: [],
  samplers: [],
  
  // 生成状態
  isGenerating: false,
  currentPromptId: null,
  generatedImages: [],
  progress: 0,
  progressMessage: '',
  
  // 履歴
  history: [],
  
  // アクション
  setPrompt: (prompt) => set({ prompt }),
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setSteps: (steps) => set({ steps }),
  setCfg: (cfg) => set({ cfg }),
  setSeed: (seed) => set({ seed }),
  setSampler: (sampler) => set({ sampler }),
  setModel: (model) => set({ model }),
  
  initializeModels: async () => {
    try {
      const [modelsRes, samplersRes] = await Promise.all([
        comfyAPI.getModels(),
        comfyAPI.getSamplers()
      ]);
      
      set({
        models: modelsRes.models || [],
        samplers: samplersRes.samplers || [],
        model: modelsRes.models?.[0] || '',
        sampler: samplersRes.samplers?.[0] || 'euler'
      });
    } catch (error) {
      console.error('初期化エラー:', error);
    }
  },
  
  generate: async () => {
    const state = get();
    set({ 
      isGenerating: true, 
      progress: 0,
      progressMessage: '生成を開始しています...',
      generatedImages: []
    });
    
    try {
      const params = {
        prompt: state.prompt,
        negativePrompt: state.negativePrompt,
        width: state.width,
        height: state.height,
        steps: state.steps,
        cfg: state.cfg,
        seed: state.seed === -1 ? Math.floor(Math.random() * 1000000) : state.seed,
        sampler: state.sampler,
        model: state.model
      };
      
      const response = await comfyAPI.generateImage(params);
      
      // デモモードの場合のメッセージ表示
      if (response.message && response.message.includes('デモモード')) {
        set({ 
          isGenerating: false,
          progress: 0,
          progressMessage: response.message
        });
        alert(response.message + '\n\nComfyUIサーバーのセットアップ方法:\n1. Google Colabで無料で試す\n2. RunPodで本格運用\n3. Vercelの環境変数にCOMFYUI_URLを設定');
        return;
      }
      
      if (response.success) {
        set({ 
          currentPromptId: response.promptId,
          progressMessage: '画像を生成中...'
        });
        
        // 進捗確認のポーリング
        const checkProgress = async () => {
          try {
            const progressRes = await comfyAPI.checkProgress(response.promptId);
            
            if (progressRes.status === 'completed') {
              const images = progressRes.images.map(img => ({
                data: `data:image/png;base64,${img.data}`,
                filename: img.filename,
                params: params,
                timestamp: new Date().toISOString()
              }));
              
              set(state => ({
                isGenerating: false,
                generatedImages: images,
                progress: 100,
                progressMessage: '生成完了',
                history: [...state.history, ...images]
              }));
            } else {
              // まだ処理中の場合は再度チェック
              set(state => ({
                progress: Math.min(state.progress + 10, 90)
              }));
              setTimeout(checkProgress, 1000);
            }
          } catch (error) {
            console.error('進捗確認エラー:', error);
            set({ 
              isGenerating: false,
              progress: 0,
              progressMessage: 'エラーが発生しました'
            });
          }
        };
        
        setTimeout(checkProgress, 1000);
      }
    } catch (error) {
      console.error('生成エラー:', error);
      set({ 
        isGenerating: false,
        progress: 0,
        progressMessage: 'エラーが発生しました'
      });
    }
  },
  
  interrupt: () => {
    set({ 
      isGenerating: false,
      progress: 0,
      progressMessage: '中断されました'
    });
  },
  
  clearHistory: () => set({ history: [] })
}));

export default useGenerationStore;