// Translation system for the video streaming platform
export interface Translations {
  // Navigation and Header
  home: string;
  trending: string;
  subscriptions: string;
  library: string;
  history: string;
  liked: string;
  playlists: string;
  downloads: string;
  settings: string;
  search: string;
  upload: string;
  notifications: string;
  profile: string;
  signIn: string;
  signOut: string;
  signUp: string;
  watchLater: string;
  
  // Video Player
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  fullscreen: string;
  exitFullscreen: string;
  volume: string;
  quality: string;
  speed: string;
  captions: string;
  
  // Video Details
  views: string;
  likes: string;
  dislikes: string;
  share: string;
  save: string;
  subscribe: string;
  subscribed: string;
  description: string;
  showMore: string;
  showLess: string;
  comments: string;
  addComment: string;
  
  // Upload & Creator
  uploadVideo: string;
  title: string;
  thumbnail: string;
  visibility: string;
  public: string;
  private: string;
  unlisted: string;
  category: string;
  tags: string;
  language: string;
  dashboard: string;
  analytics: string;
  earnings: string;
  createChannel: string;
  help: string;
  
  // Settings
  appearance: string;
  privacy: string;
  account: string;
  theme: string;
  autoplay: string;
  
  // Channel
  channel: string;
  channels: string;
  videos: string;
  about: string;
  editChannel: string;
  channelName: string;
  channelDescription: string;
  
  // Common
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  update: string;
  loading: string;
  error: string;
  success: string;
  confirm: string;
  close: string;
  back: string;
  next: string;
  previous: string;
  
  // Time
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  weeks: string;
  months: string;
  years: string;
  ago: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // Navigation and Header
    home: 'Home',
    trending: 'Trending',
    subscriptions: 'Subscriptions',
    library: 'Library',
    history: 'History',
    liked: 'Liked Videos',
    playlists: 'Playlists',
    downloads: 'Downloads',
    settings: 'Settings',
    search: 'Search',
    upload: 'Upload',
    notifications: 'Notifications',
    profile: 'Profile',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    watchLater: 'Watch Later',
    
    // Video Player
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    volume: 'Volume',
    quality: 'Quality',
    speed: 'Speed',
    captions: 'Captions',
    
    // Video Details
    views: 'views',
    likes: 'likes',
    dislikes: 'dislikes',
    share: 'Share',
    save: 'Save',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed',
    description: 'Description',
    showMore: 'Show more',
    showLess: 'Show less',
    comments: 'Comments',
    addComment: 'Add a comment',
    
    // Upload & Creator
    uploadVideo: 'Upload Video',
    title: 'Title',
    thumbnail: 'Thumbnail',
    visibility: 'Visibility',
    public: 'Public',
    private: 'Private',
    unlisted: 'Unlisted',
    category: 'Category',
    tags: 'Tags',
    language: 'Language',
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    earnings: 'Earnings',
    createChannel: 'Create Channel',
    help: 'Help Center',
    
    // Settings
    appearance: 'Appearance',
    privacy: 'Privacy',
    account: 'Account',
    theme: 'Theme',
    autoplay: 'Autoplay',
    
    // Channel
    channel: 'Channel',
    channels: 'Channels',
    videos: 'Videos',
    about: 'About',
    editChannel: 'Edit Channel',
    channelName: 'Channel Name',
    channelDescription: 'Channel Description',
    
    // Common
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Time
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
    ago: 'ago',
  },
  
  hi: {
    // Navigation and Header
    home: 'होम',
    trending: 'ट्रेंडिंग',
    subscriptions: 'सब्सक्रिप्शन',
    library: 'लाइब्रेरी',
    history: 'इतिहास',
    liked: 'पसंदीदा वीडियो',
    playlists: 'प्लेलिस्ट',
    downloads: 'डाउनलोड',
    settings: 'सेटिंग्स',
    search: 'खोजें',
    upload: 'अपलोड',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    signUp: 'साइन अप',
    watchLater: 'बाद में देखें',
    
    // Video Player
    play: 'चलाएं',
    pause: 'रोकें',
    mute: 'म्यूट',
    unmute: 'अनम्यूट',
    fullscreen: 'फुलस्क्रीन',
    exitFullscreen: 'फुलस्क्रीन से बाहर निकलें',
    volume: 'वॉल्यूम',
    quality: 'गुणवत्ता',
    speed: 'गति',
    captions: 'कैप्शन',
    
    // Video Details
    views: 'व्यूज़',
    likes: 'लाइक्स',
    dislikes: 'डिसलाइक्स',
    share: 'शेयर',
    save: 'सेव',
    subscribe: 'सब्सक्राइब',
    subscribed: 'सब्सक्राइब किया गया',
    description: 'विवरण',
    showMore: 'और दिखाएं',
    showLess: 'कम दिखाएं',
    comments: 'टिप्पणियां',
    addComment: 'टिप्पणी जोड़ें',
    
    // Upload & Creator
    uploadVideo: 'वीडियो अपलोड करें',
    title: 'शीर्षक',
    thumbnail: 'थंबनेल',
    visibility: 'दृश्यता',
    public: 'सार्वजनिक',
    private: 'निजी',
    unlisted: 'अनलिस्टेड',
    category: 'श्रेणी',
    tags: 'टैग्स',
    language: 'भाषा',
    dashboard: 'डैशबोर्ड',
    analytics: 'एनालिटिक्स',
    earnings: 'कमाई',
    createChannel: 'चैनल बनाएं',
    help: 'सहायता केंद्र',
    
    // Settings
    appearance: 'दिखावट',
    privacy: 'गोपनीयता',
    account: 'खाता',
    theme: 'थीम',
    autoplay: 'ऑटोप्ले',
    
    // Channel
    channel: 'चैनल',
    channels: 'चैनल्स',
    videos: 'वीडियो',
    about: 'के बारे में',
    editChannel: 'चैनल संपादित करें',
    channelName: 'चैनल का नाम',
    channelDescription: 'चैनल विवरण',
    
    // Common
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    create: 'बनाएं',
    update: 'अपडेट करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    confirm: 'पुष्टि करें',
    close: 'बंद करें',
    back: 'वापस',
    next: 'अगला',
    previous: 'पिछला',
    
    // Time
    seconds: 'सेकंड',
    minutes: 'मिनट',
    hours: 'घंटे',
    days: 'दिन',
    weeks: 'सप्ताह',
    months: 'महीने',
    years: 'साल',
    ago: 'पहले',
  },
  
  es: {
    // Navigation and Header
    home: 'Inicio',
    trending: 'Tendencias',
    subscriptions: 'Suscripciones',
    library: 'Biblioteca',
    history: 'Historial',
    liked: 'Videos que me gustan',
    playlists: 'Listas de reproducción',
    downloads: 'Descargas',
    settings: 'Configuración',
    search: 'Buscar',
    upload: 'Subir',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    signIn: 'Iniciar sesión',
    signOut: 'Cerrar sesión',
    signUp: 'Registrarse',
    watchLater: 'Ver más tarde',
    
    // Video Player
    play: 'Reproducir',
    pause: 'Pausar',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    volume: 'Volumen',
    quality: 'Calidad',
    speed: 'Velocidad',
    captions: 'Subtítulos',
    
    // Video Details
    views: 'visualizaciones',
    likes: 'me gusta',
    dislikes: 'no me gusta',
    share: 'Compartir',
    save: 'Guardar',
    subscribe: 'Suscribirse',
    subscribed: 'Suscrito',
    description: 'Descripción',
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
    comments: 'Comentarios',
    addComment: 'Agregar comentario',
    
    // Upload & Creator
    uploadVideo: 'Subir Video',
    title: 'Título',
    thumbnail: 'Miniatura',
    visibility: 'Visibilidad',
    public: 'Público',
    private: 'Privado',
    unlisted: 'No listado',
    category: 'Categoría',
    tags: 'Etiquetas',
    language: 'Idioma',
    dashboard: 'Panel de control',
    analytics: 'Analíticas',
    earnings: 'Ganancias',
    createChannel: 'Crear Canal',
    help: 'Centro de Ayuda',
    
    // Settings
    appearance: 'Apariencia',
    privacy: 'Privacidad',
    account: 'Cuenta',
    theme: 'Tema',
    autoplay: 'Reproducción automática',
    
    // Channel
    channel: 'Canal',
    channels: 'Canales',
    videos: 'Videos',
    about: 'Acerca de',
    editChannel: 'Editar Canal',
    channelName: 'Nombre del Canal',
    channelDescription: 'Descripción del Canal',
    
    // Common
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    update: 'Actualizar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    confirm: 'Confirmar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    
    // Time
    seconds: 'segundos',
    minutes: 'minutos',
    hours: 'horas',
    days: 'días',
    weeks: 'semanas',
    months: 'meses',
    years: 'años',
    ago: 'hace',
  },
  
  fr: {
    // Navigation and Header
    home: 'Accueil',
    trending: 'Tendances',
    subscriptions: 'Abonnements',
    library: 'Bibliothèque',
    history: 'Historique',
    liked: 'Vidéos aimées',
    playlists: 'Listes de lecture',
    downloads: 'Téléchargements',
    settings: 'Paramètres',
    search: 'Rechercher',
    upload: 'Téléverser',
    notifications: 'Notifications',
    profile: 'Profil',
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
    signUp: 'S\'inscrire',
    watchLater: 'Regarder plus tard',
    
    // Video Player
    play: 'Lire',
    pause: 'Pause',
    mute: 'Couper le son',
    unmute: 'Rétablir le son',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    volume: 'Volume',
    quality: 'Qualité',
    speed: 'Vitesse',
    captions: 'Sous-titres',
    
    // Video Details
    views: 'vues',
    likes: 'j\'aime',
    dislikes: 'je n\'aime pas',
    share: 'Partager',
    save: 'Enregistrer',
    subscribe: 'S\'abonner',
    subscribed: 'Abonné',
    description: 'Description',
    showMore: 'Afficher plus',
    showLess: 'Afficher moins',
    comments: 'Commentaires',
    addComment: 'Ajouter un commentaire',
    
    // Upload & Creator
    uploadVideo: 'Téléverser une vidéo',
    title: 'Titre',
    thumbnail: 'Miniature',
    visibility: 'Visibilité',
    public: 'Public',
    private: 'Privé',
    unlisted: 'Non répertorié',
    category: 'Catégorie',
    tags: 'Étiquettes',
    language: 'Langue',
    dashboard: 'Tableau de bord',
    analytics: 'Analyses',
    earnings: 'Revenus',
    createChannel: 'Créer une chaîne',
    help: 'Centre d\'aide',
    
    // Settings
    appearance: 'Apparence',
    privacy: 'Confidentialité',
    account: 'Compte',
    theme: 'Thème',
    autoplay: 'Lecture automatique',
    
    // Channel
    channel: 'Chaîne',
    channels: 'Chaînes',
    videos: 'Vidéos',
    about: 'À propos',
    editChannel: 'Modifier la chaîne',
    channelName: 'Nom de la chaîne',
    channelDescription: 'Description de la chaîne',
    
    // Common
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    update: 'Mettre à jour',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    confirm: 'Confirmer',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    
    // Time
    seconds: 'secondes',
    minutes: 'minutes',
    hours: 'heures',
    days: 'jours',
    weeks: 'semaines',
    months: 'mois',
    years: 'années',
    ago: 'il y a',
  }
};