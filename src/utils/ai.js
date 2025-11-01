// src/utils/ai.js

// NOTE: This file uses placeholder logic for Chrome's Built-in AI APIs (window.ai).
// The actual implementation will depend on the final API specification.

/**
 * Checks the availability of a built-in AI model.
 * @param {string} model - The model to check ('summarizer', 'translator', 'prompt').
 * @param {object} options - Additional options, e.g., for translator languages.
 * @returns {Promise<'readily'|'after-download'|'no'>} - The availability status.
 */
const checkModelAvailability = async (model, options = {}) => {
  // Placeholder for actual API check.
  // In a real scenario, you might use something like:
  // if (model === 'prompt') return await window.ai.canCreateTextSession();
  // if (model === 'translator') return await window.ai.translator.isModelAvailable(options.source, options.target);
  
  // For this scaffold, we'll simulate the states.
  // Let's assume the prompt API is ready, but others need a "download".
  if (model === 'prompt') {
    return 'readily';
  }
  // Simulate checking local storage to see if we've "downloaded" it before.
  const downloadedModels = JSON.parse(localStorage.getItem('downloaded_models') || '{}');
  const modelKey = model === 'translator' ? `translator-${options.source}-${options.target}` : model;
  
  return downloadedModels[modelKey] ? 'readily' : 'after-download';
};

export const isPromptApiReady = () => checkModelAvailability('prompt');
export const isSummarizerReady = () => checkModelAvailability('summarizer');
export const isTranslatorReady = (source, target) => checkModelAvailability('translator', { source, target });

/**
 * Simulates downloading a model and shows progress.
 * @param {string} model - The model to "download".
 * @param {function} onProgress - Callback to report progress (0-100).
 */
export const downloadModel = (model, onProgress) => {
  return new Promise(resolve => {
    console.log(`AI: Simulating download for '${model}'...`);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (onProgress) {
        onProgress(progress);
      }
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mark the model as "downloaded" in our simulation
        const downloadedModels = JSON.parse(localStorage.getItem('downloaded_models') || '{}');
        downloadedModels[model] = true;
        localStorage.setItem('downloaded_models', JSON.stringify(downloadedModels));
        
        console.log(`AI: '${model}' download complete.`);
        resolve();
      }
    }, 300);
  });
};


// --- Existing AI functionality wrappers ---

export const translate = async (text, targetLang) => {
  console.log(`AI: Translating '${text}' to ${targetLang}`);
  return `(Translated) ${text}`;
};

export const simplify = async (text) => {
  console.log(`AI: Simplifying '${text}'`);
  return `(Simplified) ${text}`;
};

export const checkGrammar = async (text) => {
  console.log(`AI: Checking grammar for '${text}'`);
  return `(Grammar Hint) No issues found in '${text}'.`;
};

export const rewrite = async (text) => {
  console.log(`AI: Rewriting '${text}'`);
  return `(Rewritten) Here is another way to say '${text}'.`;
};

export const generateQuiz = async (notes) => {
  console.log('AI: Generating quiz from notes');
  if (!notes || notes.length === 0) return [];
  const question = {
    type: 'multiple-choice',
    question: `What is the translation of "${notes[0].original}"?`,
    options: [notes[0].translation, 'Incorrect 1', 'Incorrect 2', 'Incorrect 3'],
    answer: notes[0].translation,
  };
  return [question];
};
