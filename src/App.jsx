import React, { useState, useEffect } from 'react';
import { Tabs, message } from 'antd';
import GenerationTab from './components/GenerationTab';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';
import useGenerationStore from './store/generationStore';
import './styles/App.css';

const { TabPane } = Tabs;

function App() {
  const [activeTab, setActiveTab] = useState('1');
  const { initializeModels } = useGenerationStore();

  useEffect(() => {
    initializeModels();
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>ComfyUI WebUI</h1>
        <span className="version">v1.0.0</span>
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
    </div>
  );
}

export default App;