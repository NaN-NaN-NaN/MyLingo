// popup.js - Popup interface logic

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

  // Load saved settings
  const settings = await chrome.storage.sync.get([
    'isEnabled',
    'targetLanguage',
    'nativeLanguage',
    'proficiencyLevel'
  ]);

  // Initialize UI with saved settings
  toggleSwitch.checked = settings.isEnabled || false;
  targetLanguageSelect.value = settings.targetLanguage || 'es';
  nativeLanguageSelect.value = settings.nativeLanguage || 'en';
  proficiencyLevelSelect.value = settings.proficiencyLevel || 'B1';

  updateStatusIndicator(toggleSwitch.checked);

  // Load statistics
  await loadStatistics();

  // Event listeners
  toggleSwitch.addEventListener('change', async (e) => {
    const isEnabled = e.target.checked;
    await chrome.storage.sync.set({ isEnabled });
    updateStatusIndicator(isEnabled);
    
    // Show feedback
    showToast(isEnabled ? 'MyLingo Enabled ✓' : 'MyLingo Disabled');
  });

  targetLanguageSelect.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ targetLanguage: e.target.value });
    showToast('Target language updated');
  });

  nativeLanguageSelect.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ nativeLanguage: e.target.value });
    showToast('Native language updated');
  });

  proficiencyLevelSelect.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ proficiencyLevel: e.target.value });
    showToast('Proficiency level updated');
  });

  viewNotesBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'notes.html' });
  });

  // Functions
  function updateStatusIndicator(isEnabled) {
    const dot = statusIndicator.querySelector('.status-dot');
    const text = statusIndicator.querySelector('.status-text');

    if (isEnabled) {
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
