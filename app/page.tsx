'use client';
import { useState, useEffect } from 'react';
import { loadWords, getRandomWord } from './utils/wordData';

export default function Home() {
  const [words, setWords] = useState<any[]>([]);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentMode, setCurrentMode] = useState('random'); // 添加状态管理当前模式

  useEffect(() => {
    loadWords().then(data => {
      setWords(data);
      setCurrentWord(getRandomWord(data));
    });
  }, []);

  const handleNext = () => {
    if (currentWord) setHistory([...history, currentWord]);
    setCurrentWord(getRandomWord(words));
  };

  const handlePrev = () => {
    if (history.length > 0) {
      setCurrentWord(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-8 pt-24">
        {/* 吸顶的汉字标题 */}
        {currentWord && (
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 shadow-sm z-10">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{currentWord.word}</h2>
                <span className="text-gray-600">{currentWord.pinyin}</span>
              </div>
              
              {/* 模式切换按钮 */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCurrentMode('random')}
                  className={`px-3 py-1 rounded ${currentMode === 'random' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  随机
                </button>
                <button 
                  onClick={() => setCurrentMode('sequential')}
                  className={`px-3 py-1 rounded ${currentMode === 'sequential' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  顺序
                </button>
                <button 
                  onClick={() => setCurrentMode('search')}
                  className={`px-3 py-1 rounded ${currentMode === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  查找
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 原有内容区域 */}
        {currentWord && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-8"> {/* 添加mt-8 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-4xl font-bold text-gray-900">{currentWord.word}</h2> {/* 修改为text-gray-900 */}
              <span className="text-gray-600">{currentWord.pinyin}</span> {/* 调整拼音颜色 */}
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">释义</h3> {/* 添加text-gray-800 */}
              <p className="text-gray-700 whitespace-pre-line">{currentWord.explanation}</p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handlePrev}
                disabled={history.length === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                上一个
              </button>
              <button 
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                下一个
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 固定在底部的导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button 
            onClick={handlePrev}
            disabled={history.length === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex-1 mr-2"
          >
            上一个
          </button>
          <button 
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1 ml-2"
          >
            下一个
          </button>
        </div>
      </div>
    </div>
  );
}
