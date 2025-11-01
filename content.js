// content.js - Main content script that runs on all pages

// Load dependencies
const script1 = document.createElement('script');
script1.src = chrome.runtime.getURL('i18n.js');
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = chrome.runtime.getURL('ai-utils.js');
document.head.appendChild(script2);

// Wait for dependencies to load
setTimeout(initMyLingo, 100);

function initMyLingo() {
  console.log('MyLingo initializing...');

  // Global state
  let isEnabled = false;
  let settings = {
    targetLanguage: 'es',
    nativeLanguage: 'en',
    proficiencyLevel: 'B1'
  };
  let i18n = null;
  let aiUtils = null;
  let currentChip = null;
  let currentDialog = null;

  // Initialize
  async function init() {
    // Load i18n
    if (typeof I18n !== 'undefined') {
      i18n = new I18n();
      await i18n.init();
    }

    // Load AI utils
    if (typeof AIUtils !== 'undefined') {
      aiUtils = new AIUtils();
      await aiUtils.initPromptAPI();
    }

    // Load settings
    const stored = await chrome.storage.sync.get(['isEnabled', 'targetLanguage', 'nativeLanguage', 'proficiencyLevel']);
    isEnabled = stored.isEnabled || false;
    settings.targetLanguage = stored.targetLanguage || 'es';
    settings.nativeLanguage = stored.nativeLanguage || 'en';
    settings.proficiencyLevel = stored.proficiencyLevel || 'B1';

    // Listen for text selection
    if (isEnabled) {
      document.addEventListener('mouseup', handleSelection);
      document.addEventListener('touchend', handleSelection);
    }

    // Listen for settings changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isEnabled) {
        isEnabled = changes.isEnabled.newValue;
        if (!isEnabled) {
          removeChip();
          removeDialog();
        }
      }
      if (changes.targetLanguage) settings.targetLanguage = changes.targetLanguage.newValue;
      if (changes.nativeLanguage) {
        settings.nativeLanguage = changes.nativeLanguage.newValue;
        if (i18n) i18n.setLanguage(changes.nativeLanguage.newValue);
      }
      if (changes.proficiencyLevel) settings.proficiencyLevel = changes.proficiencyLevel.newValue;
    });

    console.log('MyLingo ready!', { isEnabled, settings });
  }

  // Handle text selection
  function handleSelection(e) {
    if (!isEnabled) return;

    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (!selectedText) {
        removeChip();
        return;
      }

      // Check selection type
      const selectionType = aiUtils ? aiUtils.detectSelectionType(selectedText) : 'WORD';

      if (selectionType === 'TOO_LONG') {
        showError(i18n ? i18n.t('tooLong') : 'Selection too long');
        return;
      }

      // Get selection position
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Show chip
      showChip(selectedText, selectionType, rect);
    }, 50);
  }

  // Show compact chip UI
  function showChip(text, type, rect) {
    removeChip();

    const chip = document.createElement('div');
    chip.className = 'mylingo-chip';
    chip.id = 'mylingo-chip';

    // Position chip below selection
    chip.style.position = 'fixed';
    chip.style.left = rect.left + 'px';
    chip.style.top = (rect.bottom + 10) + 'px';
    chip.style.zIndex = '2147483647';

    // Show loading state
    chip.innerHTML = `
      <div class="mylingo-chip-content">
        <span class="mylingo-chip-loading">${i18n ? i18n.t('analyzing') : 'Analyzing...'}</span>
      </div>
    `;

    document.body.appendChild(chip);
    currentChip = chip;

    // Analyze text
    analyzeText(text, type, chip);
  }

  // Analyze text with AI
  async function analyzeText(text, type, chip) {
    if (!aiUtils) {
      showError('AI not available');
      return;
    }

    try {
      let translation = '';
      let analysis = null;

      switch (type) {
        case 'WORD':
          translation = await aiUtils.translate(text, settings.targetLanguage, settings.nativeLanguage);
          analysis = await aiUtils.analyzeWord(text, settings.targetLanguage, settings.nativeLanguage, settings.proficiencyLevel);
          break;

        case 'SENTENCE':
          translation = await aiUtils.translate(text, settings.targetLanguage, settings.nativeLanguage);
          analysis = await aiUtils.analyzeSentence(text, settings.targetLanguage, settings.nativeLanguage, settings.proficiencyLevel);
          break;

        case 'PARAGRAPH':
          translation = await aiUtils.translate(text.substring(0, 200), settings.targetLanguage, settings.nativeLanguage);
          translation += '...';
          analysis = await aiUtils.analyzeParagraph(text, settings.targetLanguage, settings.nativeLanguage, settings.proficiencyLevel);
          break;
      }

      // Update chip with translation
      updateChip(chip, text, translation, type, analysis);

    } catch (error) {
      console.error('Analysis error:', error);
      showError('Analysis failed');
    }
  }

  // Update chip with translation
  function updateChip(chip, originalText, translation, type, analysis) {
    const moreLabel = i18n ? i18n.t('more') : 'More';
    
    chip.innerHTML = `
      <div class="mylingo-chip-content">
        <span class="mylingo-chip-text">${escapeHtml(translation)}</span>
        <button class="mylingo-chip-more" data-type="${type}">
          ${moreLabel} ▼
        </button>
      </div>
    `;

    // Add click handler for "More" button
    const moreBtn = chip.querySelector('.mylingo-chip-more');
    moreBtn.addEventListener('click', () => {
      showDialog(originalText, translation, type, analysis, chip.getBoundingClientRect());
    });

    // Add TTS button for words/sentences
    if (type !== 'PARAGRAPH') {
      const ttsBtn = document.createElement('button');
      ttsBtn.className = 'mylingo-chip-tts';
      ttsBtn.innerHTML = '🔊';
      ttsBtn.title = i18n ? i18n.t('listen') : 'Listen';
      ttsBtn.addEventListener('click', async () => {
        try {
          await aiUtils.speak(originalText, settings.targetLanguage);
        } catch (e) {
          console.error('TTS error:', e);
        }
      });
      chip.querySelector('.mylingo-chip-content').insertBefore(ttsBtn, moreBtn);
    }
  }

  // Show full dialog
  function showDialog(originalText, translation, type, analysis, chipRect) {
    removeDialog();

    const dialog = document.createElement('div');
    dialog.className = 'mylingo-dialog';
    dialog.id = 'mylingo-dialog';

    // Position dialog
    dialog.style.position = 'fixed';
    dialog.style.left = Math.min(chipRect.left, window.innerWidth - 520) + 'px';
    dialog.style.top = Math.min(chipRect.bottom + 10, window.innerHeight - 600) + 'px';
    dialog.style.zIndex = '2147483648';

    // Build dialog content based on type
    let content = '';
    switch (type) {
      case 'WORD':
        content = buildWordDialog(originalText, translation, analysis);
        break;
      case 'SENTENCE':
        content = buildSentenceDialog(originalText, translation, analysis);
        break;
      case 'PARAGRAPH':
        content = buildParagraphDialog(originalText, translation, analysis);
        break;
    }

    dialog.innerHTML = content;
    document.body.appendChild(dialog);
    currentDialog = dialog;

    // Add event listeners
    addDialogEventListeners(dialog, originalText, type, analysis);

    // Click outside to close
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  }

  // Build word dialog content
  function buildWordDialog(word, translation, analysis) {
    const t = (key) => i18n ? i18n.t(key) : key;
    
    return `
      <div class="mylingo-dialog-header">
        <h2>${escapeHtml(word)}</h2>
        <button class="mylingo-dialog-close">✕</button>
      </div>
      <div class="mylingo-dialog-body">
        <div class="mylingo-section">
          <h3>🌍 ${t('translation')}</h3>
          <p class="mylingo-translation">${escapeHtml(translation)}</p>
        </div>

        ${analysis.partOfSpeech ? `
        <div class="mylingo-section">
          <h3>📝 ${t('partOfSpeech')}</h3>
          <p>${t(analysis.partOfSpeech)}${analysis.gender ? ' - ' + t(analysis.gender) : ''}</p>
        </div>
        ` : ''}

        ${analysis.pronunciation ? `
        <div class="mylingo-section">
          <h3>🔊 ${t('pronunciation')}</h3>
          <p>${escapeHtml(analysis.pronunciation)}</p>
          <button class="mylingo-tts-btn" data-text="${escapeHtml(word)}">${t('listen')}</button>
        </div>
        ` : ''}

        ${analysis.level ? `
        <div class="mylingo-section">
          <h3>📊 ${t('level')}</h3>
          <p>${t(analysis.level)}</p>
        </div>
        ` : ''}

        ${analysis.examples && analysis.examples.length > 0 ? `
        <div class="mylingo-section">
          <h3>📚 ${t('examples')}</h3>
          ${analysis.examples.map(ex => `
            <div class="mylingo-example">
              <p class="mylingo-example-target">${escapeHtml(ex.target)}</p>
              <p class="mylingo-example-native">${escapeHtml(ex.native)}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${analysis.relatedWords && analysis.relatedWords.length > 0 ? `
        <div class="mylingo-section">
          <h3>🔗 ${t('relatedWords')}</h3>
          <p>${analysis.relatedWords.map(w => escapeHtml(w)).join(', ')}</p>
        </div>
        ` : ''}

        <div class="mylingo-section mylingo-actions">
          <button class="mylingo-save-btn">${t('saveToNotes')}</button>
        </div>
      </div>
    `;
  }

  // Build sentence dialog content
  function buildSentenceDialog(sentence, translation, analysis) {
    const t = (key) => i18n ? i18n.t(key) : key;
    
    return `
      <div class="mylingo-dialog-header">
        <h2>${t('sentence')}</h2>
        <button class="mylingo-dialog-close">✕</button>
      </div>
      <div class="mylingo-dialog-body">
        <div class="mylingo-section">
          <h3>📖 ${t('originalText')}</h3>
          <p class="mylingo-original">${escapeHtml(sentence)}</p>
        </div>

        <div class="mylingo-section">
          <h3>🌍 ${t('translation')}</h3>
          <p class="mylingo-translation">${escapeHtml(translation)}</p>
        </div>

        <div class="mylingo-section">
          <h3>🔊 ${t('pronunciation')}</h3>
          <button class="mylingo-tts-btn" data-text="${escapeHtml(sentence)}">${t('listen')}</button>
        </div>

        ${analysis.grammarPoints && analysis.grammarPoints.length > 0 ? `
        <div class="mylingo-section">
          <h3>🎯 ${t('keyGrammar')}</h3>
          ${analysis.grammarPoints.map(gp => `
            <div class="mylingo-grammar-point">
              <strong>${escapeHtml(gp.element)}</strong>: ${escapeHtml(gp.explanation)}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${analysis.level ? `
        <div class="mylingo-section">
          <h3>📊 ${t('level')}</h3>
          <p>${t(analysis.level)}</p>
        </div>
        ` : ''}

        ${analysis.context ? `
        <div class="mylingo-section">
          <h3>🗣️ ${t('context')}</h3>
          <p>${analysis.context}</p>
        </div>
        ` : ''}

        <div class="mylingo-section mylingo-actions">
          <button class="mylingo-save-btn">${t('saveToNotes')}</button>
        </div>
      </div>
    `;
  }

  // Build paragraph dialog content
  function buildParagraphDialog(paragraph, translation, analysis) {
    const t = (key) => i18n ? i18n.t(key) : key;
    
    return `
      <div class="mylingo-dialog-header">
        <h2>📄 ${t('paragraph')}</h2>
        <button class="mylingo-dialog-close">✕</button>
      </div>
      <div class="mylingo-dialog-body">
        <div class="mylingo-section">
          <h3>📖 ${t('originalText')}</h3>
          <div class="mylingo-scrollable">${escapeHtml(paragraph)}</div>
        </div>

        <div class="mylingo-section">
          <h3>🌍 ${t('translation')}</h3>
          <div class="mylingo-scrollable">${escapeHtml(analysis.translation || translation)}</div>
        </div>

        ${analysis.difficulty ? `
        <div class="mylingo-section">
          <h3>📊 ${t('difficulty')}</h3>
          <p>${t(analysis.difficulty)}</p>
        </div>
        ` : ''}

        ${analysis.keyVocabulary && analysis.keyVocabulary.length > 0 ? `
        <div class="mylingo-section">
          <h3>📚 ${t('keyVocabulary')}</h3>
          <div class="mylingo-vocab-list">
            ${analysis.keyVocabulary.map(v => `
              <div class="mylingo-vocab-item">
                <span class="mylingo-vocab-word">${escapeHtml(v.word)}</span>
                <span class="mylingo-vocab-translation">${escapeHtml(v.translation)}</span>
                ${v.level ? `<span class="mylingo-vocab-level">${t(v.level)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${analysis.grammarPoints && analysis.grammarPoints.length > 0 ? `
        <div class="mylingo-section">
          <h3>🎯 ${t('keyGrammar')}</h3>
          <ul>
            ${analysis.grammarPoints.map(gp => `<li>${escapeHtml(gp)}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${analysis.topics && analysis.topics.length > 0 ? `
        <div class="mylingo-section">
          <h3>🗂️ ${t('topicTags')}</h3>
          <div class="mylingo-tags">
            ${analysis.topics.map(topic => `<span class="mylingo-tag">#${escapeHtml(topic)}</span>`).join('')}
          </div>
        </div>
        ` : ''}

        <div class="mylingo-section mylingo-actions">
          <button class="mylingo-save-btn">${t('saveToNotes')}</button>
        </div>
      </div>
    `;
  }

  // Add event listeners to dialog
  function addDialogEventListeners(dialog, originalText, type, analysis) {
    // Close button
    const closeBtn = dialog.querySelector('.mylingo-dialog-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', removeDialog);
    }

    // TTS buttons
    const ttsButtons = dialog.querySelectorAll('.mylingo-tts-btn');
    ttsButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.text;
        try {
          await aiUtils.speak(text, settings.targetLanguage);
        } catch (e) {
          console.error('TTS error:', e);
        }
      });
    });

    // Save button
    const saveBtn = dialog.querySelector('.mylingo-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        await saveToNotes(originalText, type, analysis);
        saveBtn.textContent = i18n ? i18n.t('saved') : 'Saved!';
        saveBtn.disabled = true;
        setTimeout(() => {
          removeDialog();
          removeChip();
        }, 1000);
      });
    }
  }

  // Save to notes
  async function saveToNotes(text, type, analysis) {
    const note = {
      id: Date.now().toString(),
      text,
      type,
      analysis,
      targetLanguage: settings.targetLanguage,
      nativeLanguage: settings.nativeLanguage,
      url: window.location.href,
      pageTitle: document.title,
      savedAt: new Date().toISOString()
    };

    const { notes = [] } = await chrome.storage.local.get('notes');
    notes.unshift(note);
    
    // Keep only last 500 notes
    if (notes.length > 500) {
      notes.length = 500;
    }

    await chrome.storage.local.set({ notes });
    console.log('Note saved:', note);

    // Show toast
    showToast(i18n ? i18n.t('addedToNotes') : 'Added to notes!');
  }

  // Helper functions
  function removeChip() {
    if (currentChip) {
      currentChip.remove();
      currentChip = null;
    }
  }

  function removeDialog() {
    if (currentDialog) {
      currentDialog.remove();
      currentDialog = null;
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  function handleOutsideClick(e) {
    if (currentDialog && !currentDialog.contains(e.target) && 
        currentChip && !currentChip.contains(e.target)) {
      removeDialog();
      removeChip();
    }
  }

  // Show error message
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mylingo-toast mylingo-toast-error';
    errorDiv.innerHTML = `
      <strong>MyLingo Error</strong><br>
      ${message}
      <br><br>
      <small>Make sure Chrome AI flags are enabled at chrome://flags</small>
    `;
    errorDiv.style.maxWidth = '400px';
    errorDiv.style.lineHeight = '1.5';
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 8000);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'mylingo-toast mylingo-toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
