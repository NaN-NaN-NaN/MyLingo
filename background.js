// background.js - Background service worker

console.log('MyLingo background service worker loaded');

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('MyLingo installed');

  // Set default settings
  const defaults = {
    isEnabled: false,
    targetLanguage: 'es',
    nativeLanguage: 'en',
    proficiencyLevel: 'B1'
  };

  // Only set if not already set
  const existing = await chrome.storage.sync.get(Object.keys(defaults));
  const toSet = {};
  
  for (const [key, value] of Object.entries(defaults)) {
    if (existing[key] === undefined) {
      toSet[key] = value;
    }
  }

  if (Object.keys(toSet).length > 0) {
    await chrome.storage.sync.set(toSet);
  }

  // Initialize notes storage
  const { notes } = await chrome.storage.local.get('notes');
  if (!notes) {
    await chrome.storage.local.set({ notes: [] });
  }
});

// Update badge based on enabled status
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.isEnabled) {
    updateBadge(changes.isEnabled.newValue);
  }
});

async function updateBadge(isEnabled) {
  if (isEnabled) {
    await chrome.action.setBadgeText({ text: 'ON' });
    await chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
  } else {
    await chrome.action.setBadgeText({ text: '' });
  }
}

// Initialize badge on startup
chrome.runtime.onStartup.addListener(async () => {
  const { isEnabled } = await chrome.storage.sync.get('isEnabled');
  updateBadge(isEnabled || false);
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  if (request.action === 'saveNote') {
    saveNote(request.note).then(sendResponse);
    return true; // Keep channel open for async response
  }

  if (request.action === 'getSettings') {
    getSettings().then(sendResponse);
    return true;
  }
});

async function saveNote(note) {
  try {
    const { notes = [] } = await chrome.storage.local.get('notes');
    notes.unshift(note);

    // Keep only last 500 notes
    if (notes.length > 500) {
      notes.length = 500;
    }

    await chrome.storage.local.set({ notes });
    return { success: true };
  } catch (error) {
    console.error('Error saving note:', error);
    return { success: false, error: error.message };
  }
}

async function getSettings() {
  return await chrome.storage.sync.get([
    'isEnabled',
    'targetLanguage',
    'nativeLanguage',
    'proficiencyLevel'
  ]);
}

// Context menu (optional - for future enhancement)
// chrome.contextMenus.create({
//   id: 'myLingoAnalyze',
//   title: 'Analyze with MyLingo',
//   contexts: ['selection']
// });
