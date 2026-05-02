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
  favoritesOnly: {
    es: "Solo favoritos",
    en: "Favorites only",
  },
  noGarmentsYet: {
    es: "Todavía no agregaste prendas.",
    en: "You haven't added any garments yet.",
  },
  noFavoriteGarments: {
    es: "Todavía no marcaste prendas favoritas.",
    en: "You haven't marked any favorites yet.",
  },
  wardrobeEmptyHint: {
    es: "Sumá tu primera prenda para empezar a organizar tu armario digital.",
    en: "Add your first garment to start building your digital wardrobe.",
  },
  edit: {
    es: "Editar",
    en: "Edit",
  },
  saveChanges: {
    es: "Guardar cambios",
    en: "Save changes",
  },
  details: {
    es: "Detalles",
    en: "Details",
  },
  colorLabel: {
    es: "Color: {value}",
    en: "Color: {value}",
  },
  close: {
    es: "Cerrar",
    en: "Close",
  },
  deleteGarmentTitle: {
    es: "Eliminar prenda",
    en: "Delete garment",
  },
  deleteGarmentDescription: {
    es: "Esta acción elimina la prenda de tu armario y no se puede deshacer.",
    en: "This action removes the garment from your wardrobe and cannot be undone.",
  },
  deleteGarmentAction: {
    es: "Sí, eliminar",
    en: "Yes, delete",
  },
  favoriteAdded: {
    es: "Agregada a favoritos",
    en: "Added to favorites",
  },
  favoriteRemoved: {
    es: "Removida de favoritos",
    en: "Removed from favorites",
  },
  notFavoriteYet: {
    es: "Todavía no está en favoritos",
    en: "Not in favorites yet",
  },
  updateGarmentError: {
    es: "No se pudo actualizar la prenda.",
    en: "Couldn't update the garment.",
  },
  deleteGarmentError: {
    es: "No se pudo eliminar la prenda.",
    en: "Couldn't delete the garment.",
  },
  saveChangesError: {
    es: "Revisá los datos antes de guardar.",
    en: "Check the garment details before saving.",
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
  styleOnboardingEyebrow: {
    es: "Personalizá tu stylist",
    en: "Personalize your stylist",
  },
  styleOnboardingTitle: {
    es: "Elegí los estilos que más te representan",
    en: "Choose the styles that feel most like you",
  },
  styleOnboardingDescription: {
    es: "Tu asistente de outfits va a usar estas estéticas como base y aprender de ellas con el tiempo.",
    en: "Your outfit assistant will use these aesthetics as its foundation and learn from them over time.",
  },
  stylesSelectedCount: {
    es: "{count} estilos seleccionados",
    en: "{count} styles selected",
  },
  stylesMultiSelectHint: {
    es: "Podés elegir más de uno. Vamos a priorizar combinaciones compatibles.",
    en: "You can choose more than one. We’ll prioritize compatible combinations.",
  },
  styleOnboardingFooterTitle: {
    es: "Esto entrena a tu stylist desde el día uno",
    en: "This trains your stylist from day one",
  },
  styleOnboardingFooterDescription: {
    es: "Después podés editar tus estilos cuando quieras desde Account > My Styles.",
    en: "You can edit your styles anytime later from Account > My Styles.",
  },
  savingStyles: {
    es: "Guardando estilos...",
    en: "Saving styles...",
  },
  confirmStyles: {
    es: "Confirmar estilos",
    en: "Confirm styles",
  },
  myStyles: {
    es: "Mis estilos",
    en: "My Styles",
  },
  editStyles: {
    es: "Editar estilos",
    en: "Edit styles",
  },
  noStylesYet: {
    es: "Todavía no elegiste estilos.",
    en: "You haven't chosen styles yet.",
  },
  styleSaveError: {
    es: "No se pudieron guardar tus estilos.",
    en: "Couldn't save your styles.",
  },
  styleEditTitle: {
    es: "Actualizá tu selección de estilos",
    en: "Update your style selection",
  },
  styleEditDescription: {
    es: "Ajustá las estéticas que querés que priorice tu stylist.",
    en: "Adjust the aesthetics you want your stylist to prioritize.",
  },
  backToHome: {
    es: "Volver al inicio",
    en: "Back to Home",
  },
  occasionLabel: {
    es: "Ocasión",
    en: "Occasion",
  },
  timeOfDay: {
    es: "Momento del día",
    en: "Time of day",
  },
  describeLookToday: {
    es: "Describí cómo te querés ver hoy...",
    en: "Describe how you want to look today...",
  },
  clothingSource: {
    es: "Fuente de prendas",
    en: "Clothing source",
  },
  useOnlyWardrobe: {
    es: "Usar solo mi armario",
    en: "Use only my wardrobe",
  },
  includeInternetClothing: {
    es: "Incluir prendas de internet",
    en: "Include internet clothing",
  },
  weatherAuto: {
    es: "Clima detectado automáticamente",
    en: "Weather detected automatically",
  },
  generateStyledOutfit: {
    es: "Crear outfit con AI",
    en: "Create outfit with AI",
  },
  smartOutfitTitle: {
    es: "Smart Outfit Generator",
    en: "Smart Outfit Generator",
  },
  smartOutfitDescription: {
    es: "Elegí el contexto y generá una propuesta visual usando tu estilo, tu armario y el clima actual.",
    en: "Choose the context and generate a visual look using your style, wardrobe, and current weather.",
  },
  smartOutfitOptionsTitle: {
    es: "Opciones del outfit",
    en: "Outfit options",
  },
  smartOutfitOptionsHint: {
    es: "Ajustá los parámetros y generamos una combinación equilibrada.",
    en: "Adjust the parameters and we'll build a balanced combination.",
  },
  smartOutfitResultTitle: {
    es: "Resultado visual",
    en: "Visual result",
  },
  smartOutfitResultHint: {
    es: "Una composición inspirada en Pinterest con prendas priorizadas por afinidad.",
    en: "A Pinterest-inspired composition with garments prioritized by affinity.",
  },
  weatherLabel: {
    es: "Clima",
    en: "Weather",
  },
  weatherEditableHint: {
    es: "Se detecta automáticamente, pero podés editarlo.",
    en: "Detected automatically, but you can edit it.",
  },
  loadingGarments: {
    es: "Cargando prendas...",
    en: "Loading garments...",
  },
  styleAccountHint: {
    es: "Podés cambiar tus estilos en la sección de cuenta",
    en: "You can change your styles in the account section",
  },
  regenerateOutfit: {
    es: "Regenerar outfit",
    en: "Regenerate outfit",
  },
  useWardrobeOnlyHint: {
    es: "Si lo desactivás, completamos faltantes con sugerencias visuales.",
    en: "If you turn this off, we'll fill gaps with visual suggestions.",
  },
  smartOutfitGenerating: {
    es: "Generando outfit...",
    en: "Generating outfit...",
  },
  smartOutfitReady: {
    es: "Outfit listo",
    en: "Outfit ready",
  },
  smartOutfitInsufficientTitle: {
    es: "Faltan prendas para completar el look",
    en: "More garments are needed to complete the look",
  },
  smartOutfitInsufficientBody: {
    es: "Necesitás al menos un top, un bottom y un par de zapatos para generar el outfit.",
    en: "You need at least one top, one bottom, and one pair of shoes to generate the outfit.",
  },
  smartOutfitEmptyTitle: {
    es: "Todavía no generaste un outfit",
    en: "You haven't generated an outfit yet",
  },
  smartOutfitEmptyBody: {
    es: "Completá las opciones de la izquierda y tocá el botón para ver la propuesta visual.",
    en: "Fill out the options on the left and press the button to see the visual proposal.",
  },
  smartOutfitFallbackUsed: {
    es: "Incluye sugerencias externas para completar el look.",
    en: "Includes external suggestions to complete the look.",
  },
  smartOutfitFromWardrobe: {
    es: "De tu armario",
    en: "From your wardrobe",
  },
  smartOutfitSuggested: {
    es: "Sugerido",
    en: "Suggested",
  },
  accessory: {
    es: "Accesorio",
    en: "Accessory",
  },
  smartOutfitNoImage: {
    es: "Sin imagen",
    en: "No image",
  },
  occasionCasual: {
    es: "Casual",
    en: "Casual",
  },
  occasionWork: {
    es: "Trabajo",
    en: "Work",
  },
  occasionDate: {
    es: "Cita",
    en: "Date",
  },
  occasionGym: {
    es: "Gym",
    en: "Gym",
  },
  occasionFormal: {
    es: "Formal",
    en: "Formal",
  },
  occasionNightOut: {
    es: "Salida",
    en: "Night out",
  },
  occasionSchool: {
    es: "Facultad / estudio",
    en: "School / university",
  },
  timeMorning: {
    es: "Mañana",
    en: "Morning",
  },
  timeAfternoon: {
    es: "Tarde",
    en: "Afternoon",
  },
  timeEvening: {
    es: "Atardecer",
    en: "Evening",
  },
  timeNight: {
    es: "Noche",
    en: "Night",
  },
  stylistQuestionnaire: {
    es: "Cuestionario del stylist",
    en: "Stylist questionnaire",
  },
  stylistQuestionnaireHint: {
    es: "Respondé esto y armamos una propuesta coherente con tu estilo, el contexto y tu historial.",
    en: "Answer this and we’ll build a look aligned with your style, context, and history.",
  },
  yourStyleDirection: {
    es: "Dirección de estilo",
    en: "Style direction",
  },
  generatedPalette: {
    es: "Paleta elegida",
    en: "Chosen palette",
  },
  generatedOutfit: {
    es: "Outfit generado",
    en: "Generated outfit",
  },
  optionalLayer: {
    es: "Capa / accesorio",
    en: "Layer / accessory",
  },
  sourceWardrobe: {
    es: "De tu armario",
    en: "From your wardrobe",
  },
  sourceInternet: {
    es: "Sugerencia externa",
    en: "External suggestion",
  },
  noOutfitAvailable: {
    es: "No encontré una combinación válida todavía.",
    en: "I couldn't find a valid combination yet.",
  },
  weatherUnavailable: {
    es: "No pudimos leer el clima, pero igual podemos estilizar el outfit.",
    en: "We couldn't read the weather, but we can still style the outfit.",
  },
  saveFirstStyles: {
    es: "Guardá tus estilos primero para activar tu stylist personalizado.",
    en: "Save your styles first to activate your personalized stylist.",
  },
  onboardingWelcomeTitle: {
    es: "Bienvenido a la app",
    en: "Welcome to the app",
  },
  onboardingWelcomeBody: {
    es: "Tu armario digital, el clima y tu estilo ahora trabajan juntos para ayudarte a vestirte mejor.",
    en: "Your digital wardrobe, the weather, and your style now work together to help you dress better.",
  },
  onboardingAiTitle: {
    es: "Creamos outfits personalizados con IA",
    en: "We create personalized outfits with AI",
  },
  onboardingAiBody: {
    es: "No queremos recomendaciones aleatorias: buscamos propuestas usables, coherentes y pensadas para vos.",
    en: "We’re not aiming for random recommendations: we want looks that are wearable, coherent, and tailored to you.",
  },
  onboardingStyleTitle: {
    es: "Primero necesitamos conocer tu estilo",
    en: "First we need to know your style",
  },
  onboardingStyleBody: {
    es: "Elegí varias estéticas que te representen. Vamos a combinarlas solo cuando sean compatibles.",
    en: "Choose the aesthetics that represent you. We’ll only combine them when they’re compatible.",
  },
  continue: {
    es: "Continuar",
    en: "Continue",
  },
  selectYourStylesTitle: {
    es: "Elegí tus estilos",
    en: "Choose your styles",
  },
  selectYourStylesBody: {
    es: "Podés elegir varios. Tu stylist va a priorizar lo que mejor combine contigo.",
    en: "You can choose several. Your stylist will prioritize what works best together for you.",
  },
  viewAll: {
    es: "Ver todo",
    en: "View all",
  },
  categoryItemsCount: {
    es: "{count} prendas en esta categoría",
    en: "{count} items in this category",
  },
  wardrobeBannerTitle: {
    es: "Mientras más ropa agregues, mejores combinaciones puede crear la IA.",
    en: "The more clothing you add, the better the AI can build combinations.",
  },
  wardrobeBannerBody: {
    es: "Mientras más ropa agregues, la IA podrá crear outfits más variados y personalizados.",
    en: "The more clothing you add, the more varied and personalized the AI outfits can become.",
  },
  wardrobeMinimumTitle: {
    es: "Todavía necesitás más prendas para activar la creación con IA.",
    en: "You still need more garments to unlock AI outfit creation.",
  },
  wardrobeMinimumHint: {
    es: "Mínimo recomendado: 5 tops, 4 bottoms y 2 pares de zapatos. Ahora tenés {tops} tops, {bottoms} bottoms y {shoes} zapatos.",
    en: "Recommended minimum: 5 tops, 4 bottoms, and 2 pairs of shoes. Right now you have {tops} tops, {bottoms} bottoms, and {shoes} shoes.",
  },
  wardrobeMinimumMet: {
    es: "Tu armario ya tiene una base suficiente para generar outfits con IA.",
    en: "Your wardrobe already has a strong enough base to generate AI outfits.",
  },
  wardrobeMinimumError: {
    es: "Agregá al menos 5 tops, 4 bottoms y 2 pares de zapatos para generar outfits con IA.",
    en: "Add at least 5 tops, 4 bottoms, and 2 pairs of shoes before generating AI outfits.",
  },
  createOutfitChooserHint: {
    es: "Elegí entre construir tu look prenda por prenda o dejar que tu stylist con IA proponga una combinación completa.",
    en: "Choose between building your look garment by garment or letting your AI stylist propose a complete combination.",
  },
  manualOutfitTag1: {
    es: "Control total",
    en: "Full control",
  },
  manualOutfitTag2: {
    es: "Tu armario real",
    en: "Your real wardrobe",
  },
  aiOutfitTag1: {
    es: "IA personalizada",
    en: "Personalized AI",
  },
  aiOutfitTag2: {
    es: "Clima + estilo",
    en: "Weather + style",
  },
  aiOutfitPremiumHint: {
    es: "Pensado para sentirse como un stylist personal, no como un generador aleatorio.",
    en: "Designed to feel like a personal stylist, not a random generator.",
  },
} satisfies Record<string, TranslationValue>;

export type TranslationKey = keyof typeof translations;

export const languageLabels: Record<Language, string> = {
  es: "Español",
  en: "English",
};
