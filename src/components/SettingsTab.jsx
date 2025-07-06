import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, message } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

function SettingsTab() {
  const [form] = Form.useForm();
  const [comfyuiUrl, setComfyuiUrl] = useState(
    localStorage.getItem('comfyui_url') || 'http://localhost:8188'
  );

  const handleSave = (values) => {
    localStorage.setItem('comfyui_url', values.comfyuiUrl);
    message.success('設定を保存しました');
  };

  const handleReset = () => {
    form.resetFields();
    localStorage.removeItem('comfyui_url');
    setComfyuiUrl('http://localhost:8188');
    message.info('設定をリセットしました');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card title="接続設定" style={{ marginBottom: '20px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ comfyuiUrl }}
        >
          <Form.Item
            label="ComfyUI サーバーURL"
            name="comfyuiUrl"
            rules={[
              { required: true, message: 'URLを入力してください' },
              { type: 'url', message: '有効なURLを入力してください' }
            ]}
          >
            <Input 
              placeholder="http://localhost:8188"
              onChange={(e) => setComfyuiUrl(e.target.value)}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              リセット
            </Button>
          </Space>
        </Form>
      </Card>

      <Card title="デフォルト設定" style={{ marginBottom: '20px' }}>
        <p style={{ color: '#9ca3af' }}>
          画像生成時のデフォルト設定を管理できます。
          この機能は今後のアップデートで追加予定です。
        </p>
      </Card>

      <Card title="バージョン情報">
        <div style={{ color: '#9ca3af' }}>
          <p><strong>アプリケーション:</strong> ComfyUI A1111 Style App</p>
          <p><strong>バージョン:</strong> 1.0.0</p>
          <p><strong>説明:</strong> ComfyUIをバックエンドとして使用し、Automatic1111風のUIで画像生成を行うWebアプリケーション</p>
        </div>
      </Card>
    </div>
  );
}

export default SettingsTab;