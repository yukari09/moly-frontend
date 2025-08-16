/**
 * SEO Metadata Generation Utilities
 * Provides comprehensive SEO metadata for all generator pages
 */

// SEO data for each generator type with localized content
const generatorSEOData = {
  'writing': {
    en: {
      title: 'Writing Prompt Generator - AI-Powered Creative Writing Prompts',
      description: 'Generate creative writing prompts with Kari AI optimization. Perfect for novels, short stories, poetry, and creative writing projects. Free AI-powered writing inspiration.',
      keywords: ['writing prompt generator', 'creative writing prompts', 'AI writing prompts', 'story prompts', 'novel prompts', 'writing inspiration', 'creative writing tools'],
      difficulty: 'Hard',
      searchVolume: '>10000'
    },
    zh: {
      title: '写作提示词生成器 - AI驱动的创意写作提示',
      description: '使用 Kari AI 优化生成创意写作提示词。适用于小说、短篇故事、诗歌和创意写作项目。免费AI驱动的写作灵感。',
      keywords: ['写作提示词生成器', '创意写作提示', 'AI写作提示', '故事提示', '小说提示', '写作灵感', '创意写作工具'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    ja: {
      title: 'ライティングプロンプトジェネレーター - AI搭載クリエイティブライティングプロンプト',
      description: 'Kari AI最適化でクリエイティブライティングプロンプトを生成。小説、短編小説、詩、クリエイティブライティングプロジェクトに最適。無料AI搭載ライティングインスピレーション。',
      keywords: ['ライティングプロンプトジェネレーター', 'クリエイティブライティングプロンプト', 'AIライティングプロンプト', 'ストーリープロンプト', '小説プロンプト', 'ライティングインスピレーション'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    ko: {
      title: '글쓰기 프롬프트 생성기 - AI 기반 창작 글쓰기 프롬프트',
      description: 'Kari AI 최적화로 창작 글쓰기 프롬프트를 생성하세요. 소설, 단편소설, 시, 창작 글쓰기 프로젝트에 완벽합니다. 무료 AI 기반 글쓰기 영감.',
      keywords: ['글쓰기 프롬프트 생성기', '창작 글쓰기 프롬프트', 'AI 글쓰기 프롬프트', '스토리 프롬프트', '소설 프롬프트', '글쓰기 영감'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts d\'Écriture - Prompts d\'Écriture Créative IA',
      description: 'Générez des prompts d\'écriture créative avec l\'optimisation Kari AI. Parfait pour les romans, nouvelles, poésie et projets d\'écriture créative. Inspiration d\'écriture IA gratuite.',
      keywords: ['générateur de prompts d\'écriture', 'prompts d\'écriture créative', 'prompts d\'écriture IA', 'prompts d\'histoire', 'prompts de roman', 'inspiration d\'écriture'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts de Escritura - Prompts de Escritura Creativa IA',
      description: 'Genera prompts de escritura creativa con optimización Kari AI. Perfecto para novelas, cuentos, poesía y proyectos de escritura creativa. Inspiración de escritura IA gratuita.',
      keywords: ['generador de prompts de escritura', 'prompts de escritura creativa', 'prompts de escritura IA', 'prompts de historia', 'prompts de novela', 'inspiración de escritura'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts de Escrita - Prompts de Escrita Criativa IA',
      description: 'Gere prompts de escrita criativa com otimização Kari AI. Perfeito para romances, contos, poesia e projetos de escrita criativa. Inspiração de escrita IA gratuita.',
      keywords: ['gerador de prompts de escrita', 'prompts de escrita criativa', 'prompts de escrita IA', 'prompts de história', 'prompts de romance', 'inspiração de escrita'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    de: {
      title: 'Schreib-Prompt-Generator - KI-gestützte kreative Schreibprompts',
      description: 'Generieren Sie kreative Schreibprompts mit Kari AI-Optimierung. Perfekt für Romane, Kurzgeschichten, Gedichte und kreative Schreibprojekte. Kostenlose KI-gestützte Schreibinspiration.',
      keywords: ['schreib-prompt-generator', 'kreative schreibprompts', 'KI schreibprompts', 'story prompts', 'roman prompts', 'schreibinspiration'],
      difficulty: 'Medium',
      searchVolume: '>100'
    }
  },
  'art': {
    en: {
      title: 'Art Prompt Generator - AI Art Prompts for Image Generation',
      description: 'Create stunning art prompts for AI image generation with Kari AI optimization. Perfect for Midjourney, DALL-E, Stable Diffusion, and other AI art tools.',
      keywords: ['art prompt generator', 'AI art prompts', 'image generation prompts', 'Midjourney prompts', 'DALL-E prompts', 'AI art tools', 'creative prompts'],
      difficulty: 'Easy',
      searchVolume: '>1000'
    },
    zh: {
      title: '艺术提示词生成器 - AI艺术图像生成提示词',
      description: '使用 Kari AI 优化创建令人惊叹的艺术提示词用于AI图像生成。适用于Midjourney、DALL-E、Stable Diffusion等AI艺术工具。',
      keywords: ['艺术提示词生成器', 'AI艺术提示词', '图像生成提示词', 'Midjourney提示词', 'DALL-E提示词', 'AI艺术工具'],
      difficulty: 'Easy',
      searchVolume: '>1000'
    },
    ja: {
      title: 'アートプロンプトジェネレーター - AI画像生成用アートプロンプト',
      description: 'Kari AI最適化で素晴らしいアートプロンプトを作成し、AI画像生成に使用。Midjourney、DALL-E、Stable DiffusionなどのAIアートツールに最適。',
      keywords: ['アートプロンプトジェネレーター', 'AIアートプロンプト', '画像生成プロンプト', 'Midjourneyプロンプト', 'DALL-Eプロンプト', 'AIアートツール'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    ko: {
      title: '아트 프롬프트 생성기 - AI 이미지 생성용 아트 프롬프트',
      description: 'Kari AI 최적화로 AI 이미지 생성을 위한 멋진 아트 프롬프트를 만드세요. Midjourney, DALL-E, Stable Diffusion 등 AI 아트 도구에 완벽합니다.',
      keywords: ['아트 프롬프트 생성기', 'AI 아트 프롬프트', '이미지 생성 프롬프트', 'Midjourney 프롬프트', 'DALL-E 프롬프트', 'AI 아트 도구'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts d\'Art - Prompts d\'Art IA pour Génération d\'Images',
      description: 'Créez des prompts d\'art époustouflants pour la génération d\'images IA avec l\'optimisation Kari AI. Parfait pour Midjourney, DALL-E, Stable Diffusion et autres outils d\'art IA.',
      keywords: ['générateur de prompts d\'art', 'prompts d\'art IA', 'prompts de génération d\'images', 'prompts Midjourney', 'prompts DALL-E', 'outils d\'art IA'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts de Arte - Prompts de Arte IA para Generación de Imágenes',
      description: 'Crea prompts de arte impresionantes para generación de imágenes IA con optimización Kari AI. Perfecto para Midjourney, DALL-E, Stable Diffusion y otras herramientas de arte IA.',
      keywords: ['generador de prompts de arte', 'prompts de arte IA', 'prompts de generación de imágenes', 'prompts Midjourney', 'prompts DALL-E', 'herramientas de arte IA'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts de Arte - Prompts de Arte IA para Geração de Imagens',
      description: 'Crie prompts de arte impressionantes para geração de imagens IA com otimização Kari AI. Perfeito para Midjourney, DALL-E, Stable Diffusion e outras ferramentas de arte IA.',
      keywords: ['gerador de prompts de arte', 'prompts de arte IA', 'prompts de geração de imagens', 'prompts Midjourney', 'prompts DALL-E', 'ferramentas de arte IA'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    de: {
      title: 'Kunst-Prompt-Generator - KI-Kunst-Prompts für Bildgenerierung',
      description: 'Erstellen Sie atemberaubende Kunst-Prompts für KI-Bildgenerierung mit Kari AI-Optimierung. Perfekt für Midjourney, DALL-E, Stable Diffusion und andere KI-Kunst-Tools.',
      keywords: ['kunst-prompt-generator', 'KI-kunst-prompts', 'bildgenerierungs-prompts', 'Midjourney-prompts', 'DALL-E-prompts', 'KI-kunst-tools'],
      difficulty: 'Easy',
      searchVolume: '>100'
    }
  },
  'ai': {
    en: {
      title: 'AI Prompt Generator - Universal AI Prompt Optimizer',
      description: 'Universal AI prompt optimizer for ChatGPT, Claude, Gemini, and more. Enhance your AI interactions with Kari\'s 4-D optimization methodology.',
      keywords: ['AI prompt generator', 'prompt optimizer', 'ChatGPT prompts', 'Claude prompts', 'Gemini prompts', 'AI optimization', 'prompt engineering'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    zh: {
      title: 'AI提示词生成器 - 通用AI提示词优化器',
      description: '适用于ChatGPT、Claude、Gemini等的通用AI提示词优化器。使用Kari的4-D优化方法论增强您的AI交互。',
      keywords: ['AI提示词生成器', '提示词优化器', 'ChatGPT提示词', 'Claude提示词', 'Gemini提示词', 'AI优化', '提示词工程'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    ja: {
      title: 'AIプロンプトジェネレーター - ユニバーサルAIプロンプトオプティマイザー',
      description: 'ChatGPT、Claude、GeminiなどのユニバーサルAIプロンプトオプティマイザー。Kariの4-D最適化方法論でAIインタラクションを強化。',
      keywords: ['AIプロンプトジェネレーター', 'プロンプトオプティマイザー', 'ChatGPTプロンプト', 'Claudeプロンプト', 'Geminiプロンプト', 'AI最適化'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    ko: {
      title: 'AI 프롬프트 생성기 - 범용 AI 프롬프트 최적화기',
      description: 'ChatGPT, Claude, Gemini 등을 위한 범용 AI 프롬프트 최적화기. Kari의 4-D 최적화 방법론으로 AI 상호작용을 향상시키세요.',
      keywords: ['AI 프롬프트 생성기', '프롬프트 최적화기', 'ChatGPT 프롬프트', 'Claude 프롬프트', 'Gemini 프롬프트', 'AI 최적화'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts IA - Optimiseur de Prompts IA Universel',
      description: 'Optimiseur de prompts IA universel pour ChatGPT, Claude, Gemini et plus. Améliorez vos interactions IA avec la méthodologie d\'optimisation 4-D de Kari.',
      keywords: ['générateur de prompts IA', 'optimiseur de prompts', 'prompts ChatGPT', 'prompts Claude', 'prompts Gemini', 'optimisation IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts IA - Optimizador de Prompts IA Universal',
      description: 'Optimizador de prompts IA universal para ChatGPT, Claude, Gemini y más. Mejora tus interacciones IA con la metodología de optimización 4-D de Kari.',
      keywords: ['generador de prompts IA', 'optimizador de prompts', 'prompts ChatGPT', 'prompts Claude', 'prompts Gemini', 'optimización IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts IA - Otimizador de Prompts IA Universal',
      description: 'Otimizador de prompts IA universal para ChatGPT, Claude, Gemini e mais. Melhore suas interações IA com a metodologia de otimização 4-D da Kari.',
      keywords: ['gerador de prompts IA', 'otimizador de prompts', 'prompts ChatGPT', 'prompts Claude', 'prompts Gemini', 'otimização IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    de: {
      title: 'KI-Prompt-Generator - Universeller KI-Prompt-Optimierer',
      description: 'Universeller KI-Prompt-Optimierer für ChatGPT, Claude, Gemini und mehr. Verbessern Sie Ihre KI-Interaktionen mit Karis 4-D-Optimierungsmethodik.',
      keywords: ['KI-prompt-generator', 'prompt-optimierer', 'ChatGPT-prompts', 'Claude-prompts', 'Gemini-prompts', 'KI-optimierung'],
      difficulty: 'Medium',
      searchVolume: '>100'
    }
  },
  'chatgpt': {
    en: {
      title: 'ChatGPT Prompt Generator - Optimize Your ChatGPT Prompts',
      description: 'Generate and optimize prompts specifically for ChatGPT with Kari AI. Improve your ChatGPT conversations with advanced prompt engineering techniques.',
      keywords: ['ChatGPT prompt generator', 'ChatGPT prompts', 'ChatGPT optimization', 'prompt engineering', 'ChatGPT tips', 'AI conversation'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    zh: {
      title: 'ChatGPT提示词生成器 - 优化您的ChatGPT提示词',
      description: '使用Kari AI专门为ChatGPT生成和优化提示词。通过高级提示词工程技术改善您的ChatGPT对话。',
      keywords: ['ChatGPT提示词生成器', 'ChatGPT提示词', 'ChatGPT优化', '提示词工程', 'ChatGPT技巧', 'AI对话'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    ja: {
      title: 'ChatGPTプロンプトジェネレーター - ChatGPTプロンプトを最適化',
      description: 'Kari AIでChatGPT専用のプロンプトを生成・最適化。高度なプロンプトエンジニアリング技術でChatGPT会話を改善。',
      keywords: ['ChatGPTプロンプトジェネレーター', 'ChatGPTプロンプト', 'ChatGPT最適化', 'プロンプトエンジニアリング', 'ChatGPTコツ'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    ko: {
      title: 'ChatGPT 프롬프트 생성기 - ChatGPT 프롬프트 최적화',
      description: 'Kari AI로 ChatGPT 전용 프롬프트를 생성하고 최적화하세요. 고급 프롬프트 엔지니어링 기법으로 ChatGPT 대화를 개선하세요.',
      keywords: ['ChatGPT 프롬프트 생성기', 'ChatGPT 프롬프트', 'ChatGPT 최적화', '프롬프트 엔지니어링', 'ChatGPT 팁'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts ChatGPT - Optimisez vos Prompts ChatGPT',
      description: 'Générez et optimisez des prompts spécifiquement pour ChatGPT avec Kari AI. Améliorez vos conversations ChatGPT avec des techniques d\'ingénierie de prompts avancées.',
      keywords: ['générateur de prompts ChatGPT', 'prompts ChatGPT', 'optimisation ChatGPT', 'ingénierie de prompts', 'conseils ChatGPT'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts ChatGPT - Optimiza tus Prompts ChatGPT',
      description: 'Genera y optimiza prompts específicamente para ChatGPT con Kari AI. Mejora tus conversaciones ChatGPT con técnicas avanzadas de ingeniería de prompts.',
      keywords: ['generador de prompts ChatGPT', 'prompts ChatGPT', 'optimización ChatGPT', 'ingeniería de prompts', 'consejos ChatGPT'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts ChatGPT - Otimize seus Prompts ChatGPT',
      description: 'Gere e otimize prompts especificamente para ChatGPT com Kari AI. Melhore suas conversas ChatGPT com técnicas avançadas de engenharia de prompts.',
      keywords: ['gerador de prompts ChatGPT', 'prompts ChatGPT', 'otimização ChatGPT', 'engenharia de prompts', 'dicas ChatGPT'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    de: {
      title: 'ChatGPT-Prompt-Generator - Optimieren Sie Ihre ChatGPT-Prompts',
      description: 'Generieren und optimieren Sie Prompts speziell für ChatGPT mit Kari AI. Verbessern Sie Ihre ChatGPT-Gespräche mit fortgeschrittenen Prompt-Engineering-Techniken.',
      keywords: ['ChatGPT-prompt-generator', 'ChatGPT-prompts', 'ChatGPT-optimierung', 'prompt-engineering', 'ChatGPT-tipps'],
      difficulty: 'Medium',
      searchVolume: '>100'
    }
  },
  'midjourney': {
    en: {
      title: 'Midjourney Prompt Generator - Perfect Midjourney Prompts',
      description: 'Generate perfect prompts for Midjourney image creation with Kari AI optimization. Master Midjourney parameters, styles, and techniques.',
      keywords: ['Midjourney prompt generator', 'Midjourney prompts', 'Midjourney parameters', 'AI image generation', 'Midjourney tips', 'image prompts'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    zh: {
      title: 'Midjourney提示词生成器 - 完美的Midjourney提示词',
      description: '使用Kari AI优化为Midjourney图像创建生成完美提示词。掌握Midjourney参数、风格和技巧。',
      keywords: ['Midjourney提示词生成器', 'Midjourney提示词', 'Midjourney参数', 'AI图像生成', 'Midjourney技巧', '图像提示词'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    ja: {
      title: 'Midjourneyプロンプトジェネレーター - 完璧なMidjourneyプロンプト',
      description: 'Kari AI最適化でMidjourney画像作成用の完璧なプロンプトを生成。Midjourneyパラメータ、スタイル、テクニックをマスター。',
      keywords: ['Midjourneyプロンプトジェネレーター', 'Midjourneyプロンプト', 'Midjourneyパラメータ', 'AI画像生成', 'Midjourneyコツ'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    ko: {
      title: 'Midjourney 프롬프트 생성기 - 완벽한 Midjourney 프롬프트',
      description: 'Kari AI 최적화로 Midjourney 이미지 생성을 위한 완벽한 프롬프트를 생성하세요. Midjourney 매개변수, 스타일, 기법을 마스터하세요.',
      keywords: ['Midjourney 프롬프트 생성기', 'Midjourney 프롬프트', 'Midjourney 매개변수', 'AI 이미지 생성', 'Midjourney 팁'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts Midjourney - Prompts Midjourney Parfaits',
      description: 'Générez des prompts parfaits pour la création d\'images Midjourney avec l\'optimisation Kari AI. Maîtrisez les paramètres, styles et techniques Midjourney.',
      keywords: ['générateur de prompts Midjourney', 'prompts Midjourney', 'paramètres Midjourney', 'génération d\'images IA', 'conseils Midjourney'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts Midjourney - Prompts Midjourney Perfectos',
      description: 'Genera prompts perfectos para creación de imágenes Midjourney con optimización Kari AI. Domina parámetros, estilos y técnicas de Midjourney.',
      keywords: ['generador de prompts Midjourney', 'prompts Midjourney', 'parámetros Midjourney', 'generación de imágenes IA', 'consejos Midjourney'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts Midjourney - Prompts Midjourney Perfeitos',
      description: 'Gere prompts perfeitos para criação de imagens Midjourney com otimização Kari AI. Domine parâmetros, estilos e técnicas do Midjourney.',
      keywords: ['gerador de prompts Midjourney', 'prompts Midjourney', 'parâmetros Midjourney', 'geração de imagens IA', 'dicas Midjourney'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    de: {
      title: 'Midjourney-Prompt-Generator - Perfekte Midjourney-Prompts',
      description: 'Generieren Sie perfekte Prompts für Midjourney-Bilderstellung mit Kari AI-Optimierung. Meistern Sie Midjourney-Parameter, -Stile und -Techniken.',
      keywords: ['Midjourney-prompt-generator', 'Midjourney-prompts', 'Midjourney-parameter', 'KI-bildgenerierung', 'Midjourney-tipps'],
      difficulty: 'Medium',
      searchVolume: '>100'
    }
  },
  'drawing': {
    en: {
      title: 'Drawing Prompt Generator - Creative Drawing Inspiration',
      description: 'Inspire your creativity with drawing prompt suggestions from Kari AI. Perfect for artists, students, and creative challenges.',
      keywords: ['drawing prompt generator', 'drawing prompts', 'art inspiration', 'creative drawing', 'drawing ideas', 'art challenges'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    zh: {
      title: '绘画提示词生成器 - 创意绘画灵感',
      description: '使用Kari AI的绘画提示建议激发您的创造力。适合艺术家、学生和创意挑战。',
      keywords: ['绘画提示词生成器', '绘画提示词', '艺术灵感', '创意绘画', '绘画想法', '艺术挑战'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    ja: {
      title: 'ドローイングプロンプトジェネレーター - クリエイティブドローイングインスピレーション',
      description: 'Kari AIのドローイングプロンプト提案で創造性を刺激。アーティスト、学生、クリエイティブチャレンジに最適。',
      keywords: ['ドローイングプロンプトジェネレーター', 'ドローイングプロンプト', 'アートインスピレーション', 'クリエイティブドローイング', 'ドローイングアイデア'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    ko: {
      title: '드로잉 프롬프트 생성기 - 창의적 드로잉 영감',
      description: 'Kari AI의 드로잉 프롬프트 제안으로 창의성을 자극하세요. 아티스트, 학생, 창의적 도전에 완벽합니다.',
      keywords: ['드로잉 프롬프트 생성기', '드로잉 프롬프트', '아트 영감', '창의적 드로잉', '드로잉 아이디어', '아트 챌린지'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts de Dessin - Inspiration Créative de Dessin',
      description: 'Inspirez votre créativité avec les suggestions de prompts de dessin de Kari AI. Parfait pour les artistes, étudiants et défis créatifs.',
      keywords: ['générateur de prompts de dessin', 'prompts de dessin', 'inspiration artistique', 'dessin créatif', 'idées de dessin', 'défis artistiques'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts de Dibujo - Inspiración Creativa de Dibujo',
      description: 'Inspira tu creatividad con sugerencias de prompts de dibujo de Kari AI. Perfecto para artistas, estudiantes y desafíos creativos.',
      keywords: ['generador de prompts de dibujo', 'prompts de dibujo', 'inspiración artística', 'dibujo creativo', 'ideas de dibujo', 'desafíos artísticos'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts de Desenho - Inspiração Criativa de Desenho',
      description: 'Inspire sua criatividade com sugestões de prompts de desenho da Kari AI. Perfeito para artistas, estudantes e desafios criativos.',
      keywords: ['gerador de prompts de desenho', 'prompts de desenho', 'inspiração artística', 'desenho criativo', 'ideias de desenho', 'desafios artísticos'],
      difficulty: 'Easy',
      searchVolume: '>100'
    },
    de: {
      title: 'Zeichnungs-Prompt-Generator - Kreative Zeichnungsinspiration',
      description: 'Inspirieren Sie Ihre Kreativität mit Zeichnungs-Prompt-Vorschlägen von Kari AI. Perfekt für Künstler, Studenten und kreative Herausforderungen.',
      keywords: ['zeichnungs-prompt-generator', 'zeichnungs-prompts', 'kunstinspiration', 'kreatives zeichnen', 'zeichnungsideen', 'kunstherausforderungen'],
      difficulty: 'Easy',
      searchVolume: '>100'
    }
  },
  'ai-video': {
    en: {
      title: 'AI Video Prompt Generator - Video Generation Prompts',
      description: 'Create optimized prompts for AI video generation tools like Runway, Pika, and more. Master video prompt engineering with Kari AI.',
      keywords: ['AI video prompt generator', 'video generation prompts', 'Runway prompts', 'Pika prompts', 'AI video tools', 'video prompt engineering'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    zh: {
      title: 'AI视频提示词生成器 - 视频生成提示词',
      description: '为Runway、Pika等AI视频生成工具创建优化的提示词。使用Kari AI掌握视频提示词工程。',
      keywords: ['AI视频提示词生成器', '视频生成提示词', 'Runway提示词', 'Pika提示词', 'AI视频工具', '视频提示词工程'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    ja: {
      title: 'AI動画プロンプトジェネレーター - 動画生成プロンプト',
      description: 'Runway、Pikaなどの AI動画生成ツール用に最適化されたプロンプトを作成。Kari AIで動画プロンプトエンジニアリングをマスター。',
      keywords: ['AI動画プロンプトジェネレーター', '動画生成プロンプト', 'Runwayプロンプト', 'Pikaプロンプト', 'AI動画ツール'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    ko: {
      title: 'AI 비디오 프롬프트 생성기 - 비디오 생성 프롬프트',
      description: 'Runway, Pika 등 AI 비디오 생성 도구를 위한 최적화된 프롬프트를 만드세요. Kari AI로 비디오 프롬프트 엔지니어링을 마스터하세요.',
      keywords: ['AI 비디오 프롬프트 생성기', '비디오 생성 프롬프트', 'Runway 프롬프트', 'Pika 프롬프트', 'AI 비디오 도구'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    fr: {
      title: 'Générateur de Prompts Vidéo IA - Prompts de Génération Vidéo',
      description: 'Créez des prompts optimisés pour les outils de génération vidéo IA comme Runway, Pika et plus. Maîtrisez l\'ingénierie de prompts vidéo avec Kari AI.',
      keywords: ['générateur de prompts vidéo IA', 'prompts de génération vidéo', 'prompts Runway', 'prompts Pika', 'outils vidéo IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    es: {
      title: 'Generador de Prompts de Video IA - Prompts de Generación de Video',
      description: 'Crea prompts optimizados para herramientas de generación de video IA como Runway, Pika y más. Domina la ingeniería de prompts de video con Kari AI.',
      keywords: ['generador de prompts de video IA', 'prompts de generación de video', 'prompts Runway', 'prompts Pika', 'herramientas de video IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    pt: {
      title: 'Gerador de Prompts de Vídeo IA - Prompts de Geração de Vídeo',
      description: 'Crie prompts otimizados para ferramentas de geração de vídeo IA como Runway, Pika e mais. Domine a engenharia de prompts de vídeo com Kari AI.',
      keywords: ['gerador de prompts de vídeo IA', 'prompts de geração de vídeo', 'prompts Runway', 'prompts Pika', 'ferramentas de vídeo IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    de: {
      title: 'KI-Video-Prompt-Generator - Video-Generierungs-Prompts',
      description: 'Erstellen Sie optimierte Prompts für KI-Video-Generierungstools wie Runway, Pika und mehr. Meistern Sie Video-Prompt-Engineering mit Kari AI.',
      keywords: ['KI-video-prompt-generator', 'video-generierungs-prompts', 'Runway-prompts', 'Pika-prompts', 'KI-video-tools'],
      difficulty: 'Medium',
      searchVolume: '>100'
    }
  },
  'kari-ai': {
    en: {
      title: 'Kari AI - Advanced Prompt Optimization with 4-D Methodology',
      description: 'Discover Kari AI\'s revolutionary 4-D methodology for prompt optimization. Transform your AI interactions with professional-grade prompt engineering.',
      keywords: ['Kari AI', 'prompt optimization', '4-D methodology', 'prompt engineering', 'AI optimization', 'prompt generator', 'AI tools'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    zh: {
      title: 'Kari AI - 4-D方法论高级提示词优化',
      description: '探索Kari AI革命性的4-D提示词优化方法论。通过专业级提示词工程改变您的AI交互体验。',
      keywords: ['Kari AI', '提示词优化', '4-D方法论', '提示词工程', 'AI优化', '提示词生成器', 'AI工具'],
      difficulty: 'Medium',
      searchVolume: '>1000'
    },
    ja: {
      title: 'Kari AI - 4-D方法論による高度なプロンプト最適化',
      description: 'Kari AIの革命的な4-D方法論によるプロンプト最適化を発見してください。プロフェッショナルグレードのプロンプトエンジニアリングでAIインタラクションを変革します。',
      keywords: ['Kari AI', 'プロンプト最適化', '4-D方法論', 'プロンプトエンジニアリング', 'AI最適化', 'プロンプトジェネレーター', 'AIツール'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    ko: {
      title: 'Kari AI - 4-D 방법론을 통한 고급 프롬프트 최적화',
      description: 'Kari AI의 혁신적인 4-D 프롬프트 최적화 방법론을 발견하세요. 전문가급 프롬프트 엔지니어링으로 AI 상호작용을 변화시키세요.',
      keywords: ['Kari AI', '프롬프트 최적화', '4-D 방법론', '프롬프트 엔지니어링', 'AI 최적화', '프롬프트 생성기', 'AI 도구'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    fr: {
      title: 'Kari AI - Optimisation Avancée de Prompts avec Méthodologie 4-D',
      description: 'Découvrez la méthodologie révolutionnaire 4-D de Kari AI pour l\'optimisation de prompts. Transformez vos interactions IA avec l\'ingénierie de prompts de niveau professionnel.',
      keywords: ['Kari AI', 'optimisation de prompts', 'méthodologie 4-D', 'ingénierie de prompts', 'optimisation IA', 'générateur de prompts', 'outils IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    es: {
      title: 'Kari AI - Optimización Avanzada de Prompts con Metodología 4-D',
      description: 'Descubre la metodología revolucionaria 4-D de Kari AI para optimización de prompts. Transforma tus interacciones IA con ingeniería de prompts de nivel profesional.',
      keywords: ['Kari AI', 'optimización de prompts', 'metodología 4-D', 'ingeniería de prompts', 'optimización IA', 'generador de prompts', 'herramientas IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    pt: {
      title: 'Kari AI - Otimização Avançada de Prompts com Metodologia 4-D',
      description: 'Descubra a metodologia revolucionária 4-D da Kari AI para otimização de prompts. Transforme suas interações IA com engenharia de prompts de nível profissional.',
      keywords: ['Kari AI', 'otimização de prompts', 'metodologia 4-D', 'engenharia de prompts', 'otimização IA', 'gerador de prompts', 'ferramentas IA'],
      difficulty: 'Medium',
      searchVolume: '>100'
    },
    de: {
      title: 'Kari AI - Erweiterte Prompt-Optimierung mit 4-D-Methodik',
      description: 'Entdecken Sie Kari AIs revolutionäre 4-D-Methodik für Prompt-Optimierung. Transformieren Sie Ihre KI-Interaktionen mit professioneller Prompt-Engineering.',
      keywords: ['Kari AI', 'Prompt-Optimierung', '4-D-Methodik', 'Prompt-Engineering', 'KI-Optimierung', 'Prompt-Generator', 'KI-Tools'],
      difficulty: 'Medium',
      searchVolume: '>100'
    }
  }
};

/**
 * Generate comprehensive SEO metadata for generator pages
 * @param {string} generatorType - Type of generator (writing, art, ai, etc.)
 * @param {string} locale - Language locale (en, zh, ja, etc.)
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} Complete metadata object for Next.js
 */
export function generateSEOMetadata(generatorType, locale, baseUrl = 'https://example.com') {
  const seoData = generatorSEOData[generatorType]?.[locale] || generatorSEOData[generatorType]?.['en'];
  
  if (!seoData) {
    throw new Error(`SEO data not found for generator type: ${generatorType}, locale: ${locale}`);
  }

  const canonicalUrl = `${baseUrl}/${locale}/${generatorType === 'ai-video' ? 'ai-video-prompt-generator' : `${generatorType}-prompt-generator`}`;
  
  // Generate hreflang alternates
  const alternates = {
    canonical: canonicalUrl,
    languages: {}
  };

  // Add all supported locales
  const supportedLocales = ['en', 'zh', 'ja', 'ko', 'fr', 'es', 'pt', 'de'];
  supportedLocales.forEach(loc => {
    if (generatorSEOData[generatorType]?.[loc]) {
      alternates.languages[loc] = `${baseUrl}/${loc}/${generatorType === 'ai-video' ? 'ai-video-prompt-generator' : `${generatorType}-prompt-generator`}`;
    }
  });

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(', '),
    authors: [{ name: 'Kari AI' }],
    creator: 'Kari AI',
    publisher: 'Kari AI',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: canonicalUrl,
      siteName: 'Kari AI Prompt Generators',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image-${generatorType}.jpg`,
          width: 1200,
          height: 630,
          alt: seoData.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      creator: '@KariAI',
      images: [`${baseUrl}/og-image-${generatorType}.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    category: 'technology',
    classification: 'AI Tools',
    other: {
      'application-name': 'Kari AI Prompt Generators',
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
    }
  };
}

/**
 * Generate comprehensive structured data for generator pages
 * @param {string} generatorType - Type of generator
 * @param {string} locale - Language locale
 * @param {string} baseUrl - Base URL of the site
 * @returns {Array} Array of JSON-LD structured data objects
 */
export function generateStructuredData(generatorType, locale, baseUrl = 'https://example.com') {
  const seoData = generatorSEOData[generatorType]?.[locale] || generatorSEOData[generatorType]?.['en'];
  const pagePath = generatorType === 'ai-video' ? 'ai-video-prompt-generator' : `${generatorType}-prompt-generator`;
  const canonicalUrl = `${baseUrl}/${locale}/${pagePath}`;

  // WebApplication Schema
  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seoData.title,
    description: seoData.description,
    url: canonicalUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    creator: {
      '@type': 'Organization',
      name: 'Kari AI',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kari AI',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`
    },
    inLanguage: locale,
    keywords: seoData.keywords.join(', '),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: [
      'AI-powered prompt optimization',
      '4-D methodology (Deconstruct, Diagnose, Develop, Deliver)',
      'Multi-platform support (ChatGPT, Claude, Gemini, Midjourney)',
      'Real-time optimization',
      'Free to use',
      'Multiple language support',
      'BASIC and DETAIL optimization modes'
    ],
    screenshot: `${baseUrl}/screenshots/${generatorType}-generator.jpg`,
    softwareVersion: '1.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  };

  // BreadcrumbList Schema
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: seoData.title,
        item: canonicalUrl
      }
    ]
  };

  return [webApplication, breadcrumbList];
}

/**
 * Generate FAQ structured data for generator pages
 * @param {string} generatorType - Type of generator
 * @param {string} locale - Language locale
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} FAQ JSON-LD structured data
 */
export function generateFAQStructuredData(generatorType, locale, baseUrl = 'https://example.com') {
  // Common FAQ questions and answers based on generator type and locale
  const faqData = {
    'writing': {
      'en': [
        {
          question: 'How does the AI writing prompt generator work?',
          answer: 'Our AI writing prompt generator uses Kari\'s 4-D methodology to analyze your input and create optimized prompts. It deconstructs your idea, diagnoses areas for improvement, develops enhanced content, and delivers a polished prompt ready for use.'
        },
        {
          question: 'Is the writing prompt generator free to use?',
          answer: 'Yes, our writing prompt generator is completely free to use. You can generate unlimited writing prompts without any cost or registration required.'
        },
        {
          question: 'What types of writing prompts can I generate?',
          answer: 'You can generate prompts for novels, short stories, poetry, creative writing, academic writing, blog posts, and more. The generator supports various genres including fiction, non-fiction, fantasy, sci-fi, romance, and mystery.'
        },
        {
          question: 'Can I use the generated prompts commercially?',
          answer: 'Yes, all prompts generated by our tool are free to use for both personal and commercial purposes. There are no licensing restrictions on the output.'
        }
      ],
      'zh': [
        {
          question: '写作提示词生成器是如何工作的？',
          answer: '我们的AI写作提示词生成器使用Kari的4-D方法论来分析您的输入并创建优化的提示词。它解构您的想法，诊断改进领域，开发增强内容，并提供准备使用的精美提示词。'
        },
        {
          question: '写作提示词生成器免费使用吗？',
          answer: '是的，我们的写作提示词生成器完全免费使用。您可以无限制地生成写作提示词，无需任何费用或注册。'
        },
        {
          question: '我可以生成什么类型的写作提示词？',
          answer: '您可以生成小说、短篇故事、诗歌、创意写作、学术写作、博客文章等提示词。生成器支持各种类型，包括小说、非小说、奇幻、科幻、爱情和悬疑。'
        },
        {
          question: '我可以商业使用生成的提示词吗？',
          answer: '是的，我们工具生成的所有提示词都可以免费用于个人和商业目的。输出没有许可限制。'
        }
      ]
    },
    'art': {
      'en': [
        {
          question: 'How do I create better art prompts for AI image generation?',
          answer: 'Use specific descriptive language, include style references, specify composition details, and mention lighting conditions. Our Kari AI optimizer helps enhance your prompts automatically.'
        },
        {
          question: 'Which AI art platforms does this generator support?',
          answer: 'Our art prompt generator works with Midjourney, DALL-E, Stable Diffusion, Leonardo AI, and most other AI image generation platforms.'
        },
        {
          question: 'Can I generate prompts for different art styles?',
          answer: 'Yes, you can generate prompts for various art styles including photorealistic, cartoon, anime, oil painting, watercolor, digital art, and many more artistic styles.'
        }
      ]
    },
    'chatgpt': {
      'en': [
        {
          question: 'How can I improve my ChatGPT prompts?',
          answer: 'Use clear instructions, provide context, specify the desired output format, and use role-playing techniques. Our Kari optimizer applies advanced prompt engineering techniques automatically.'
        },
        {
          question: 'What makes a good ChatGPT prompt?',
          answer: 'Good ChatGPT prompts are specific, provide clear context, include examples when helpful, and specify the desired output format and tone.'
        }
      ]
    },
    'midjourney': {
      'en': [
        {
          question: 'How do Midjourney parameters work?',
          answer: 'Midjourney parameters like --ar for aspect ratio, --v for version, --stylize for stylization level, and --chaos for variety control help fine-tune your image generation.'
        },
        {
          question: 'What are the best practices for Midjourney prompts?',
          answer: 'Use descriptive language, specify art styles, include lighting and composition details, and experiment with different parameters to achieve your desired results.'
        }
      ]
    }
  };

  const questions = faqData[generatorType]?.[locale] || faqData[generatorType]?.['en'] || [];
  
  if (questions.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Get the base URL from environment or default
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-domain.com'; // Replace with actual domain
  }
  return 'http://localhost:3000';
}