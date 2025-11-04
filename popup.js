// popup.js - Popup interface logic
// AIUtils is loaded globally from ai-utils.js

document.addEventListener('DOMContentLoaded', async () => {
  // DOM elements
  const toggleSwitch = document.getElementById('toggleMyLingo');
  const statusIndicator = document.getElementById('statusIndicator');
  const targetLanguageSelect = document.getElementById('targetLanguage');
  const nativeLanguageSelect = document.getElementById('nativeLanguage');
  const proficiencyLevelSelect = document.getElementById('proficiencyLevel');
  const notesCountEl = document.getElementById('notesCount');
  const todayCountEl = document.getElementById('todayCount');
  const viewNotesBtn = document.getElementById('viewNotesBtn');
  const downloadProgressSection = document.getElementById('downloadProgress');
  const promptBar = document.getElementById('promptBar');
  const promptPercent = document.getElementById('promptPercent');
  const summarizerBar = document.getElementById('summarizerBar');
  const summarizerPercent = document.getElementById('summarizerPercent');
  const translatorBar = document.getElementById('translatorBar');
  const translatorPercent = document.getElementById('translatorPercent');
  const downloadModelsBtn = document.getElementById('downloadModelsBtn');

  const DEFAULTY_TARGET_LANGUAGE = 'de';
  const DEFAULTY_NATIVE_LANGUAGE = 'en';
  const DEFAULTY_PROFICIENCY_LEVEL = 'A2';

  const aiUtils = new AIUtils();
  let currentDownloadProgress = { prompt: 0, summarizer: 0, translator: 0 };
  let isDownloading = false;

  // Map language codes to supported API languages [en, es, ja]
  function getApiLanguage(langCode) {
    // Extract base language (e.g., 'zh-CN' -> 'zh')
    const baseLang = langCode.split('-')[0];

    // Map to supported languages
    const languageMap = {
      'en': 'en',
      'es': 'es',
      'ja': 'ja',
      // Default everything else to English
    };

    return languageMap[baseLang] || 'en';
  }


  // Load saved settings
  const settings = await chrome.storage.sync.get([
    'isEnabled',
    'targetLanguage',
    'nativeLanguage',
    'proficiencyLevel'
  ]);

  // Initialize UI with saved settings
  toggleSwitch.checked = settings.isEnabled || false;
  targetLanguageSelect.value = settings.targetLanguage || DEFAULTY_TARGET_LANGUAGE;
  nativeLanguageSelect.value = settings.nativeLanguage || DEFAULTY_NATIVE_LANGUAGE;
  proficiencyLevelSelect.value = settings.proficiencyLevel || DEFAULTY_PROFICIENCY_LEVEL;

  // Check AI availability and update UI
  await checkAIAvailability();

  updateStatusIndicator(toggleSwitch.checked);

  // Load statistics
  await loadStatistics();

  // Event listeners
  toggleSwitch.addEventListener('change', async (e) => {
    const isEnabled = e.target.checked;
    console.log('[Popup] Toggle changed to:', isEnabled);

    if (isEnabled) {
      // Check if all APIs are ready before enabling
      const apiLanguage = getApiLanguage(nativeLanguageSelect.value);
      console.log('[Popup] Checking if all ready with:', {
        sourceLanguage: nativeLanguageSelect.value,
        targetLanguage: targetLanguageSelect.value,
        language: apiLanguage
      });

      const allReady = await aiUtils.allReady({
        sourceLanguage: nativeLanguageSelect.value,
        targetLanguage: targetLanguageSelect.value,
        language: apiLanguage
      });

      console.log('[Popup] All ready result:', allReady);

      if (!allReady) {
        // Prevent toggle and ask user to download
        console.log('[Popup] Not all ready, preventing toggle');
        e.preventDefault();
        toggleSwitch.checked = false;

        const confirmed = confirm(
          'MyLingo requires downloading AI models:\n\n' +
          '• Prompt API (for generating content)\n' +
          '• Summarizer API (for explanations)\n' +
          '• Translator API (' + nativeLanguageSelect.value + ' ↔ ' + targetLanguageSelect.value + ')\n\n' +
          'This will download approximately 1-2 GB of data.\n\n' +
          'Would you like to proceed with the download?'
        );

        if (confirmed) {
          await downloadAllModels();
        }
        return;
      }
    }

    console.log('[Popup] Saving isEnabled:', isEnabled);
    await chrome.storage.sync.set({ isEnabled });
    updateStatusIndicator(isEnabled);

    // Show feedback
    showToast(isEnabled ? 'MyLingo Enabled ✓' : 'MyLingo Disabled');
  });

  targetLanguageSelect.addEventListener('change', async (e) => {
    const newTargetLang = e.target.value;
    const sourceLang = nativeLanguageSelect.value;

    // Check if translator for new language pair is available
    const translatorStatus = await aiUtils.checkTranslatorAvailability({
      sourceLanguage: sourceLang,
      targetLanguage: newTargetLang
    });

    if (translatorStatus !== 'available') {
      const confirmed = confirm(
        'Changing to this language requires downloading a new Translator model:\n\n' +
        sourceLang + ' ↔ ' + newTargetLang + '\n\n' +
        'This will download approximately 100-500 MB.\n\n' +
        'Would you like to proceed?'
      );

      if (confirmed) {
        await downloadTranslator(sourceLang, newTargetLang);
        await chrome.storage.sync.set({ targetLanguage: newTargetLang });
        showToast('Target language updated');
      } else {
        // Revert selection
        targetLanguageSelect.value = settings.targetLanguage || DEFAULTY_TARGET_LANGUAGE;
      }
    } else {
      await chrome.storage.sync.set({ targetLanguage: newTargetLang });
      showToast('Target language updated');
    }

    await checkAIAvailability();
  });

  nativeLanguageSelect.addEventListener('change', async (e) => {
    const newNativeLang = e.target.value;
    const targetLang = targetLanguageSelect.value;

    // Check if translator for new language pair is available
    const translatorStatus = await aiUtils.checkTranslatorAvailability({
      sourceLanguage: newNativeLang,
      targetLanguage: targetLang
    });

    if (translatorStatus !== 'available') {
      const confirmed = confirm(
        'Changing to this language requires downloading a new Translator model:\n\n' +
        newNativeLang + ' ↔ ' + targetLang + '\n\n' +
        'This will download approximately 100-500 MB.\n\n' +
        'Would you like to proceed?'
      );

      if (confirmed) {
        await downloadTranslator(newNativeLang, targetLang);
        await chrome.storage.sync.set({ nativeLanguage: newNativeLang });
        showToast('Native language updated');
      } else {
        // Revert selection
        nativeLanguageSelect.value = settings.nativeLanguage || DEFAULTY_NATIVE_LANGUAGE;
      }
    } else {
      await chrome.storage.sync.set({ nativeLanguage: newNativeLang });
      showToast('Native language updated');
    }

    await checkAIAvailability();
  });

  proficiencyLevelSelect.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ proficiencyLevel: e.target.value });
    showToast('Proficiency level updated');
  });

  viewNotesBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'notes.html' });
  });

  downloadModelsBtn.addEventListener('click', async () => {
    await downloadAllModels();
  });

  // Functions
  async function checkAIAvailability() {
    try {
      const apiLanguage = getApiLanguage(nativeLanguageSelect.value);

      const allReady = await aiUtils.allReady({
        sourceLanguage: nativeLanguageSelect.value,
        targetLanguage: targetLanguageSelect.value,
        language: apiLanguage
      });

      // Disable toggle if AI not ready
      toggleSwitch.disabled = !allReady;

      if (!allReady) {
        const statuses = await aiUtils.checkAll({
          sourceLanguage: nativeLanguageSelect.value,
          targetLanguage: targetLanguageSelect.value,
          language: apiLanguage
        });

        const missing = [];
        if (statuses.prompt !== 'available') missing.push('Prompt API');
        if (statuses.summarizer !== 'available') missing.push('Summarizer');
        if (statuses.translator !== 'available') missing.push('Translator');

        updateStatusIndicator(false, 'AI models not ready: ' + missing.join(', '));

        // Show download button
        downloadModelsBtn.style.display = 'block';
      } else {
        toggleSwitch.disabled = false;
        updateStatusIndicator(toggleSwitch.checked);

        // Hide download button
        downloadModelsBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Error checking AI availability:', error);
      updateStatusIndicator(false, 'Error checking AI: ' + error.message);
      toggleSwitch.disabled = true;
    }
  }

  function updateStatusIndicator(isEnabled, customMessage = null) {
    const dot = statusIndicator.querySelector('.status-dot');
    const text = statusIndicator.querySelector('.status-text');

    if (customMessage) {
      statusIndicator.classList.add('disabled');
      dot.classList.add('disabled');
      text.classList.add('disabled');
      text.textContent = customMessage;
    } else if (isEnabled) {
      statusIndicator.classList.remove('disabled');
      dot.classList.remove('disabled');
      text.classList.remove('disabled');
      text.textContent = 'Active - Select text to learn';
    } else {
      statusIndicator.classList.add('disabled');
      dot.classList.add('disabled');
      text.classList.add('disabled');
      text.textContent = 'Disabled - Toggle to activate';
    }
  }

  async function loadStatistics() {
    try {
      const { notes = [] } = await chrome.storage.local.get('notes');
      
      // Total notes count
      notesCountEl.textContent = notes.length;

      // Today's count
      const today = new Date().toDateString();
      const todayNotes = notes.filter(note => {
        const noteDate = new Date(note.savedAt).toDateString();
        return noteDate === today;
      });
      todayCountEl.textContent = todayNotes.length;

    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async function downloadAllModels() {
    if (isDownloading) return;
    isDownloading = true;

    // Show progress section
    downloadProgressSection.style.display = 'block';
    resetProgressBars();

    try {
      const onProgress = (model, percent) => {
        currentDownloadProgress[model] = percent;
        updateProgressBars();
      };

      const apiLanguage = getApiLanguage(nativeLanguageSelect.value);

      await aiUtils.downloadAll({
        sourceLanguage: nativeLanguageSelect.value,
        targetLanguage: targetLanguageSelect.value,
        language: apiLanguage
      }, onProgress);

      showToast('All AI models downloaded successfully!');
      await checkAIAvailability();

      // Auto-enable after successful download
      toggleSwitch.checked = true;
      await chrome.storage.sync.set({ isEnabled: true });
      updateStatusIndicator(true);

    } catch (error) {
      console.error('Download failed:', error);
      showToast('Download failed: ' + error.message);
    } finally {
      isDownloading = false;
      // Hide progress section after a delay
      setTimeout(() => {
        downloadProgressSection.style.display = 'none';
        resetProgressBars();
      }, 2000);
    }
  }

  async function downloadTranslator(sourceLang, targetLang) {
    if (isDownloading) return;
    isDownloading = true;

    // Show progress section (only translator)
    downloadProgressSection.style.display = 'block';
    document.getElementById('promptProgress').style.display = 'none';
    document.getElementById('summarizerProgress').style.display = 'none';
    resetProgressBars();

    try {
      const onProgress = (model, percent) => {
        currentDownloadProgress.translator = percent;
        updateProgressBars();
      };

      await aiUtils.downloadTranslator({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      }, onProgress);

      showToast('Translator model downloaded successfully!');
      await checkAIAvailability();

    } catch (error) {
      console.error('Translator download failed:', error);
      showToast('Download failed: ' + error.message);
    } finally {
      isDownloading = false;
      // Hide progress section after a delay
      setTimeout(() => {
        downloadProgressSection.style.display = 'none';
        document.getElementById('promptProgress').style.display = 'block';
        document.getElementById('summarizerProgress').style.display = 'block';
        resetProgressBars();
      }, 2000);
    }
  }

  function updateProgressBars() {
    promptBar.style.width = currentDownloadProgress.prompt + '%';
    promptPercent.textContent = currentDownloadProgress.prompt + '%';
    summarizerBar.style.width = currentDownloadProgress.summarizer + '%';
    summarizerPercent.textContent = currentDownloadProgress.summarizer + '%';
    translatorBar.style.width = currentDownloadProgress.translator + '%';
    translatorPercent.textContent = currentDownloadProgress.translator + '%';
  }

  function resetProgressBars() {
    currentDownloadProgress = { prompt: 0, summarizer: 0, translator: 0 };
    updateProgressBars();
  }

  function showToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1F2937;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      z-index: 1000;
      animation: toastFade 2s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // Add toast animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastFade {
      0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
      10% { opacity: 1; transform: translateX(-50%) translateY(0); }
      90% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
    }
  `;
  document.head.appendChild(style);
});
