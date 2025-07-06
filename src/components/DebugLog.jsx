import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Tag, Typography } from 'antd';
import { ClearOutlined, DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

function DebugLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // グローバルなログ関数を作成
    window.debugLog = (message, type = 'info', data = null) => {
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message,
        type,
        data
      };
      
      setLogs(prev => [...prev, logEntry].slice(-100)); // 最新100件を保持
      
      // コンソールにも出力
      if (type === 'error') {
        console.error(`[DEBUG] ${message}`, data);
      } else {
        console.log(`[DEBUG] ${message}`, data);
      }
    };

    // 既存のコンソールメソッドをラップ
    const originalError = console.error;
    console.error = (...args) => {
      window.debugLog(args[0], 'error', args.slice(1));
      originalError.apply(console, args);
    };

    // API呼び出しをインターセプト
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const [url, options] = args;
      
      window.debugLog(`API呼び出し: ${options?.method || 'GET'} ${url}`, 'api');
      
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        
        window.debugLog(
          `API応答: ${response.status} ${response.statusText} (${duration}ms)`,
          response.ok ? 'success' : 'error',
          { url, status: response.status }
        );
        
        return response;
      } catch (error) {
        window.debugLog(`API エラー: ${error.message}`, 'error', { url, error });
        throw error;
      }
    };

    // 初期ログ
    window.debugLog('デバッグログシステム開始', 'info');
    window.debugLog(`環境: ${import.meta.env.MODE}`, 'info');
    window.debugLog(`ComfyUI URL: ${import.meta.env.VITE_COMFYUI_URL || 'デモモード'}`, 'info');

    return () => {
      console.error = originalError;
      window.fetch = originalFetch;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
    window.debugLog('ログをクリアしました', 'info');
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}${log.data ? '\n' + JSON.stringify(log.data, null, 2) : ''}`
    ).join('\n\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-log-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'api': return 'processing';
      default: return 'default';
    }
  };

  return (
    <Card 
      title="デバッグログ" 
      extra={
        <Space>
          <Button icon={<ClearOutlined />} onClick={clearLogs}>
            クリア
          </Button>
          <Button icon={<DownloadOutlined />} onClick={exportLogs}>
            エクスポート
          </Button>
        </Space>
      }
      style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, overflow: 'auto' }}
    >
      <div className="debug-log-container">
        {logs.map(log => (
          <div key={log.id} className="debug-log-entry">
            <Space size="small">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </Text>
              <Tag color={getTypeColor(log.type)}>
                {log.type.toUpperCase()}
              </Tag>
              <Text>{log.message}</Text>
            </Space>
            {log.data && (
              <pre style={{ 
                marginLeft: '20px', 
                fontSize: '11px', 
                color: '#666',
                marginTop: '4px'
              }}>
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default DebugLog;