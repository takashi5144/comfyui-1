import React from 'react';
import { Input, Slider, Select, InputNumber, Button, Space } from 'antd';
import useGenerationStore from '../store/generationStore';

const { TextArea } = Input;
const { Option } = Select;

function GenerationTab({ mode }) {
  const {
    prompt,
    negativePrompt,
    width,
    height,
    steps,
    cfg,
    seed,
    sampler,
    model,
    models,
    samplers,
    isGenerating,
    generatedImages,
    progress,
    progressMessage,
    setPrompt,
    setNegativePrompt,
    setWidth,
    setHeight,
    setSteps,
    setCfg,
    setSeed,
    setSampler,
    setModel,
    generate,
    interrupt
  } = useGenerationStore();

  return (
    <div className="generation-container">
      <div className="generation-main">
        <div className="prompt-section">
          <label className="prompt-label">プロンプト</label>
          <TextArea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="生成したい画像の説明を入力してください..."
            rows={4}
          />
        </div>

        <div className="prompt-section">
          <label className="prompt-label">ネガティブプロンプト</label>
          <TextArea
            className="prompt-textarea"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="除外したい要素を入力してください..."
            rows={3}
          />
        </div>

        <div className="generation-controls">
          {!isGenerating ? (
            <button 
              className="generate-btn"
              onClick={generate}
              disabled={!prompt}
            >
              生成
            </button>
          ) : (
            <>
              <button 
                className="generate-btn"
                disabled
              >
                生成中...
              </button>
              <button 
                className="interrupt-btn"
                onClick={interrupt}
              >
                中断
              </button>
            </>
          )}
        </div>

        {isGenerating && (
          <div className="progress-section">
            <div className="progress-info">
              <span>{progressMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="image-output-section">
          {generatedImages.length > 0 ? (
            <div className="generated-images">
              {generatedImages.map((image, index) => (
                <img 
                  key={index}
                  src={image.data} 
                  alt={`Generated ${index}`}
                  className="generated-image"
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>生成された画像がここに表示されます</p>
            </div>
          )}
        </div>
      </div>

      <div className="generation-sidebar">
        <div className="setting-group">
          <div className="setting-label">
            <span>モデル</span>
          </div>
          <Select
            value={model}
            onChange={setModel}
            style={{ width: '100%' }}
          >
            {models.map((m) => (
              <Option key={m} value={m}>{m}</Option>
            ))}
          </Select>
        </div>

        <div className="setting-group">
          <div className="setting-label">
            <span>サンプリング方法</span>
          </div>
          <Select
            value={sampler}
            onChange={setSampler}
            style={{ width: '100%' }}
          >
            {samplers.map((s) => (
              <Option key={s} value={s}>{s}</Option>
            ))}
          </Select>
        </div>

        <div className="setting-group">
          <div className="setting-label">
            <span>サンプリングステップ</span>
            <span className="setting-value">{steps}</span>
          </div>
          <Slider
            min={1}
            max={150}
            value={steps}
            onChange={setSteps}
          />
        </div>

        <div className="setting-group">
          <div className="setting-label">
            <span>幅</span>
            <span className="setting-value">{width}</span>
          </div>
          <Slider
            min={64}
            max={2048}
            step={64}
            value={width}
            onChange={setWidth}
          />
        </div>

        <div className="setting-group">
          <div className="setting-label">
            <span>高さ</span>
            <span className="setting-value">{height}</span>
          </div>
          <Slider
            min={64}
            max={2048}
            step={64}
            value={height}
            onChange={setHeight}
          />
        </div>

        <div className="setting-group">
          <div className="setting-label">
            <span>CFGスケール</span>
            <span className="setting-value">{cfg}</span>
          </div>
          <Slider
            min={1}
            max={30}
            step={0.5}
            value={cfg}
            onChange={setCfg}
          />
        </div>

        <div className="setting-group">
          <div className="setting-label">
            <span>シード値</span>
          </div>
          <InputNumber
            value={seed}
            onChange={setSeed}
            style={{ width: '100%' }}
            placeholder="-1 でランダム"
          />
        </div>
      </div>
    </div>
  );
}

export default GenerationTab;