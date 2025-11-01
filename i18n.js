// i18n.js - Internationalization translations for MyLingo
// Supports 10 most spoken languages

const translations = {
  // Simplified Chinese
  'zh-CN': {
    name: '简体中文',
    flag: '🇨🇳',
    translations: {
      // UI Elements
      more: '更多',
      save: '保存',
      saveToNotes: '加入笔记',
      saved: '已保存',
      close: '关闭',
      listen: '聆听',
      
      // Word Analysis
      translation: '翻译',
      pronunciation: '发音',
      partOfSpeech: '词性',
      gender: '性别',
      level: '程度',
      examples: '例句',
      relatedWords: '相关词汇',
      synonyms: '同义词',
      frequency: '使用频率',
      
      // Sentence Analysis
      grammarStructure: '文法结构',
      keyGrammar: '重点文法',
      context: '语境',
      variations: '句型变化',
      responses: '回答范例',
      culturalNote: '文化小知识',
      
      // Paragraph Analysis
      originalText: '原文',
      difficulty: '难度分析',
      keyVocabulary: '关键词汇',
      simplified: '简化版本',
      topicTags: '主题标签',
      
      // Settings
      targetLanguage: '学习语言',
      nativeLanguage: '母语/界面语言',
      proficiencyLevel: '熟练程度',
      
      // Levels
      'A1': 'A1（入门）',
      'A2': 'A2（初级）',
      'B1': 'B1（中级）',
      'B2': 'B2（中高级）',
      'C1': 'C1（高级）',
      'C2': 'C2（精通）',
      
      // Parts of Speech
      noun: '名词',
      verb: '动词',
      adjective: '形容词',
      adverb: '副词',
      pronoun: '代词',
      preposition: '介词',
      conjunction: '连词',
      interjection: '感叹词',
      
      // Gender
      masculine: '阳性',
      feminine: '阴性',
      neuter: '中性',
      
      // Messages
      selectText: '选择文本以开始学习',
      analyzing: '分析中...',
      addedToNotes: '已加入笔记！',
      error: '发生错误，请重试',
      tooLong: '选取内容过长，请选择较短文本'
    }
  },

  // English
  'en': {
    name: 'English',
    flag: '🇺🇸',
    translations: {
      more: 'More',
      save: 'Save',
      saveToNotes: 'Add to Notes',
      saved: 'Saved',
      close: 'Close',
      listen: 'Listen',
      
      translation: 'Translation',
      pronunciation: 'Pronunciation',
      partOfSpeech: 'Part of Speech',
      gender: 'Gender',
      level: 'Level',
      examples: 'Examples',
      relatedWords: 'Related Words',
      synonyms: 'Synonyms',
      frequency: 'Frequency',
      
      grammarStructure: 'Grammar Structure',
      keyGrammar: 'Key Grammar',
      context: 'Context',
      variations: 'Variations',
      responses: 'Response Examples',
      culturalNote: 'Cultural Note',
      
      originalText: 'Original Text',
      difficulty: 'Difficulty Analysis',
      keyVocabulary: 'Key Vocabulary',
      simplified: 'Simplified Version',
      topicTags: 'Topic Tags',
      
      targetLanguage: 'Target Language',
      nativeLanguage: 'Native Language / UI',
      proficiencyLevel: 'Proficiency Level',
      
      'A1': 'A1 (Beginner)',
      'A2': 'A2 (Elementary)',
      'B1': 'B1 (Intermediate)',
      'B2': 'B2 (Upper Intermediate)',
      'C1': 'C1 (Advanced)',
      'C2': 'C2 (Proficient)',
      
      noun: 'Noun',
      verb: 'Verb',
      adjective: 'Adjective',
      adverb: 'Adverb',
      pronoun: 'Pronoun',
      preposition: 'Preposition',
      conjunction: 'Conjunction',
      interjection: 'Interjection',
      
      masculine: 'Masculine',
      feminine: 'Feminine',
      neuter: 'Neuter',
      
      selectText: 'Select text to start learning',
      analyzing: 'Analyzing...',
      addedToNotes: 'Added to notes!',
      error: 'An error occurred, please try again',
      tooLong: 'Selection too long, please choose shorter text'
    }
  },

  // Spanish
  'es': {
    name: 'Español',
    flag: '🇪🇸',
    translations: {
      more: 'Más',
      save: 'Guardar',
      saveToNotes: 'Añadir a Notas',
      saved: 'Guardado',
      close: 'Cerrar',
      listen: 'Escuchar',
      
      translation: 'Traducción',
      pronunciation: 'Pronunciación',
      partOfSpeech: 'Categoría Gramatical',
      gender: 'Género',
      level: 'Nivel',
      examples: 'Ejemplos',
      relatedWords: 'Palabras Relacionadas',
      synonyms: 'Sinónimos',
      frequency: 'Frecuencia',
      
      grammarStructure: 'Estructura Gramatical',
      keyGrammar: 'Gramática Clave',
      context: 'Contexto',
      variations: 'Variaciones',
      responses: 'Ejemplos de Respuesta',
      culturalNote: 'Nota Cultural',
      
      originalText: 'Texto Original',
      difficulty: 'Análisis de Dificultad',
      keyVocabulary: 'Vocabulario Clave',
      simplified: 'Versión Simplificada',
      topicTags: 'Etiquetas de Tema',
      
      targetLanguage: 'Idioma Objetivo',
      nativeLanguage: 'Idioma Nativo / UI',
      proficiencyLevel: 'Nivel de Competencia',
      
      'A1': 'A1 (Principiante)',
      'A2': 'A2 (Elemental)',
      'B1': 'B1 (Intermedio)',
      'B2': 'B2 (Intermedio Alto)',
      'C1': 'C1 (Avanzado)',
      'C2': 'C2 (Competente)',
      
      noun: 'Sustantivo',
      verb: 'Verbo',
      adjective: 'Adjetivo',
      adverb: 'Adverbio',
      pronoun: 'Pronombre',
      preposition: 'Preposición',
      conjunction: 'Conjunción',
      interjection: 'Interjección',
      
      masculine: 'Masculino',
      feminine: 'Femenino',
      neuter: 'Neutro',
      
      selectText: 'Selecciona texto para empezar a aprender',
      analyzing: 'Analizando...',
      addedToNotes: '¡Añadido a las notas!',
      error: 'Ocurrió un error, inténtalo de nuevo',
      tooLong: 'Selección demasiado larga, elige un texto más corto'
    }
  },

  // Hindi
  'hi': {
    name: 'हिन्दी',
    flag: '🇮🇳',
    translations: {
      more: 'और',
      save: 'सहेजें',
      saveToNotes: 'नोट्स में जोड़ें',
      saved: 'सहेजा गया',
      close: 'बंद करें',
      listen: 'सुनें',
      
      translation: 'अनुवाद',
      pronunciation: 'उच्चारण',
      partOfSpeech: 'शब्द भेद',
      gender: 'लिंग',
      level: 'स्तर',
      examples: 'उदाहरण',
      relatedWords: 'संबंधित शब्द',
      synonyms: 'समानार्थी',
      frequency: 'आवृत्ति',
      
      grammarStructure: 'व्याकरण संरचना',
      keyGrammar: 'मुख्य व्याकरण',
      context: 'संदर्भ',
      variations: 'विविधताएं',
      responses: 'उत्तर उदाहरण',
      culturalNote: 'सांस्कृतिक नोट',
      
      originalText: 'मूल पाठ',
      difficulty: 'कठिनाई विश्लेषण',
      keyVocabulary: 'मुख्य शब्दावली',
      simplified: 'सरलीकृत संस्करण',
      topicTags: 'विषय टैग',
      
      targetLanguage: 'लक्ष्य भाषा',
      nativeLanguage: 'मातृभाषा / UI',
      proficiencyLevel: 'दक्षता स्तर',
      
      'A1': 'A1 (शुरुआती)',
      'A2': 'A2 (प्रारंभिक)',
      'B1': 'B1 (मध्यवर्ती)',
      'B2': 'B2 (उच्च मध्यवर्ती)',
      'C1': 'C1 (उन्नत)',
      'C2': 'C2 (प्रवीण)',
      
      noun: 'संज्ञा',
      verb: 'क्रिया',
      adjective: 'विशेषण',
      adverb: 'क्रिया विशेषण',
      
      masculine: 'पुल्लिंग',
      feminine: 'स्त्रीलिंग',
      
      selectText: 'सीखना शुरू करने के लिए टेक्स्ट चुनें',
      analyzing: 'विश्लेषण कर रहे हैं...',
      addedToNotes: 'नोट्स में जोड़ा गया!',
      error: 'त्रुटि हुई, कृपया पुन: प्रयास करें',
      tooLong: 'चयन बहुत लंबा है, कृपया छोटा पाठ चुनें'
    }
  },

  // Arabic
  'ar': {
    name: 'العربية',
    flag: '🇸🇦',
    translations: {
      more: 'المزيد',
      save: 'حفظ',
      saveToNotes: 'إضافة إلى الملاحظات',
      saved: 'تم الحفظ',
      close: 'إغلاق',
      listen: 'استماع',
      
      translation: 'الترجمة',
      pronunciation: 'النطق',
      partOfSpeech: 'نوع الكلمة',
      gender: 'الجنس',
      level: 'المستوى',
      examples: 'أمثلة',
      relatedWords: 'كلمات ذات صلة',
      synonyms: 'مرادفات',
      frequency: 'التكرار',
      
      grammarStructure: 'التركيب النحوي',
      keyGrammar: 'القواعد الرئيسية',
      context: 'السياق',
      variations: 'التنوعات',
      responses: 'أمثلة الردود',
      culturalNote: 'ملاحظة ثقافية',
      
      originalText: 'النص الأصلي',
      difficulty: 'تحليل الصعوبة',
      keyVocabulary: 'المفردات الأساسية',
      simplified: 'النسخة المبسطة',
      topicTags: 'علامات الموضوع',
      
      targetLanguage: 'اللغة المستهدفة',
      nativeLanguage: 'اللغة الأم / الواجهة',
      proficiencyLevel: 'مستوى الكفاءة',
      
      'A1': 'A1 (مبتدئ)',
      'A2': 'A2 (أساسي)',
      'B1': 'B1 (متوسط)',
      'B2': 'B2 (متوسط متقدم)',
      'C1': 'C1 (متقدم)',
      'C2': 'C2 (متقن)',
      
      noun: 'اسم',
      verb: 'فعل',
      adjective: 'صفة',
      adverb: 'ظرف',
      
      masculine: 'مذكر',
      feminine: 'مؤنث',
      
      selectText: 'حدد نصاً لبدء التعلم',
      analyzing: 'جاري التحليل...',
      addedToNotes: 'تمت الإضافة إلى الملاحظات!',
      error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
      tooLong: 'التحديد طويل جداً، يرجى اختيار نص أقصر'
    }
  },

  // Portuguese
  'pt': {
    name: 'Português',
    flag: '🇧🇷',
    translations: {
      more: 'Mais',
      save: 'Salvar',
      saveToNotes: 'Adicionar às Notas',
      saved: 'Salvo',
      close: 'Fechar',
      listen: 'Ouvir',
      
      translation: 'Tradução',
      pronunciation: 'Pronúncia',
      partOfSpeech: 'Classe Gramatical',
      gender: 'Gênero',
      level: 'Nível',
      examples: 'Exemplos',
      relatedWords: 'Palavras Relacionadas',
      synonyms: 'Sinônimos',
      frequency: 'Frequência',
      
      grammarStructure: 'Estrutura Gramatical',
      keyGrammar: 'Gramática Chave',
      context: 'Contexto',
      variations: 'Variações',
      responses: 'Exemplos de Resposta',
      culturalNote: 'Nota Cultural',
      
      originalText: 'Texto Original',
      difficulty: 'Análise de Dificuldade',
      keyVocabulary: 'Vocabulário Chave',
      simplified: 'Versão Simplificada',
      topicTags: 'Tags de Tópico',
      
      targetLanguage: 'Idioma Alvo',
      nativeLanguage: 'Idioma Nativo / UI',
      proficiencyLevel: 'Nível de Proficiência',
      
      'A1': 'A1 (Iniciante)',
      'A2': 'A2 (Elementar)',
      'B1': 'B1 (Intermediário)',
      'B2': 'B2 (Intermediário Superior)',
      'C1': 'C1 (Avançado)',
      'C2': 'C2 (Proficiente)',
      
      noun: 'Substantivo',
      verb: 'Verbo',
      adjective: 'Adjetivo',
      adverb: 'Advérbio',
      
      masculine: 'Masculino',
      feminine: 'Feminino',
      
      selectText: 'Selecione texto para começar a aprender',
      analyzing: 'Analisando...',
      addedToNotes: 'Adicionado às notas!',
      error: 'Ocorreu um erro, tente novamente',
      tooLong: 'Seleção muito longa, escolha um texto mais curto'
    }
  },

  // Russian
  'ru': {
    name: 'Русский',
    flag: '🇷🇺',
    translations: {
      more: 'Больше',
      save: 'Сохранить',
      saveToNotes: 'Добавить в заметки',
      saved: 'Сохранено',
      close: 'Закрыть',
      listen: 'Слушать',
      
      translation: 'Перевод',
      pronunciation: 'Произношение',
      partOfSpeech: 'Часть речи',
      gender: 'Род',
      level: 'Уровень',
      examples: 'Примеры',
      relatedWords: 'Связанные слова',
      synonyms: 'Синонимы',
      frequency: 'Частота',
      
      grammarStructure: 'Грамматическая структура',
      keyGrammar: 'Ключевая грамматика',
      context: 'Контекст',
      variations: 'Вариации',
      responses: 'Примеры ответов',
      culturalNote: 'Культурная заметка',
      
      originalText: 'Оригинальный текст',
      difficulty: 'Анализ сложности',
      keyVocabulary: 'Ключевая лексика',
      simplified: 'Упрощенная версия',
      topicTags: 'Теги темы',
      
      targetLanguage: 'Целевой язык',
      nativeLanguage: 'Родной язык / UI',
      proficiencyLevel: 'Уровень владения',
      
      'A1': 'A1 (Начальный)',
      'A2': 'A2 (Элементарный)',
      'B1': 'B1 (Средний)',
      'B2': 'B2 (Выше среднего)',
      'C1': 'C1 (Продвинутый)',
      'C2': 'C2 (Профессиональный)',
      
      noun: 'Существительное',
      verb: 'Глагол',
      adjective: 'Прилагательное',
      adverb: 'Наречие',
      
      masculine: 'Мужской',
      feminine: 'Женский',
      neuter: 'Средний',
      
      selectText: 'Выберите текст, чтобы начать обучение',
      analyzing: 'Анализ...',
      addedToNotes: 'Добавлено в заметки!',
      error: 'Произошла ошибка, попробуйте еще раз',
      tooLong: 'Выделение слишком длинное, выберите более короткий текст'
    }
  },

  // French
  'fr': {
    name: 'Français',
    flag: '🇫🇷',
    translations: {
      more: 'Plus',
      save: 'Enregistrer',
      saveToNotes: 'Ajouter aux notes',
      saved: 'Enregistré',
      close: 'Fermer',
      listen: 'Écouter',
      
      translation: 'Traduction',
      pronunciation: 'Prononciation',
      partOfSpeech: 'Nature',
      gender: 'Genre',
      level: 'Niveau',
      examples: 'Exemples',
      relatedWords: 'Mots apparentés',
      synonyms: 'Synonymes',
      frequency: 'Fréquence',
      
      grammarStructure: 'Structure grammaticale',
      keyGrammar: 'Grammaire clé',
      context: 'Contexte',
      variations: 'Variations',
      responses: 'Exemples de réponses',
      culturalNote: 'Note culturelle',
      
      originalText: 'Texte original',
      difficulty: 'Analyse de difficulté',
      keyVocabulary: 'Vocabulaire clé',
      simplified: 'Version simplifiée',
      topicTags: 'Tags de sujet',
      
      targetLanguage: 'Langue cible',
      nativeLanguage: 'Langue maternelle / UI',
      proficiencyLevel: 'Niveau de compétence',
      
      'A1': 'A1 (Débutant)',
      'A2': 'A2 (Élémentaire)',
      'B1': 'B1 (Intermédiaire)',
      'B2': 'B2 (Intermédiaire supérieur)',
      'C1': 'C1 (Avancé)',
      'C2': 'C2 (Compétent)',
      
      noun: 'Nom',
      verb: 'Verbe',
      adjective: 'Adjectif',
      adverb: 'Adverbe',
      
      masculine: 'Masculin',
      feminine: 'Féminin',
      
      selectText: 'Sélectionnez du texte pour commencer à apprendre',
      analyzing: 'Analyse en cours...',
      addedToNotes: 'Ajouté aux notes!',
      error: 'Une erreur s\'est produite, veuillez réessayer',
      tooLong: 'Sélection trop longue, choisissez un texte plus court'
    }
  },

  // German
  'de': {
    name: 'Deutsch',
    flag: '🇩🇪',
    translations: {
      more: 'Mehr',
      save: 'Speichern',
      saveToNotes: 'Zu Notizen hinzufügen',
      saved: 'Gespeichert',
      close: 'Schließen',
      listen: 'Anhören',
      
      translation: 'Übersetzung',
      pronunciation: 'Aussprache',
      partOfSpeech: 'Wortart',
      gender: 'Genus',
      level: 'Niveau',
      examples: 'Beispiele',
      relatedWords: 'Verwandte Wörter',
      synonyms: 'Synonyme',
      frequency: 'Häufigkeit',
      
      grammarStructure: 'Grammatikstruktur',
      keyGrammar: 'Wichtige Grammatik',
      context: 'Kontext',
      variations: 'Variationen',
      responses: 'Antwortbeispiele',
      culturalNote: 'Kulturelle Anmerkung',
      
      originalText: 'Originaltext',
      difficulty: 'Schwierigkeitsanalyse',
      keyVocabulary: 'Schlüsselvokabular',
      simplified: 'Vereinfachte Version',
      topicTags: 'Themen-Tags',
      
      targetLanguage: 'Zielsprache',
      nativeLanguage: 'Muttersprache / UI',
      proficiencyLevel: 'Kompetenzniveau',
      
      'A1': 'A1 (Anfänger)',
      'A2': 'A2 (Grundkenntnisse)',
      'B1': 'B1 (Mittelstufe)',
      'B2': 'B2 (Gute Mittelstufe)',
      'C1': 'C1 (Fortgeschritten)',
      'C2': 'C2 (Kompetent)',
      
      noun: 'Substantiv',
      verb: 'Verb',
      adjective: 'Adjektiv',
      adverb: 'Adverb',
      
      masculine: 'Maskulinum',
      feminine: 'Femininum',
      neuter: 'Neutrum',
      
      selectText: 'Text auswählen, um mit dem Lernen zu beginnen',
      analyzing: 'Analysiere...',
      addedToNotes: 'Zu Notizen hinzugefügt!',
      error: 'Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut',
      tooLong: 'Auswahl zu lang, bitte wählen Sie einen kürzeren Text'
    }
  },

  // Japanese
  'ja': {
    name: '日本語',
    flag: '🇯🇵',
    translations: {
      more: 'もっと',
      save: '保存',
      saveToNotes: 'ノートに追加',
      saved: '保存済み',
      close: '閉じる',
      listen: '聴く',
      
      translation: '翻訳',
      pronunciation: '発音',
      partOfSpeech: '品詞',
      gender: '性',
      level: 'レベル',
      examples: '例文',
      relatedWords: '関連語',
      synonyms: '同義語',
      frequency: '使用頻度',
      
      grammarStructure: '文法構造',
      keyGrammar: '重要文法',
      context: '文脈',
      variations: 'バリエーション',
      responses: '返答例',
      culturalNote: '文化メモ',
      
      originalText: '原文',
      difficulty: '難易度分析',
      keyVocabulary: '重要語彙',
      simplified: '簡略版',
      topicTags: 'トピックタグ',
      
      targetLanguage: '学習言語',
      nativeLanguage: '母語 / UI',
      proficiencyLevel: '習熟度',
      
      'A1': 'A1（入門）',
      'A2': 'A2（初級）',
      'B1': 'B1（中級）',
      'B2': 'B2（中上級）',
      'C1': 'C1（上級）',
      'C2': 'C2（熟達）',
      
      noun: '名詞',
      verb: '動詞',
      adjective: '形容詞',
      adverb: '副詞',
      
      masculine: '男性',
      feminine: '女性',
      
      selectText: 'テキストを選択して学習を開始',
      analyzing: '分析中...',
      addedToNotes: 'ノートに追加しました！',
      error: 'エラーが発生しました。もう一度お試しください',
      tooLong: '選択が長すぎます。短いテキストを選んでください'
    }
  }
};

// i18n utility class
class I18n {
  constructor() {
    this.currentLang = 'en';
    this.translations = translations;
  }

  async init() {
    const { nativeLanguage } = await chrome.storage.sync.get('nativeLanguage');
    this.currentLang = nativeLanguage || 'en';
  }

  setLanguage(langCode) {
    this.currentLang = langCode;
    chrome.storage.sync.set({ nativeLanguage: langCode });
  }

  t(key) {
    const lang = this.translations[this.currentLang];
    if (!lang) return key;
    return lang.translations[key] || key;
  }

  getAvailableLanguages() {
    return Object.keys(this.translations).map(code => ({
      code,
      name: this.translations[code].name,
      flag: this.translations[code].flag
    }));
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18n, translations };
}
