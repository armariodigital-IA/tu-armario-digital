export type Language = "es" | "en";

type TranslationValue = {
  es: string;
  en: string;
};

export const translations = {
  homeTagline: {
    es: "Minimalismo con carácter.",
    en: "Minimalism with character.",
  },
  login: {
    es: "Iniciar sesión",
    en: "Login",
  },
  createAccount: {
    es: "Crear cuenta",
    en: "Create account",
  },
  fullNameRequired: {
    es: "El nombre completo es obligatorio.",
    en: "Full name is required.",
  },
  emailRequired: {
    es: "El email es obligatorio.",
    en: "Email is required.",
  },
  validEmail: {
    es: "Ingresá un email válido.",
    en: "Enter a valid email.",
  },
  passwordRequired: {
    es: "La contraseña es obligatoria.",
    en: "Password is required.",
  },
  passwordMin: {
    es: "Debe tener mínimo 8 caracteres.",
    en: "It must be at least 8 characters.",
  },
  passwordsMismatch: {
    es: "Las contraseñas no coinciden.",
    en: "Passwords do not match.",
  },
  accountCreated: {
    es: "Cuenta creada con éxito",
    en: "Account created successfully",
  },
  serverError: {
    es: "Error en el servidor.",
    en: "Server error.",
  },
  connectionError: {
    es: "No se pudo conectar con el servidor.",
    en: "Could not connect to the server.",
  },
  fullNamePlaceholder: {
    es: "Nombre completo *",
    en: "Full name *",
  },
  emailPlaceholder: {
    es: "Email *",
    en: "Email *",
  },
  passwordPlaceholder: {
    es: "Contraseña *",
    en: "Password *",
  },
  confirmPasswordPlaceholder: {
    es: "Confirmar contraseña *",
    en: "Confirm password *",
  },
  genderMale: {
    es: "Hombre",
    en: "Man",
  },
  genderFemale: {
    es: "Mujer",
    en: "Woman",
  },
  processing: {
    es: "Procesando...",
    en: "Processing...",
  },
  enter: {
    es: "Entrar",
    en: "Enter",
  },
  register: {
    es: "Registrarse",
    en: "Register",
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel",
  },
  howCreateOutfit: {
    es: "¿Cómo querés crear tu outfit?",
    en: "How do you want to create your outfit?",
  },
  createManual: {
    es: "Crear manualmente",
    en: "Create manually",
  },
  createManualDescription: {
    es: "Elegí cada prenda de tu armario digital y armá tu outfit perfecto.",
    en: "Choose each garment from your digital wardrobe and build your perfect outfit.",
  },
  generateWithAI: {
    es: "Generar con IA",
    en: "Generate with AI",
  },
  generateWithAIDescription: {
    es: "Respondé algunas preguntas y dejá que la IA cree tu outfit usando tus prendas y el clima actual.",
    en: "Answer a few questions and let AI create your outfit using your garments and the current weather.",
  },
  back: {
    es: "Volver",
    en: "Back",
  },
  generateOutfitAI: {
    es: "Generar Outfit con IA",
    en: "Generate Outfit with AI",
  },
  occasion: {
    es: "Ocasión",
    en: "Occasion",
  },
  casual: {
    es: "Casual",
    en: "Casual",
  },
  formal: {
    es: "Formal",
    en: "Formal",
  },
  sporty: {
    es: "Deportivo",
    en: "Sporty",
  },
  howFeelToday: {
    es: "¿Cómo te sentís hoy?",
    en: "How are you feeling today?",
  },
  relaxed: {
    es: "Relajado",
    en: "Relaxed",
  },
  confident: {
    es: "Seguro",
    en: "Confident",
  },
  creative: {
    es: "Creativo",
    en: "Creative",
  },
  generating: {
    es: "Generando...",
    en: "Generating...",
  },
  generateOutfit: {
    es: "Generar Outfit",
    en: "Generate Outfit",
  },
  errorGeneratingOutfit: {
    es: "Error generando outfit",
    en: "Error generating outfit",
  },
  loadWardrobeError: {
    es: "No se pudo cargar tu armario",
    en: "Could not load your wardrobe",
  },
  createOutfitManually: {
    es: "Crear outfit manualmente",
    en: "Create outfit manually",
  },
  manualOutfitDescription: {
    es: "Elegí una prenda por categoría y armá una combinación con tu armario real.",
    en: "Choose one garment per category and build a combination from your real wardrobe.",
  },
  top: {
    es: "Parte superior",
    en: "Top",
  },
  bottom: {
    es: "Parte inferior",
    en: "Bottom",
  },
  shoes: {
    es: "Calzado",
    en: "Shoes",
  },
  outerwear: {
    es: "Abrigo",
    en: "Outerwear",
  },
  selectedItem: {
    es: "Seleccionada: {name}",
    en: "Selected: {name}",
  },
  allFieldsRequired: {
    es: "Todos los campos son obligatorios",
    en: "All fields are required",
  },
  deleteGarmentConfirm: {
    es: "Esta prenda no podrá ser restaurada. ¿Eliminar?",
    en: "This garment cannot be restored. Delete it?",
  },
  myWardrobe: {
    es: "Mi Armario",
    en: "My Wardrobe",
  },
  addGarment: {
    es: "Agregar Prenda",
    en: "Add Garment",
  },
  aiWardrobeAssistant: {
    es: "Asistente de armario con IA",
    en: "AI wardrobe assistant",
  },
  uploadGarmentImage: {
    es: "Subí una foto de la prenda",
    en: "Upload a garment photo",
  },
  uploadGarmentHint: {
    es: "Arrastrá una imagen aquí o hacé click para seleccionar una.",
    en: "Drag an image here or click to choose one.",
  },
  uploadGarmentHintSecondary: {
    es: "La IA va a sugerir categoría, color, estilo, temporada y material.",
    en: "AI will suggest category, color, style, season, and material.",
  },
  analyzingImage: {
    es: "Analizando imagen...",
    en: "Analyzing image...",
  },
  aiSuggestionsReady: {
    es: "Sugerencias listas. Podés editar todo antes de guardar.",
    en: "Suggestions are ready. You can edit everything before saving.",
  },
  analyzeImageError: {
    es: "No se pudo analizar la imagen. Podés completar la prenda manualmente.",
    en: "Couldn't analyze the image. You can complete the garment manually.",
  },
  garmentDetails: {
    es: "Detalles de la prenda",
    en: "Garment details",
  },
  garmentDetailsHint: {
    es: "La IA completa lo que puede y vos ajustás los detalles finales.",
    en: "AI fills what it can and you fine-tune the final details.",
  },
  name: {
    es: "Nombre",
    en: "Name",
  },
  namePlaceholder: {
    es: "Ej. Camisa Oxford blanca",
    en: "e.g. White Oxford shirt",
  },
  color: {
    es: "Color",
    en: "Color",
  },
  colorPlaceholder: {
    es: "Ej. Azul marino",
    en: "e.g. Navy blue",
  },
  style: {
    es: "Estilo",
    en: "Style",
  },
  stylePlaceholder: {
    es: "Ej. Casual, sastrero, deportivo",
    en: "e.g. Casual, tailored, sporty",
  },
  material: {
    es: "Material",
    en: "Material",
  },
  materialPlaceholder: {
    es: "Ej. Algodón, denim, cuero",
    en: "e.g. Cotton, denim, leather",
  },
  imageUrl: {
    es: "URL imagen",
    en: "Image URL",
  },
  imageUrlHint: {
    es: "También podés pegar una URL si preferís no subir una foto.",
    en: "You can also paste an image URL if you prefer not to upload a photo.",
  },
  optionalField: {
    es: "Opcional",
    en: "Optional",
  },
  analyzeAgain: {
    es: "Analizar de nuevo",
    en: "Analyze again",
  },
  saveGarment: {
    es: "Guardar prenda",
    en: "Save garment",
  },
  addGarmentHelp: {
    es: "Empezá por la imagen y dejá que la IA te ayude con la carga.",
    en: "Start with the image and let AI help with the entry.",
  },
  allYear: {
    es: "Todo el año",
    en: "All year",
  },
  summer: {
    es: "Verano",
    en: "Summer",
  },
  winter: {
    es: "Invierno",
    en: "Winter",
  },
  save: {
    es: "Guardar",
    en: "Save",
  },
  category: {
    es: "Categoría: {value}",
    en: "Category: {value}",
  },
  categoryLabel: {
    es: "Categoría",
    en: "Category",
  },
  season: {
    es: "Temporada: {value}",
    en: "Season: {value}",
  },
  seasonLabel: {
    es: "Temporada",
    en: "Season",
  },
  delete: {
    es: "Eliminar",
    en: "Delete",
  },
  favorite: {
    es: "Favorito",
    en: "Favorite",
  },
  createYourOutfit: {
    es: "Crea tu outfit",
    en: "Create your outfit",
  },
  account: {
    es: "Cuenta",
    en: "Account",
  },
  logout: {
    es: "Cerrar sesión",
    en: "Logout",
  },
  language: {
    es: "Idioma",
    en: "Language",
  },
  spanish: {
    es: "Español",
    en: "Spanish",
  },
  english: {
    es: "English",
    en: "English",
  },
  friend: {
    es: "Amigo",
    en: "Friend",
  },
  dashboardQuestion1: {
    es: "¿Qué outfit vas a romper hoy, {name}?",
    en: "What outfit are you going to own today, {name}?",
  },
  dashboardQuestion2: {
    es: "¿Listo para conquistar el día, {name}?",
    en: "Ready to conquer the day, {name}?",
  },
  dashboardQuestion3: {
    es: "¿Qué estilo define tu energía hoy, {name}?",
    en: "What style defines your energy today, {name}?",
  },
  dashboardQuestion4: {
    es: "¿Hoy vamos clásico o arriesgado, {name}?",
    en: "Are we going classic or bold today, {name}?",
  },
  dashboardQuestion5: {
    es: "¿Qué versión tuya mostramos hoy, {name}?",
    en: "Which version of you are we showing today, {name}?",
  },
  recommendationLoadError: {
    es: "No pudimos cargar tu recomendación por ahora.",
    en: "We couldn't load your recommendation right now.",
  },
  feelsLike: {
    es: "{temp}° (sensación térmica de {feelsLike}°)",
    en: "{temp}° (feels like {feelsLike}°)",
  },
  hourlyForecast: {
    es: "Pronóstico por hora",
    en: "Hourly forecast",
  },
  upcomingHours: {
    es: "Próximas horas",
    en: "Upcoming hours",
  },
  outfitOfDay: {
    es: "Outfit del día",
    en: "Outfit of the day",
  },
  createRecommendationLoading: {
    es: "Generando recomendación...",
    en: "Generating recommendation...",
  },
  registerPageSuccess: {
    es: "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
    en: "Account created successfully. You can now log in.",
  },
  password: {
    es: "Password",
    en: "Password",
  },
} satisfies Record<string, TranslationValue>;

export type TranslationKey = keyof typeof translations;

export const languageLabels: Record<Language, string> = {
  es: "Español",
  en: "English",
};
