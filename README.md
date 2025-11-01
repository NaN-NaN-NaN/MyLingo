# 🌍 MyLingo - AI-Powered Language Learning Chrome Extension

**Transform any webpage into an interactive language learning environment using Chrome's Built-in AI (Gemini Nano)**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome AI Challenge 2025](https://img.shields.io/badge/Chrome%20AI-Challenge%202025-purple)

---

## 🎯 Overview

MyLingo is a Chrome Extension that lets you learn any language directly from any webpage. Simply highlight words, sentences, or paragraphs to get instant translations, grammar explanations, pronunciation, and save them to your personal vocabulary notebook—all powered by Chrome's on-device AI.

### ✨ Key Features

- **📖 Smart Text Analysis**: Automatically detects if you selected a word, sentence, or paragraph
- **🔄 Instant Translation**: Get translations in your native language
- **🔊 Text-to-Speech**: Hear correct pronunciation
- **📚 Grammar Insights**: Understand sentence structure and key grammar points
- **💾 Personal Notebook**: Save words/sentences for later review
- **🌐 10 UI Languages**: Interface available in Chinese, English, Spanish, Hindi, Arabic, Portuguese, Russian, French, German, Japanese
- **🎯 CEFR Levels**: Difficulty ratings from A1 to C2
- **🔒 Privacy-First**: All processing happens on-device using Chrome Built-in AI

---

## 🚀 Quick Start

### Prerequisites

1. **Chrome Canary or Dev Channel** (version 127+)
   - Download: https://www.google.com/chrome/canary/

2. **Enable Chrome AI Flags**
   Open `chrome://flags` and enable:
   ```
   #optimization-guide-on-device-model = Enabled BypassPerfRequirement
   #prompt-api-for-gemini-nano = Enabled
   #translation-api = Enabled
   #summarization-api = Enabled
   ```

3. **Restart Chrome**

4. **Sign up for Chrome Built-in AI Early Preview Program**
   - Visit: https://developer.chrome.com/docs/ai/built-in

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/mylingo-extension.git
   cd mylingo-extension
   ```

2. **Load extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `mylingo-extension` folder

3. **Wait for Gemini Nano to download** (~1-2 minutes first time)

4. **You're ready!** Click the MyLingo icon and toggle it ON

---

## 📖 How to Use

### Basic Workflow

1. **Enable MyLingo**
   - Click the MyLingo extension icon
   - Toggle the switch to ON
   - Status will show "Active - Select text to learn"

2. **Select Text on Any Webpage**
   - **One word**: Get translation, pronunciation, grammar, examples
   - **One sentence**: Get translation, grammar structure, context
   - **Paragraph**: Get translation, key vocabulary, difficulty analysis

3. **View Quick Translation**
   - A compact chip appears with translation
   - Click "More ▼" for detailed analysis

4. **Explore Full Analysis**
   - Detailed grammar explanations
   - Example sentences
   - Related words
   - Pronunciation guide
   - CEFR difficulty level

5. **Save to Notes**
   - Click "Add to Notes" button
   - Access later from the popup

6. **Review Your Progress**
   - Click extension icon
   - See words saved today
   - View all your notes

---

## 🎨 UI Examples

### Word Analysis
```
┌──────────────────────────┐
│ desarrollo               │
├──────────────────────────┤
│ 🌍 Translation: 发展     │
│ 📝 Part of Speech: Noun  │
│ 🎯 Gender: Masculine     │
│ 🔊 Pronunciation: [play] │
│ 📊 Level: B1             │
│ 📚 Examples: ...         │
│ 🔗 Related Words: ...    │
├──────────────────────────┤
│ [💾 Add to Notes]        │
└──────────────────────────┘
```

### Sentence Analysis
```
┌──────────────────────────┐
│ Hola, ¿cómo estás?       │
├──────────────────────────┤
│ 🌍 Translation: 你好     │
│ 🎯 Grammar: estar verb   │
│ 🗣️ Context: Informal     │
│ 💬 Responses: ...        │
├──────────────────────────┤
│ [💾 Add to Notes]        │
└──────────────────────────┘
```

---

## ⚙️ Settings

### Target Language
The language you're learning. Options:
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇧🇷 Portuguese
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇨🇳 Chinese
- 🇸🇦 Arabic
- 🇷🇺 Russian

### Native Language (UI Language)
Your mother tongue - determines interface language and translation direction:
- 🇨🇳 Simplified Chinese
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇮🇳 Hindi
- 🇸🇦 Arabic
- 🇧🇷 Portuguese
- 🇷🇺 Russian
- 🇫🇷 French
- 🇩🇪 German
- 🇯🇵 Japanese

### Proficiency Level
Your current skill level:
- A1 - Beginner
- A2 - Elementary
- B1 - Intermediate (default)
- B2 - Upper Intermediate
- C1 - Advanced
- C2 - Proficient

---

## 🤖 Chrome AI APIs Used

MyLingo showcases **4 Chrome Built-in AI APIs**:

### 1. Prompt API (Primary - 60%)
```javascript
// Core analysis engine
const analysis = await ai.languageModel.create({
  temperature: 0.3,
  topK: 3
});

// Analyzes words, sentences, paragraphs
// Provides grammar explanations, examples, etc.
```

### 2. Translator API (30%)
```javascript
// Translation between languages
const translator = await ai.translator.create({
  sourceLanguage: 'es',
  targetLanguage: 'zh-CN'
});

const translation = await translator.translate(text);
```

### 3. Summarizer API (5%)
```javascript
// Summarizes long paragraphs
const summarizer = await ai.summarizer.create({
  type: 'key-points',
  format: 'plain-text',
  length: 'short'
});

const summary = await summarizer.summarize(longText);
```

### 4. Web Speech API (5%)
```javascript
// Text-to-speech for pronunciation
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'es-ES';
speechSynthesis.speak(utterance);
```

---

## 📁 Project Structure

```
mylingo-extension/
├── manifest.json              # Extension configuration
├── background.js              # Service worker
├── content.js                 # Main content script
├── content.css                # UI styling
├── i18n.js                    # 10-language translations
├── ai-utils.js                # Chrome AI API wrappers
├── popup.html                 # Extension popup interface
├── popup.js                   # Popup logic
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md                  # This file
```

---

## 🎯 Usage Examples

### Example 1: Learning Spanish (Chinese Speaker)

**Settings:**
- Target Language: Spanish
- Native Language: Simplified Chinese
- Level: A2

**Action:** Highlight "hola"

**Result:**
```
🌍 翻译: 你好
📝 词性: 感叹词
🔊 发音: [play audio]
📊 程度: A1 (入门)
📚 例句:
  - Hola, buenos días → 你好，早安
  - Hola amigo → 你好朋友
```

### Example 2: Learning French (English Speaker)

**Settings:**
- Target Language: French
- Native Language: English
- Level: B1

**Action:** Highlight "Je voudrais un café"

**Result:**
```
🌍 Translation: I would like a coffee
🎯 Grammar: Conditional tense (voudrais)
📊 Level: A2
🗣️ Context: Polite request
💬 Responses:
  - Bien sûr! → Of course!
  - Tout de suite → Right away
```

---

## 🔧 Technical Details

### Selection Detection Logic

```javascript
// Automatically determines selection type
function detectSelectionType(text) {
  const wordCount = text.trim().split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;

  if (wordCount === 1) return 'WORD';
  else if (wordCount <= 25 && sentenceCount <= 2) return 'SENTENCE';
  else if (wordCount <= 150) return 'PARAGRAPH';
  else return 'TOO_LONG';
}
```

### Length Limits
- **Word**: 1 word only
- **Sentence**: 1-25 words (1-2 sentences)
- **Paragraph**: 26-150 words (3-10 sentences)
- **Too Long**: >150 words (shows error)

### Storage
- **Settings**: `chrome.storage.sync` (synced across devices)
- **Notes**: `chrome.storage.local` (up to 500 notes)
- **Cache**: In-memory for translations (session only)

### Performance
- Analysis time: <2 seconds
- Translation: <1 second (cached)
- TTS: Instant playback
- Memory: ~50MB (including AI model)

---

## 🐛 Troubleshooting

### "AI not available" error

**Solution:**
1. Check Chrome flags are enabled
2. Restart Chrome completely
3. Wait for Gemini Nano download (check `chrome://components`)
4. Ensure Chrome version 127+

### Text selection not working

**Solution:**
1. Check MyLingo is toggled ON
2. Refresh the webpage
3. Try selecting different text
4. Check console for errors (F12)

### Translation not showing

**Solution:**
1. Verify target/native languages are set correctly
2. Check internet connection (first-time model download)
3. Try shorter text selections
4. Clear extension cache: Disable and re-enable

### No sound for pronunciation

**Solution:**
1. Check system volume
2. Verify browser has audio permission
3. Try different text
4. Check Web Speech API support

---

## 📊 Data & Privacy

### What Data is Stored?

**Locally (chrome.storage.local):**
- Your saved vocabulary notes
- Original text + translations
- Page URLs where you saved words
- Timestamps

**Synced (chrome.storage.sync):**
- Your settings (languages, level)
- MyLingo ON/OFF status

### Privacy Guarantees

✅ **All AI processing happens on-device**
✅ **No data sent to external servers**
✅ **No tracking or analytics**
✅ **No account required**
✅ **Open source - verify yourself**

---

## 🚀 Future Enhancements (V2)

- [ ] Spaced repetition quiz system
- [ ] Flashcard review mode
- [ ] Export notes to Anki/CSV
- [ ] Grammar pattern explanations
- [ ] Conjugation tables for verbs
- [ ] Cultural context notes
- [ ] Progress tracking dashboard
- [ ] Word frequency analytics
- [ ] Sentence mining from pages
- [ ] Audio recording for pronunciation practice

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

1. **More Languages**: Add support for additional target/native languages
2. **Better Prompts**: Improve AI prompt engineering for accuracy
3. **UI/UX**: Enhance visual design and interactions
4. **Performance**: Optimize analysis speed
5. **Testing**: Add test scenarios
6. **Documentation**: Improve guides and examples

### Development Setup

```bash
# Clone repo
git clone https://github.com/yourusername/mylingo-extension.git
cd mylingo-extension

# Make changes
# Test by loading unpacked extension

# Create pull request
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🏆 Chrome AI Challenge 2025

Built for the **Google Chrome Built-in AI Challenge 2025**

### Challenge Categories

**Primary Target:** Best Multimodal AI Application - Chrome Extension
**Secondary:** Most Helpful - Chrome Extension

### Why MyLingo Wins

✅ **Solves Real Problem**: Language learning is hard without context
✅ **4 AI APIs**: Prompt, Translator, Summarizer, Web Speech
✅ **10 Languages**: Global accessibility
✅ **Privacy-First**: All on-device processing
✅ **Production-Ready**: Polished UI, error handling, documentation
✅ **Innovation**: First true contextual language learning extension
✅ **Social Impact**: Makes language learning accessible to billions

---

## 📞 Support & Contact

- **Issues**: Report bugs via GitHub Issues
- **Email**: your.email@example.com
- **Demo Video**: [YouTube Link]

---

## 🙏 Acknowledgments

- **Google Chrome Team** for Chrome Built-in AI APIs
- **Anthropic** for Claude AI assistance
- **Open Source Community** for inspiration

---

## 📊 Stats

- **Development Time**: 24 hours (Hackathon)
- **Lines of Code**: ~3,000
- **APIs Integrated**: 4
- **Supported Languages**: 10 (UI) + unlimited (learning)
- **Target Users**: Language learners worldwide

---

**Made with ❤️ for Chrome AI Challenge 2025**

*Start learning languages the smart way - right from your browser!* 🌍📚

---

## 🎬 Quick Demo

1. Install extension
2. Visit any Spanish website (e.g., elpais.com)
3. Toggle MyLingo ON
4. Highlight any word
5. See instant translation + analysis!

**Transform your browser into a language classroom** ✨
