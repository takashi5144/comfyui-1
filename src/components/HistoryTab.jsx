import React from 'react';
import { Button, Empty, Card, Row, Col } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import useGenerationStore from '../store/generationStore';

function HistoryTab() {
  const { history, clearHistory } = useGenerationStore();

  const downloadImage = (imageData, filename) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename || 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Empty 
          description="生成履歴がありません"
          style={{ color: '#9ca3af' }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <Button 
          danger 
          icon={<DeleteOutlined />}
          onClick={clearHistory}
        >
          履歴をクリア
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {history.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img 
                  alt={`History ${index}`} 
                  src={item.data}
                  style={{ width: '100%', height: 'auto' }}
                />
              }
              actions={[
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={() => downloadImage(item.data, item.filename)}
                >
                  ダウンロード
                </Button>
              ]}
              bodyStyle={{ padding: '12px' }}
            >
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                <p><strong>プロンプト:</strong> {item.params.prompt.substring(0, 50)}...</p>
                <p><strong>サイズ:</strong> {item.params.width}x{item.params.height}</p>
                <p><strong>ステップ:</strong> {item.params.steps}</p>
                <p><strong>時刻:</strong> {new Date(item.timestamp).toLocaleString('ja-JP')}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HistoryTab;