# ComfyUI A1111-style Web App

ComfyUIを使用したStable Diffusion WebUIアプリケーション

## デプロイ方法

### Vercelでのデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定:
   - `COMFYUI_URL`: ComfyUIサーバーのURL (例: http://your-comfyui-server:8188)

### ローカルでの実行

```bash
npm install
npm run dev
```

## 機能

- Text-to-Image生成
- 生成履歴
- プロンプトテンプレート
- リアルタイム進捗表示