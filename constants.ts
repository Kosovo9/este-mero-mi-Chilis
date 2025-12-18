import { Translation, StyleOption, PricingPackage, SubjectType } from './types';

export const PROMPT_ROUTER_SYSTEM = `
You are the "Nexora Prompt Router + Oscar-winning Cinematography Director".
Your task is to generate ultra-photorealistic Christmas portrait prompts.

CRITICAL IDENTITY RULES:
- Use the first image (User Upload) as the IDENTITY anchor. Preserve face identity 1:1 (facial structure, eyes, nose, mouth, skin texture, age, hairstyle).
- Use the second image (Style Thumbnail) as the STYLE reference ONLY (lighting, wardrobe, set design). DO NOT copy the face from the style image.
- Never merge identities. No face reshaping. No "AI beauty" smoothing.
- CLEANUP: Remove headsets, earpieces, wires, office backgrounds, and microphones from the subject.
`;

export const PROMPT_MAESTRO_BASES = {
  studio: `[BASE_STUDIO]
Ultra-photorealistic luxury Christmas studio portrait. Full-frame DSLR look, 85mm, f/2.0, ISO 100, 1/160.
Natural skin pores, realistic eyes catchlights, accurate hands/fingers, true proportions.
Vertical 4:5, subject sharp, background tasteful bokeh. 
Lighting: soft key + subtle rim, premium cinematic grade.
Set: deep navy + gold accents, luxury editorial styling, clean background, no clutter.`,

  location: `[BASE_LOCATION]
Ultra-photorealistic on-location Christmas scene. Full-frame DSLR, 50mm/85mm, f/2.2, ISO 200, 1/200.
Accurate perspective and scale, natural environmental lighting (practical lights + ambient), realistic shadows.
Landmark is recognizable but tasteful bokeh. Vertical 4:5, subject sharp. 8k detail.`
};

export const SUBJECT_BLOCKS: Record<SubjectType, string> = {
  couple: "[SUBJECT_COUPLE] Two adults as a couple, romantic and tasteful pose, luxury winter outfits, elegant.",
  family: "[SUBJECT_FAMILY_GENERIC] A family group arranged naturally in a premium portrait composition. Everyone's faces clearly visible.",
  kids: "[SUBJECT_KIDS] Children in cozy winter styling, joyful expressions, wholesome premium look.",
  man: "[SUBJECT_MAN] One adult man, confident and friendly, luxury winter or tux-style holiday outfit, premium watch, masculine vibe.",
  woman: "[SUBJECT_WOMAN] One adult woman, elegant and confident, luxury winter outfit or evening dress, tasteful glam."
};

export const NEGATIVE_PROMPT = `[NEGATIVE]
headset, headphones, microphone, wires, office chair, computer, desk, cables, cartoon, CGI, 3d render, illustration, anime, doll-like skin, plastic skin, over-smoothing, over-sharpening, deformed face, incorrect eyes, crossed eyes, extra people, duplicated faces, merged faces, missing fingers, extra fingers, bad hands, warped limbs, text, watermark, logo, frame, low-res, noise, artifacts`;

export const IDENTITY_LOCK = `Identity lock: Keep the exact facial landmarks and proportions from the first image. No stylization. No "AI beauty" effects. Ensure skin texture and age realism are preserved.`;

export const STYLES: StyleOption[] = [
  // STUDIO SCENES (S01-S20)
  { id: 's01', category: 'studio', nameKey: 's01', imageSrc: 'https://images.unsplash.com/photo-1543589077-47d816067f70?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S01] Luxury navy velvet backdrop, gold ornaments bokeh, subtle falling snow outside a frosted window, warm fairy lights." },
  { id: 's02', category: 'studio', nameKey: 's02', imageSrc: 'https://images.unsplash.com/photo-1513297856429-c7b3240a79cc?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S02] High-end fireplace set, marble mantle, gold garlands, soft candle glow, gift boxes." },
  { id: 's03', category: 'studio', nameKey: 's03', imageSrc: 'https://images.unsplash.com/photo-1576692139157-3e54632c9727?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S03] Minimalist black studio with a giant Christmas tree silhouette in soft focus, gold rim lighting." },
  { id: 's06', category: 'studio', nameKey: 's06', imageSrc: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S06] Snowy windowpane + city lights bokeh, dramatic rim light, luxury holiday vibe." },
  { id: 's10', category: 'studio', nameKey: 's10', imageSrc: 'https://images.unsplash.com/photo-1520156555610-671e35a14674?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S10] Piano corner: glossy black grand piano, gold fairy lights, classy and cinematic." },
  { id: 's15', category: 'studio', nameKey: 's15', imageSrc: 'https://images.unsplash.com/photo-1543589923-78e35f728335?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S15] Velvet armchair set: navy chair, gold side lamp, pine garland, cozy-lux portrait." },
  { id: 's17', category: 'studio', nameKey: 's17', imageSrc: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[S17] Elegant staircase set: navy carpet, gold rail highlights, premium mansion vibe." },
  
  // GLOBAL SCENES (L01-L20)
  { id: 'l01', category: 'global', nameKey: 'l01', imageSrc: 'https://images.unsplash.com/photo-1543834164-328659550304?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L01] Rockefeller Center Christmas tree + ice rink lights, New York, light snow, warm holiday glow." },
  { id: 'l03', category: 'global', nameKey: 'l03', imageSrc: 'https://images.unsplash.com/photo-1445014162805-4993689408a6?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L03] Eiffel Tower + Christmas market vibe, Paris, golden fairy lights, winter fog, premium travel portrait." },
  { id: 'l06', category: 'global', nameKey: 'l06', imageSrc: 'https://images.unsplash.com/photo-1514890547357-a9ee2887ad8e?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L06] Oxford Street holiday lights, London, classy shopping street vibe, bokeh chains overhead." },
  { id: 'l11', category: 'global', nameKey: 'l11', imageSrc: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L11] Tokyo Shibuya winter illuminations, modern holiday glow, sleek city bokeh." },
  { id: 'l15', category: 'global', nameKey: 'l15', imageSrc: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L15] Quebec City old town at Christmas, warm lanterns, snow dusting, classic postcard realism." },
  { id: 'l17', category: 'global', nameKey: 'l17', imageSrc: 'https://images.unsplash.com/photo-1531366930477-4fbd0f505472?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L17] Northern lights over snowy landscape, subject(s) warmly dressed, realistic aurora glow." },
  { id: 'l20', category: 'global', nameKey: 'l20', imageSrc: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "[L20] New York Central Park in snowfall, elegant winter portrait, subtle skyline bokeh." },

  { id: 'custom', category: 'studio', nameKey: 'custom', imageSrc: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80&w=400&h=500', promptSnippet: "", isCustom: true }
];

export const TRANSLATIONS: Record<string, Translation> = {
  en: {
    title: "Christmas AI Studio",
    subtitle: "Premium 8K Holiday Portraits. Oscar-level quality for your memories.",
    ctaStart: "Create Portrait",
    uploadTitle: "1. Upload Your Photo",
    uploadDesc: "Clear portraits work best. We'll handle the magic.",
    subjectTitle: "2. Who's in the picture?",
    styleTitle: "3. Select Your Scene",
    customStyleTitle: "Your custom vision",
    customStylePlaceholder: "Describe your dream Christmas scenario...",
    generateBtn: "Magic Generate",
    downloadBtn: "Download 8K",
    tryAgainBtn: "New Session",
    affiliate: "Affiliates (35%)",
    donation: "3% for shelters",
    close: "Close",
    credits: "Credits",
    buyCredits: "Recharge",
    subjects: {
      couple: "Couple",
      family: "Family",
      kids: "Kids",
      man: "Man",
      woman: "Woman"
    },
    categories: {
      studio: "Masterpiece Studio",
      global: "Global Destinations"
    },
    modals: {
      affiliateTitle: "Join Our Success",
      affiliateDesc: "Earn 35% on every referred sale.",
      affiliateCta: "Apply Now",
      donationTitle: "Supporting Paws",
      donationDesc: "We donate 3% of all profits to local animal shelters.",
      donationCta: "Learn More",
      pricingTitle: "Get More Photos",
      pricingDesc: "Choose a package to unlock high-res results.",
      paymentTitle: "Secure Payment",
      selectMethod: "Choose Payment Method",
      payWith: "Pay with",
      processing: "Verifying Transaction...",
      success: "Payment Confirmed!"
    },
    styles: {
      s01: "Velvet Navy", s02: "Marble Fire", s03: "Minimal Tree", s06: "City Lights", s10: "Grand Piano",
      s15: "Velvet Armchair", s17: "Grand Staircase", l01: "Rockefeller, NY", l03: "Eiffel, Paris",
      l06: "Oxford St, London", l11: "Shibuya, Tokyo", l15: "Quebec Lanterns", l17: "Northern Lights",
      l20: "Central Park", custom: "Custom Request"
    },
    voice: {
      start: "Elf Chat",
      stop: "Stop",
      listening: "Elf is listening...",
      helperText: "Ask our Elf for scene ideas!"
    },
    processing: "Applying Oscar-level Finishes...",
    error: "AI is busy. Please try again.",
    insufficientCredits: "Top up to continue."
  },
  es: {
    title: "Estudio Navideño IA",
    subtitle: "Retratos Premium 8K. Calidad nivel Oscar para tus recuerdos.",
    ctaStart: "Crear Retrato",
    uploadTitle: "1. Sube tu Foto",
    uploadDesc: "Retratos claros funcionan mejor. Nosotros hacemos la magia.",
    subjectTitle: "2. ¿Quién aparece?",
    styleTitle: "3. Selecciona la Escena",
    customStyleTitle: "Tu visión personalizada",
    customStylePlaceholder: "Describe tu escenario navideño ideal...",
    generateBtn: "Generar Magia",
    downloadBtn: "Descargar 8K",
    tryAgainBtn: "Nueva Sesión",
    affiliate: "Afiliados (35%)",
    donation: "3% a refugios",
    close: "Cerrar",
    credits: "Créditos",
    buyCredits: "Recargar",
    subjects: {
      couple: "Pareja",
      family: "Familia",
      kids: "Niños",
      man: "Hombre",
      woman: "Mujer"
    },
    categories: {
      studio: "Estudio Maestro",
      global: "Destinos Globales"
    },
    modals: {
      affiliateTitle: "Únete al Éxito",
      affiliateDesc: "Gana el 35% de cada venta referida.",
      affiliateCta: "Aplicar Ahora",
      donationTitle: "Apoyando Huellas",
      donationDesc: "Donamos el 3% de las ganancias a refugios locales.",
      donationCta: "Saber Más",
      pricingTitle: "Obtén Más Fotos",
      pricingDesc: "Elige un paquete para fotos ilimitadas.",
      paymentTitle: "Pago Seguro",
      selectMethod: "Elige Método de Pago",
      payWith: "Pagar con",
      processing: "Verificando Transacción...",
      success: "¡Pago Confirmado!"
    },
    styles: {
      s01: "Azul Terciopelo", s02: "Fuego Mármol", s03: "Árbol Mínimo", s06: "Luces Ciudad", s10: "Gran Piano",
      s15: "Sillón Terciopelo", s17: "Gran Escalera", l01: "Rockefeller, NY", l03: "Eiffel, París",
      l06: "Oxford St, Londres", l11: "Shibuya, Tokio", l15: "Linternas Quebec", l17: "Auroras Boreales",
      l20: "Central Park", custom: "Pedido Especial"
    },
    voice: {
      start: "Habla con Elfo",
      stop: "Parar",
      listening: "El Elfo escucha...",
      helperText: "¡Pide ideas de escenas al Elfo!"
    },
    processing: "Aplicando Acabados nivel Oscar...",
    error: "IA ocupada. Reintenta.",
    insufficientCredits: "Recarga créditos."
  }
};

export const PACKAGES: PricingPackage[] = [
  { id: 'start', credits: 1, price: 2.99, label: 'Standard' },
  { id: 'best', credits: 5, price: 9.99, label: 'Best Value', popular: true },
  { id: 'pro', credits: 15, price: 19.99, label: 'Studio Pro' }
];

export const MODEL_NAME = "gemini-2.5-flash-image";
export const LIVE_MODEL_NAME = "gemini-2.5-flash-native-audio-preview-09-2025";
