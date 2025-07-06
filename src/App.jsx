import React, { useState, useEffect } from 'react';
import { Tabs, message, Drawer, Button } from 'antd';
import { BugOutlined, InfoCircleOutlined } from '@ant-design/icons';
import GenerationTab from './components/GenerationTab';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';
import DebugLog from './components/DebugLog';
import UpdateLog from './components/UpdateLog';
import useGenerationStore from './store/generationStore';
import './styles/App.css';

const { TabPane } = Tabs;

function App() {
  const [activeTab, setActiveTab] = useState('1');
  const [debugDrawerOpen, setDebugDrawerOpen] = useState(false);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const { initializeModels } = useGenerationStore();

  useEffect(() => {
    initializeModels();
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>ComfyUI WebUI</h1>
        <span className="version">v1.0.2</span>
        <div className="header-actions">
          <Button 
            icon={<BugOutlined />} 
            onClick={() => setDebugDrawerOpen(true)}
            type="text"
          >
            デバッグ
          </Button>
          <Button 
            icon={<InfoCircleOutlined />} 
            onClick={() => setUpdateDrawerOpen(true)}
            type="text"
          >
            更新情報
          </Button>
        </div>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="main-tabs"
      >
        <TabPane tab="txt2img" key="1">
          <GenerationTab mode="txt2img" />
        </TabPane>
        
        <TabPane tab="img2img" key="2">
          <GenerationTab mode="img2img" />
        </TabPane>
        
        <TabPane tab="履歴" key="3">
          <HistoryTab />
        </TabPane>
        
        <TabPane tab="設定" key="4">
          <SettingsTab />
        </TabPane>
      </Tabs>
      
      <Drawer
        title="デバッグログ"
        placement="bottom"
        onClose={() => setDebugDrawerOpen(false)}
        open={debugDrawerOpen}
        height={500}
        bodyStyle={{ padding: 0 }}
      >
        <DebugLog />
      </Drawer>
      
      <Drawer
        title="更新情報"
        placement="right"
        onClose={() => setUpdateDrawerOpen(false)}
        open={updateDrawerOpen}
        width={600}
      >
        <UpdateLog />
      </Drawer>
    </div>
  );
}

export default App;