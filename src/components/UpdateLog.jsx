import React from 'react';
import { Timeline, Card, Tag, Typography, Space } from 'antd';
import { 
  RocketOutlined, 
  BugOutlined, 
  ToolOutlined, 
  ExperimentOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const updates = [
  {
    version: '1.0.2',
    date: '2025-01-06',
    type: 'feature',
    changes: [
      'デバッグログ機能を追加',
      '更新情報ログを追加',
      'エラーメッセージの改善'
    ]
  },
  {
    version: '1.0.1',
    date: '2025-01-06',
    type: 'improvement',
    changes: [
      'デモモードの追加',
      '環境変数設定の簡略化',
      'デプロイ手順の改善'
    ]
  },
  {
    version: '1.0.0',
    date: '2025-01-06',
    type: 'release',
    changes: [
      'ComfyUI A1111スタイルWebアプリの初回リリース',
      'Text-to-Image生成機能',
      '生成履歴機能',
      'リアルタイム進捗表示',
      'Vercelデプロイ対応'
    ]
  }
];

const getUpdateIcon = (type) => {
  switch (type) {
    case 'release': return <RocketOutlined />;
    case 'feature': return <ExperimentOutlined />;
    case 'improvement': return <ToolOutlined />;
    case 'bugfix': return <BugOutlined />;
    case 'security': return <SafetyOutlined />;
    default: return <ToolOutlined />;
  }
};

const getUpdateColor = (type) => {
  switch (type) {
    case 'release': return 'purple';
    case 'feature': return 'blue';
    case 'improvement': return 'green';
    case 'bugfix': return 'orange';
    case 'security': return 'red';
    default: return 'default';
  }
};

const getUpdateLabel = (type) => {
  switch (type) {
    case 'release': return 'リリース';
    case 'feature': return '新機能';
    case 'improvement': return '改善';
    case 'bugfix': return 'バグ修正';
    case 'security': return 'セキュリティ';
    default: return '更新';
  }
};

function UpdateLog() {
  return (
    <Card title="更新情報" style={{ maxHeight: '600px', overflow: 'auto' }}>
      <Timeline mode="left">
        {updates.map((update, index) => (
          <Timeline.Item 
            key={index}
            dot={getUpdateIcon(update.type)}
            color={getUpdateColor(update.type)}
          >
            <div style={{ marginBottom: '16px' }}>
              <Space align="baseline" style={{ marginBottom: '8px' }}>
                <Title level={5} style={{ margin: 0 }}>
                  v{update.version}
                </Title>
                <Tag color={getUpdateColor(update.type)}>
                  {getUpdateLabel(update.type)}
                </Tag>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {update.date}
                </Text>
              </Space>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {update.changes.map((change, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    <Text>{change}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
      
      <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
        <Title level={5}>今後の予定</Title>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>ControlNet対応</li>
          <li>img2img機能</li>
          <li>バッチ生成機能</li>
          <li>プロンプトテンプレート管理</li>
          <li>生成画像のクラウド保存</li>
        </ul>
      </div>
    </Card>
  );
}

export default UpdateLog;