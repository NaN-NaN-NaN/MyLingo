// content.js - Main content script that runs on all pages

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

// Map language codes to supported API languages [en, es, ja]
function getApiLanguage(langCode) {
  const baseLang = langCode.split('-')[0];
  const languageMap = { 'en': 'en', 'es': 'es', 'ja': 'ja' };
  return languageMap[baseLang] || 'en';
}

// Initialize
async function init() {
  try {
    // Load i18n
    if (typeof I18n !== 'undefined') {
      i18n = new I18n();
      await i18n.init();
    }

    // Load settings first
    const stored = await chrome.storage.sync.get(['isEnabled', 'targetLanguage', 'nativeLanguage', 'proficiencyLevel']);
    isEnabled = stored.isEnabled || false;
    settings.targetLanguage = stored.targetLanguage || 'es';
    settings.nativeLanguage = stored.nativeLanguage || 'en';
    settings.proficiencyLevel = stored.proficiencyLevel || 'B1';

    // Load AI utils with language parameter
    if (typeof AIUtils !== 'undefined') {
      aiUtils = new AIUtils();
      const apiLanguage = getApiLanguage(settings.nativeLanguage);
      await aiUtils.initPromptAPI(apiLanguage);
    }

    // ALWAYS add event listeners (we check isEnabled inside the handler)
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

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

    console.log('[MyLingo] Ready! isEnabled:', isEnabled);
  } catch (error) {
    console.error('[MyLingo] Initialization error:', error);
  }
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
    const wordCount = selectedText.split(/\s+/).length;
    let selectionType = 'WORD';
    if (wordCount > 50) {
      selectionType = 'TOO_LONG';
    } else if (wordCount > 10) {
      selectionType = 'PARAGRAPH';
    } else if (wordCount > 1) {
      selectionType = 'SENTENCE';
    }

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

  // Show "To MyLingo" link
  chip.innerHTML = `
    <div class="mylingo-chip-content">
      <a href="#" class="mylingo-chip-link">📚 To MyLingo</a>
      <span class="mylingo-chip-loader" style="display: none;">⏳</span>
    </div>
  `;

  document.body.appendChild(chip);
  currentChip = chip;

  // Add click handler
  const link = chip.querySelector('.mylingo-chip-link');
  const loader = chip.querySelector('.mylingo-chip-loader');

  link.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Show loading indicator
    link.style.opacity = '0.6';
    loader.style.display = 'inline';

    // Analyze text
    analyzeText(text, type, chip, rect);
  });
}

// Analyze text with AI
async function analyzeText(text, type, chip, rect) {
  if (!aiUtils) {
    showError('AI not available');
    return;
  }

  try {
    // Show dialog immediately with loading state
    showDialogWithLoading(text, type, rect);

    // Translate: from target language to native language
    const translation = await aiUtils.translate(text, settings.nativeLanguage, settings.targetLanguage);

    // Update dialog with translation immediately
    updateDialogTranslation(translation);

    let analysis = null;
    switch (type) {
      case 'WORD':
        analysis = await aiUtils.analyzeWord(text, settings.targetLanguage, settings.nativeLanguage, settings.proficiencyLevel);
        break;

      case 'SENTENCE':
        analysis = await aiUtils.analyzeSentence(text, settings.targetLanguage, settings.nativeLanguage, settings.proficiencyLevel);
        break;

      case 'PARAGRAPH':
        analysis = await aiUtils.analyzeParagraph(text, settings.targetLanguage, settings.nativeLanguage, settings.proficiencyLevel);
        break;
    }

    // Update dialog with full analysis
    updateDialogWithAnalysis(text, translation, type, analysis);

  } catch (error) {
    console.error('[MyLingo] Analysis error:', error);
    showError('Analysis failed: ' + error.message);
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

// Show dialog with loading state
function showDialogWithLoading(originalText, type, chipRect) {
  removeDialog();

  const dialog = document.createElement('div');
  dialog.className = 'mylingo-dialog';
  dialog.id = 'mylingo-dialog';

  // Position dialog
  dialog.style.position = 'fixed';
  dialog.style.left = Math.min(chipRect.left, window.innerWidth - 520) + 'px';
  dialog.style.top = Math.min(chipRect.bottom + 10, window.innerHeight - 600) + 'px';
  dialog.style.zIndex = '2147483648';

  // Show loading state
  dialog.innerHTML = `
    <div class="mylingo-dialog-header">
      <h2>${escapeHtml(originalText)}</h2>
      <button class="mylingo-dialog-close">✕</button>
    </div>
    <div class="mylingo-dialog-body">
      <div class="mylingo-section">
        <div class="mylingo-loading">
          <span class="mylingo-spinner">⏳</span>
          <span>Loading...</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  currentDialog = dialog;

  // Add close button handler
  const closeBtn = dialog.querySelector('.mylingo-dialog-close');
  closeBtn.addEventListener('click', removeDialog);

  // Click outside to close
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 100);
}

// Update dialog with translation
function updateDialogTranslation(translation) {
  if (!currentDialog) return;

  const body = currentDialog.querySelector('.mylingo-dialog-body');
  if (!body) return;

  body.innerHTML = `
    <div class="mylingo-section">
      <h3>🌍 Translation</h3>
      <p class="mylingo-translation">${escapeHtml(translation)}</p>
    </div>
    <div class="mylingo-section">
      <div class="mylingo-loading">
        <span class="mylingo-spinner">⏳</span>
        <span>Analyzing...</span>
      </div>
    </div>
  `;
}

// Update dialog with full analysis
function updateDialogWithAnalysis(originalText, translation, type, analysis) {
  if (!currentDialog) return;

  let content = '';
  switch (type) {
    case 'WORD':
      content = buildWordDialogContent(originalText, translation, analysis);
      break;
    case 'SENTENCE':
      content = buildSentenceDialogContent(originalText, translation, analysis);
      break;
    case 'PARAGRAPH':
      content = buildParagraphDialogContent(originalText, translation, analysis);
      break;
  }

  const body = currentDialog.querySelector('.mylingo-dialog-body');
  if (body) {
    body.innerHTML = content;
    addDialogEventListeners(currentDialog, originalText, type, analysis);
  }
}

// Build word dialog content (body only)
function buildWordDialogContent(word, translation, analysis) {
  const t = (key) => i18n ? i18n.t(key) : key;

  // Parse analysis raw text for structured information
  const analysisText = analysis && analysis.raw ? analysis.raw : '';

  return `
    <div class="mylingo-info-grid">
      <div class="mylingo-info-row">
        <span class="mylingo-info-icon">🌍</span>
        <span class="mylingo-info-label">Translation</span>
        <span class="mylingo-info-value">"${escapeHtml(translation)}"</span>
      </div>
    </div>

    ${analysisText ? `
    <div class="mylingo-section">
      <h3>📝 Analysis</h3>
      <div class="mylingo-analysis-text">${escapeHtml(analysisText)}</div>
    </div>
    ` : ''}

    <div class="mylingo-actions-row">
      <button class="mylingo-action-btn mylingo-listen-btn" data-text="${escapeHtml(word)}">
        <span class="mylingo-btn-icon">🔊</span>
        <span>Listen</span>
      </button>
      <button class="mylingo-action-btn mylingo-save-btn-small">
        <span class="mylingo-btn-icon">💾</span>
        <span>Save</span>
      </button>
    </div>
  `;
}

// Build sentence dialog content (body only)
function buildSentenceDialogContent(sentence, translation, analysis) {
  const t = (key) => i18n ? i18n.t(key) : key;
  const analysisText = analysis && analysis.raw ? analysis.raw : '';

  return `
    <div class="mylingo-section">
      <h3>📖 Original</h3>
      <p class="mylingo-original">${escapeHtml(sentence)}</p>
    </div>

    <div class="mylingo-info-grid">
      <div class="mylingo-info-row">
        <span class="mylingo-info-icon">🌍</span>
        <span class="mylingo-info-label">Translation</span>
        <span class="mylingo-info-value">"${escapeHtml(translation)}"</span>
      </div>
    </div>

    ${analysisText ? `
    <div class="mylingo-section">
      <h3>📝 Analysis</h3>
      <div class="mylingo-analysis-text">${escapeHtml(analysisText)}</div>
    </div>
    ` : ''}

    <div class="mylingo-actions-row">
      <button class="mylingo-action-btn mylingo-listen-btn" data-text="${escapeHtml(sentence)}">
        <span class="mylingo-btn-icon">🔊</span>
        <span>Listen</span>
      </button>
      <button class="mylingo-action-btn mylingo-save-btn-small">
        <span class="mylingo-btn-icon">💾</span>
        <span>Save</span>
      </button>
    </div>
  `;
}

// Build paragraph dialog content (body only)
function buildParagraphDialogContent(paragraph, translation, analysis) {
  const t = (key) => i18n ? i18n.t(key) : key;
  const analysisText = analysis && analysis.raw ? analysis.raw : '';

  return `
    <div class="mylingo-section">
      <h3>📖 Original</h3>
      <div class="mylingo-scrollable">${escapeHtml(paragraph)}</div>
    </div>

    <div class="mylingo-section">
      <h3>🌍 Translation</h3>
      <div class="mylingo-scrollable">${escapeHtml(translation)}</div>
    </div>

    ${analysisText ? `
    <div class="mylingo-section">
      <h3>📝 Summary</h3>
      <div class="mylingo-analysis-text">${escapeHtml(analysisText)}</div>
    </div>
    ` : ''}

    <div class="mylingo-actions-row">
      <button class="mylingo-action-btn mylingo-save-btn-small">
        <span class="mylingo-btn-icon">💾</span>
        <span>Save</span>
      </button>
    </div>
  `;
}

// Add event listeners to dialog
function addDialogEventListeners(dialog, originalText, type, analysis) {
  // Listen buttons
  const listenButtons = dialog.querySelectorAll('.mylingo-listen-btn');
  listenButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.text || originalText;
      try {
        await aiUtils.speak(text, settings.targetLanguage);
      } catch (e) {
        console.error('TTS error:', e);
      }
    });
  });

  // Save buttons
  const saveButtons = dialog.querySelectorAll('.mylingo-save-btn-small');
  saveButtons.forEach(saveBtn => {
    saveBtn.addEventListener('click', async () => {
      await saveToNotes(originalText, type, analysis);
      saveBtn.innerHTML = '<span class="mylingo-btn-icon">✓</span><span>Saved!</span>';
      saveBtn.disabled = true;
      setTimeout(() => {
        removeDialog();
        removeChip();
      }, 1000);
    });
  });
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

function showError(message) {
  const toast = document.createElement('div');
  toast.className = 'mylingo-toast mylingo-toast-error';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
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
