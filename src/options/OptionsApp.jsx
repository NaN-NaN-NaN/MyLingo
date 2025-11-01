import React, { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import {
  isPromptApiReady,
  isSummarizerReady,
  isTranslatorReady,
  downloadModel,
} from '../utils/ai';

const ALL_MODELS_READY = 'All AI models are downloaded and ready.';

function OptionsApp() {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(false);
  const [targetLang, setTargetLang] = useState('de');
  const [nativeLang, setNativeLang] = useState('ch');
  
  const [models, setModels] = useState({ summarizer: 'no', translator: 'no', prompt: 'no' });
  const [areAllModelsReady, setAreAllModelsReady] = useState(false);
  const [infoMessage, setInfoMessage] = useState('Checking AI model status...');
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState(0);

  const checkAllModels = useCallback(async (source, target) => {
    const [prompt, summarizer, translator] = await Promise.all([
      isPromptApiReady(),
      isSummarizerReady(),
      isTranslatorReady(source, target),
    ]);
      
    const allReady = prompt === 'readily' && summarizer === 'readily' && translator === 'readily';
    setModels({ prompt, summarizer, translator });
    setAreAllModelsReady(allReady);

    if (allReady) {
      setInfoMessage(ALL_MODELS_READY);
    } else {
      let missing = [];
      if (summarizer !== 'readily') missing.push('Summarizer');
      if (translator !== 'readily') missing.push(`Translator (${source} to ${target})`);
      setInfoMessage(`Missing models: ${missing.join(', ')}.`);
    }
  }, []);

  useEffect(() => {
    getSettings().then(settings => {
      setIsExtensionEnabled(settings.enabled || false);
      setTargetLang(settings.targetLang || 'es');
      setNativeLang(settings.nativeLang || 'en');
      checkAllModels(settings.nativeLang || 'en', settings.targetLang || 'es');
    });
  }, [checkAllModels]);

  const handleDownload = async (modelName, source, target) => {
    const modelKey = modelName === 'translator' ? `translator-${source}-${target}` : modelName;
    setDownloading(modelName);
    setProgress(0);
    await downloadModel(modelKey, setProgress);
    setDownloading(null);
    checkAllModels(nativeLang, targetLang);
  };

  const handleToggle = async () => {
    if (!isExtensionEnabled && !areAllModelsReady) {
      const missing = Object.entries(models)
        .filter(([_, status]) => status !== 'readily')
        .map(([name]) => name)
        .join(', ');

      if (window.confirm(`To enable, the following models must be downloaded: ${missing}. Proceed?`)) {
        if (models.summarizer !== 'readily') await handleDownload('summarizer');
        if (models.translator !== 'readily') await handleDownload('translator', nativeLang, targetLang);
      }
    } else {
      const newEnabledState = !isExtensionEnabled;
      setIsExtensionEnabled(newEnabledState);
      saveSettings({ enabled: newEnabledState });
    }
  };
  
  const handleLangChange = (langType, value) => {
    const newSettings = {
      ...(langType === 'target' ? { targetLang: value } : { nativeLang: value })
    };
    if (langType === 'target') setTargetLang(value);
    if (langType === 'native') setNativeLang(value);
    saveSettings(newSettings);
    checkAllModels(langType === 'native' ? value : nativeLang, langType === 'target' ? value : targetLang);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">myLingo Settings</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-lg">Enable myLingo</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isExtensionEnabled} onChange={handleToggle} disabled={!areAllModelsReady && !isExtensionEnabled} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="target-lang" className="block text-sm font-medium text-gray-700">Target Language</label>
              <select id="target-lang" value={targetLang} onChange={e => handleLangChange('target', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label htmlFor="native-lang" className="block text-sm font-medium text-gray-700">Native Language</label>
              <select id="native-lang" value={nativeLang} onChange={e => handleLangChange('native', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-lg font-medium mb-2">AI Model Status</h2>
            <p className="text-sm text-gray-600 mb-4">{infoMessage}</p>
            {downloading && (
              <div>
                <p className="text-sm font-medium">Downloading {downloading} model...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            {!areAllModelsReady && !downloading && (
              <button onClick={handleToggle} className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                Download Missing Models
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsApp;
