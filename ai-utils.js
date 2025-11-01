// ai-utils.js
// Utility for Chrome Built-in AI models: Prompt, Summarizer, Translator
// Based on official docs: Prompt API, Translator API. See https://developer.chrome.com/docs/ai/prompt-api & https://developer.chrome.com/docs/ai/translator-api

export class AIUtils {
  // Check if APIs supported
  async isSupported() {
    return typeof self.LanguageModel !== 'undefined'
      && typeof self.Summarizer !== 'undefined'
      && typeof self.Translator !== 'undefined';
  }

  // --- PROMPT API --------------------------------------------------------
  async checkPromptAvailability(options = {}) {
    if (typeof self.LanguageModel === 'undefined') return 'unsupported';
    const avail = await self.LanguageModel.availability(options);
    return avail; // 'downloadable' | 'available' | 'unavailable'
  }

  async downloadPrompt(onProgress, options = {}) {
    const status = await this.checkPromptAvailability(options);
    if (status === 'available') return 'available';
    if (status === 'downloadable') {
      const session = await self.LanguageModel.create(options);
      session.addEventListener('downloadprogress', (e) => {
        onProgress?.('prompt', Math.round(e.loaded * 100));
      });
      await session.ready;
      return 'available';
    }
    throw new Error('Prompt model not downloadable.');
  }

  // --- SUMMARIZER API ---------------------------------------------------
  async checkSummarizerAvailability(options = {}) {
    if (typeof self.Summarizer === 'undefined') return 'unsupported';
    const avail = await self.Summarizer.availability(options);
    return avail;
  }

  async downloadSummarizer(onProgress, options = {}) {
    const status = await this.checkSummarizerAvailability(options);
    if (status === 'available') return 'available';
    if (status === 'downloadable') {
      const model = await self.Summarizer.create(options);
      model.addEventListener('downloadprogress', (e) => {
        onProgress?.('summarizer', Math.round(e.loaded * 100));
      });
      await model.ready;
      return 'available';
    }
    throw new Error('Summarizer model not downloadable.');
  }

  // --- TRANSLATOR API ---------------------------------------------------
  async checkTranslatorAvailability({sourceLanguage, targetLanguage}) {
    if (typeof self.Translator === 'undefined') return 'unsupported';
    const avail = await self.Translator.availability({
      sourceLanguage,
      targetLanguage
    });
    return avail;
  }

  async downloadTranslator({sourceLanguage, targetLanguage}, onProgress) {
    const status = await this.checkTranslatorAvailability({sourceLanguage, targetLanguage});
    if (status === 'available') return 'available';
    if (status === 'downloadable') {
      const translator = await self.Translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            onProgress?.('translator', Math.round(e.loaded * 100));
          });
        }
      });
      await translator.ready;
      return 'available';
    }
    throw new Error('Translator model not downloadable.');
  }

  // --- Combined helpers -----------------------------------------------
  async checkAll({sourceLanguage, targetLanguage}) {
    const [p, s, t] = await Promise.all([
      this.checkPromptAvailability(),
      this.checkSummarizerAvailability(),
      this.checkTranslatorAvailability({sourceLanguage, targetLanguage})
    ]);
    return { prompt: p, summarizer: s, translator: t };
  }

  async downloadAll({sourceLanguage, targetLanguage}, onProgress) {
    const results = {};
    results.prompt = await this.downloadPrompt(onProgress);
    results.summarizer = await this.downloadSummarizer(onProgress);
    results.translator = await this.downloadTranslator({sourceLanguage, targetLanguage}, onProgress);
    await chrome.storage.local.set({ aiModelsStatus: results });
    return results;
  }

  async allReady({sourceLanguage, targetLanguage}) {
    const statuses = await this.checkAll({sourceLanguage, targetLanguage});
    return Object.values(statuses).every(v => v === 'available');
  }
}
