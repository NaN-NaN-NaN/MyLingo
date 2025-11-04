// ai-utils.js
// Utility for Chrome Built-in AI models: Prompt API, Summarizer API, Translator API
// Based on official docs: https://developer.chrome.com/docs/ai/prompt-api & https://developer.chrome.com/docs/ai/summarizer-api

class AIUtils {
  constructor() {
    this.promptSession = null;
    this.translator = null;
    this.translatorKey = null; // Track current translator language pair
    this.summarizer = null;
    this.language = 'en'; // Default output language for LanguageModel
  }

  // Check if APIs supported
  async isSupported() {
    return typeof LanguageModel !== 'undefined'
      && typeof Summarizer !== 'undefined'
      && typeof Translator !== 'undefined';
  }

  // Initialize Prompt API session with language parameter
  async initPromptAPI(language = 'en') {
    this.language = language;
    console.log('[AIUtils] Initializing Prompt API with outputLanguage:', this.language);
    if (!this.promptSession) {
      try {
        this.promptSession = await LanguageModel.create({
          systemPrompt: `You are a helpful language learning assistant. Always respond in ${this.language}.`,
          outputLanguage: this.language
        });
        console.log('[AIUtils] Prompt API initialized successfully');
      } catch (e) {
        console.error('Failed to initialize Prompt API:', e);
        throw e;
      }
    }
    return this.promptSession;
  }

  // --- PROMPT API --------------------------------------------------------
  async checkPromptAvailability() {
    if (typeof LanguageModel === 'undefined') return 'unavailable';
    try {
      const availability = await LanguageModel.availability({
        outputLanguage: this.language || 'en'
      });
      console.log('[AIUtils] Prompt API availability:', availability);
      return availability; // 'available' | 'downloadable' | 'downloading' | 'unavailable'
    } catch (e) {
      console.error('[AIUtils] Error checking Prompt availability:', e);
      return 'unavailable';
    }
  }

  async downloadPrompt(onProgress) {
    const status = await this.checkPromptAvailability();
    if (status === 'available') return 'available';
    if (status === 'downloadable' || status === 'downloading') {
      try {
        const session = await LanguageModel.create({
          outputLanguage: this.language,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress?.('prompt', percent);
            });
          }
        });
        this.promptSession = session;
        return 'available';
      } catch (e) {
        console.error('[AIUtils] Prompt download error:', e);
        throw e;
      }
    }
    throw new Error('Prompt model not available.');
  }

  // --- SUMMARIZER API ---------------------------------------------------
  async checkSummarizerAvailability() {
    if (typeof Summarizer === 'undefined') return 'unavailable';
    try {
      const availability = await Summarizer.availability();
      console.log('[AIUtils] Summarizer availability:', availability);
      return availability; // 'available' | 'downloadable' | 'downloading' | 'unavailable'
    } catch (e) {
      console.error('[AIUtils] Error checking Summarizer availability:', e);
      return 'unavailable';
    }
  }

  async downloadSummarizer(onProgress) {
    const status = await this.checkSummarizerAvailability();
    if (status === 'available') return 'available';
    if (status === 'downloadable' || status === 'downloading') {
      try {
        const summarizer = await Summarizer.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress?.('summarizer', percent);
            });
          }
        });
        this.summarizer = summarizer;
        return 'available';
      } catch (e) {
        console.error('[AIUtils] Summarizer download error:', e);
        throw e;
      }
    }
    throw new Error('Summarizer model not available.');
  }

  // --- TRANSLATOR API ---------------------------------------------------
  async checkTranslatorAvailability({sourceLanguage, targetLanguage}) {
    if (typeof Translator === 'undefined') return 'unavailable';
    try {
      const availability = await Translator.availability({
        sourceLanguage,
        targetLanguage
      });
      console.log('[AIUtils] Translator availability:', availability);
      return availability; // 'available' | 'downloadable' | 'downloading' | 'unavailable'
    } catch (e) {
      console.error('[AIUtils] Error checking Translator availability:', e);
      return 'unavailable';
    }
  }

  async downloadTranslator({sourceLanguage, targetLanguage}, onProgress) {
    console.log('[AIUtils] Downloading translator:', sourceLanguage, '→', targetLanguage);
    const status = await this.checkTranslatorAvailability({sourceLanguage, targetLanguage});
    console.log('[AIUtils] Translator status:', status);
    if (status === 'available') return 'available';
    if (status === 'downloadable' || status === 'downloading') {
      try {
        const translator = await Translator.create({
          sourceLanguage,
          targetLanguage,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress?.('translator', percent);
            });
          }
        });
        this.translator = translator;
        return 'available';
      } catch (e) {
        console.error('[AIUtils] Translator download error:', e);
        console.error('[AIUtils] Languages were:', sourceLanguage, '→', targetLanguage);
        throw e;
      }
    }
    throw new Error('Translator model not available. Status was: ' + status);
  }

  // --- ACTUAL AI FUNCTIONALITY -------------------------------------------

  // Translate text
  async translate(text, targetLang, sourceLang) {
    try {
      console.log('[AIUtils] Translating from', sourceLang, 'to', targetLang);
      console.log('[AIUtils] Text to translate:', text);

      // Create translator if not exists or if language pair changed
      const translatorKey = `${sourceLang}-${targetLang}`;
      if (!this.translator || this.translatorKey !== translatorKey) {
        console.log('[AIUtils] Creating new translator for:', translatorKey);

        // Destroy old translator if exists
        // if (this.translator) {
        //   try {
        //     this.translator.destroy?.();
        //   } catch (e) {
        //     console.warn('[AIUtils] Error destroying old translator:', e);
        //   }
        // }

        this.translator = await Translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang
        });
        this.translatorKey = translatorKey;
      }

      const result = await this.translator.translate(text);
      console.log('[AIUtils] Translation result:', result);

      return result;
    } catch (e) {
      console.error('[AIUtils] Translation error:', e);
      console.error('[AIUtils] Source lang:', sourceLang, 'Target lang:', targetLang);
      throw e;
    }
  }

  // Analyze a word
  async analyzeWord(word, targetLang, nativeLang, level) {
    await this.initPromptAPI(this.language);
    const prompt = `Analyze this ${targetLang} word for a ${level} learner:
Word: "${word}"

Provide:
1. Part of speech
2. Simple definition
3. Example sentence
4. Common collocations (2-3)

Keep it concise and appropriate for ${level} level.`;

    const response = await this.promptSession.prompt(prompt);
    return this.parseWordAnalysis(response);
  }

  // Analyze a sentence
  async analyzeSentence(sentence, targetLang, nativeLang, level) {
    await this.initPromptAPI(this.language);
    const prompt = `Analyze this ${targetLang} sentence for a ${level} learner:
Sentence: "${sentence}"

Provide:
1. Grammar structure (main verb, tense, etc.)
2. Key vocabulary (2-3 important words)
3. Cultural or contextual notes (if relevant)

Keep it concise and appropriate for ${level} level.`;

    const response = await this.promptSession.prompt(prompt);
    return this.parseSentenceAnalysis(response);
  }

  // Analyze a paragraph
  async analyzeParagraph(paragraph, targetLang, nativeLang, level) {
    await this.initPromptAPI(this.language);
    const prompt = `Summarize this ${targetLang} text for a ${level} learner:
Text: "${paragraph.substring(0, 500)}"

Provide:
1. Main idea (1-2 sentences)
2. Key points (2-3 bullet points)
3. Difficulty level assessment

Keep it concise and appropriate for ${level} level.`;

    const response = await this.promptSession.prompt(prompt);
    return this.parseParagraphAnalysis(response);
  }

  // Text-to-speech
  async speak(text, lang) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = resolve;
      utterance.onerror = reject;
      speechSynthesis.speak(utterance);
    });
  }

  // Parse analysis responses
  parseWordAnalysis(response) {
    return {
      raw: response,
      sections: response.split('\n\n').filter(s => s.trim())
    };
  }

  parseSentenceAnalysis(response) {
    return {
      raw: response,
      sections: response.split('\n\n').filter(s => s.trim())
    };
  }

  parseParagraphAnalysis(response) {
    return {
      raw: response,
      sections: response.split('\n\n').filter(s => s.trim())
    };
  }

  // --- Combined helpers -----------------------------------------------
  async checkAll({sourceLanguage, targetLanguage, language = 'en'}) {
    // Set the language before checking
    this.language = language;
    console.log('[AIUtils] checkAll with language:', language);

    const [p, s, t] = await Promise.all([
      this.checkPromptAvailability(),
      this.checkSummarizerAvailability(),
      this.checkTranslatorAvailability({sourceLanguage, targetLanguage})
    ]);

    console.log('[AIUtils] Availability results:', { prompt: p, summarizer: s, translator: t });
    return { prompt: p, summarizer: s, translator: t };
  }

  async downloadAll({sourceLanguage, targetLanguage, language = 'en'}, onProgress) {
    this.language = language;
    const results = {};
    results.prompt = await this.downloadPrompt(onProgress);
    results.summarizer = await this.downloadSummarizer(onProgress);
    results.translator = await this.downloadTranslator({sourceLanguage, targetLanguage}, onProgress);
    await chrome.storage.local.set({ aiModelsStatus: results });
    return results;
  }

  async allReady({sourceLanguage, targetLanguage, language = 'en'}) {
    this.language = language;
    const statuses = await this.checkAll({sourceLanguage, targetLanguage, language});
    const ready = Object.values(statuses).every(v => v === 'available');
    console.log('[AIUtils] allReady:', ready, 'statuses:', statuses);
    return ready;
  }
}

console.log('[ai-utils.js] AIUtils class loaded');
