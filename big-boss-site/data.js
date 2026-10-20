/* Données partagées : site public et espace administrateur */
const IMG = 'images/';
const ICONS = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mobile: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
  audio: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
  watch: '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6l1-4h4l1 4M9 18l1 4h4l1-4M12 10v2l1 1"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  home: '<path d="M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2-5.5A8.4 8.4 0 1 1 21 11.5z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
};
const ic = (n, s = 22) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

const DEF_CONFIG = {
  storeName: "BIG BOSS COMMUNICATION", tagline: "Vente de téléphones et accessoires",
  primaryPhone: "+225 07 09 13 81 36", secondaryPhone: "+225 07 06 19 79 19", whatsappNumber: "2250709138136",
  address: "Adresse à renseigner dans l'administration", city: "Côte d'Ivoire", region: "Côte d'Ivoire",
  openingHoursWeek: "Du Lundi au Samedi : 07h30 – 20h30", openingHoursSunday: "Dimanche : 09h00 – 18h00",
  googleMapsUrl: "https://maps.google.com/?q=Cote+d'Ivoire",
  announcementBanner: "Tecno, Infinix et itel disponibles à crédit : venez avec votre apport, repartez avec votre téléphone !",
  showAnnouncement: true,
  // Crédit (⚠ valeurs de départ à confirmer avec la boutique, modifiables dans l'administration)
  creditMarques: "Tecno, Infinix, itel", creditApport: "30", creditDurees: "2, 3, 4, 6", creditFrais: "0",
  creditPieces: "Pièce d'identité valide (CNI, passeport ou attestation) ; Numéro de téléphone actif à votre nom ; Justificatif de domicile ou facture récente ; Apport initial (espèces ou Mobile Money)"
};
const CATS = [
  { id: 'smartphones', name: 'Téléphones', icon: ic('mobile', 26), d: 'Smartphones, téléphones à touches et tablettes : Tecno, Infinix, itel, Samsung, iPhone.' },
  { id: 'chargeurs', name: 'Chargeurs & câbles', icon: ic('plug', 26), d: 'Chargeurs rapides, câbles Type-C, Lightning et micro-USB.' },
  { id: 'audio', name: 'Écouteurs & audio', icon: ic('audio', 26), d: 'Écouteurs sans fil, kits main-libre et enceintes Bluetooth.' },
  { id: 'protection', name: 'Coques & verres', icon: ic('shield', 26), d: 'Coques, étuis et verres trempés pour tous les modèles.' },
  { id: 'energie', name: 'Power banks', icon: ic('battery', 26), d: 'Batteries externes 10 000 à 30 000 mAh pour ne jamais tomber en panne.' },
  { id: 'montres', name: 'Montres connectées', icon: ic('watch', 26), d: 'Montres et bracelets connectés compatibles Android et iPhone.' },
  { id: 'accessoires', name: 'Autres accessoires', icon: ic('box', 26), d: 'Cartes mémoire, supports voiture, perches à selfie et plus.' }
];
// [id, nom, catégorie, marque, série, prix, ancien prix, promo, populaire, nouveau, stock, image, garantie, description, caractéristiques]
const P = (a) => ({ id: a[0], name: a[1], category: a[2], brand: a[3], series: a[4], price: a[5], originalPrice: a[6] || undefined, isPromo: !!a[7], isPopular: !!a[8], isNew: !!a[9], inStock: true, stockCount: a[10], image: a[11] ? IMG + a[11] : '', warranty: a[12], description: a[13], specs: a[14] || {} });
const DEF_PRODUCTS = [
  P(["infinix-note-40-pro-plus", "Infinix Note 40 Pro+ 5G (256 Go / 12 Go)", "smartphones", "Infinix", "Note", 195000, 225000, 1, 1, 1, 12, "infinix_gt_smartphone.jpg", "12 mois de garantie Carlcare", "Le fleuron d'Infinix : charge 100 W + MagCharge sans fil 20 W, écran AMOLED incurvé 120 Hz et caméra 108 MP OIS. 100 % original, garanti Carlcare.", { "Stockage": "256 Go", "RAM": "12 Go (+12 Go étendus)", "Charge": "100 W filaire + 20 W sans fil", "Écran": "6,78'' AMOLED incurvé 120 Hz", "Appareil photo": "108 MP OIS", "Son": "Double haut-parleurs JBL" }]),
  P(["tecno-camon-50-pro", "Tecno Camon 50 Pro (256 Go)", "smartphones", "Tecno", "Camon", 185000, 215000, 1, 1, 1, 8, "", "13 mois de garantie Carlcare", "Capteur photo haute définition, 256 Go de stockage et grand écran AMOLED. Original avec gravure officielle Tecno, scellé d'usine.", { "Stockage": "256 Go", "Appareil photo": "50 MP triple capteur", "Batterie": "5 000 mAh, charge rapide 45 W", "Écran": "6,78'' AMOLED 120 Hz" }]),
  P(["tecno-spark-50", "Tecno Spark 50", "smartphones", "Tecno", "Spark", 95000, 105000, 1, 1, 0, 15, "", "13 mois de garantie Carlcare", "Smartphone fiable au meilleur prix, original avec microtexture officielle au dos.", { "Réseau": "4G double SIM" }]),
  P(["infinix-hot-40-pro", "Infinix Hot 40 Pro (256 Go)", "smartphones", "Infinix", "Hot", 135000, 145000, 0, 1, 0, 9, "", "12 mois de garantie Carlcare", "Infinix Hot 40 Pro : 256 Go de stockage, grand écran 120 Hz et charge rapide.", { "Stockage": "256 Go" }]),
  P(["iphone-15-pro-max", "Apple iPhone 15 Pro Max 256 Go", "smartphones", "Apple", "iPhone 15", 840000, 910000, 1, 1, 0, 4, "product_tecnocamon_pro.jpg", "12 mois de garantie Apple", "Finition titane, puce A17 Pro, zoom optique 5x. Appareil scellé d'origine, vérifié devant vous.", { "Stockage": "256 Go", "Châssis": "Titane", "Puce": "A17 Pro", "Écran": "6,7'' Super Retina XDR ProMotion" }]),
  P(["iphone-xr-64gb", "Apple iPhone XR 64 Go (reconditionné A+)", "smartphones", "Apple", "iPhone XR", 135000, 150000, 1, 0, 0, 12, "", "3 mois de garantie en boutique", "iPhone XR reconditionné grade A+, testé et garanti en boutique.", { "Stockage": "64 Go", "État": "Reconditionné grade A+" }]),
  P(["samsung-galaxy-a55", "Samsung Galaxy A55 5G (256 Go)", "smartphones", "Samsung", "Galaxy A", 245000, 275000, 1, 1, 0, 10, "", "12 mois de garantie officielle Samsung", "Écran Super AMOLED fluide, châssis métal et mises à jour de longue durée.", { "Stockage": "256 Go", "RAM": "8 Go", "Réseau": "5G" }]),
  // Accessoires
  P(["oraimo-chargeur-18w-type-c", "Chargeur rapide Oraimo 18 W + câble Type-C", "chargeurs", "Oraimo", "Chargeurs", 6000, 0, 0, 1, 0, 40, "", "6 mois de garantie Oraimo", "Charge rapide et sûre pour Tecno, Infinix, itel, Samsung et tous les téléphones Type-C.", { "Puissance": "18 W", "Câble": "Type-C, 1 m" }]),
  P(["samsung-chargeur-25w", "Chargeur Samsung 25 W USB-C original", "chargeurs", "Samsung", "Chargeurs", 12000, 15000, 1, 1, 0, 20, "", "6 mois de garantie", "Chargeur Super Fast Charging 25 W d'origine Samsung.", { "Puissance": "25 W", "Prise": "USB-C" }]),
  P(["apple-chargeur-20w", "Chargeur Apple 20 W USB-C", "chargeurs", "Apple", "Chargeurs", 15000, 0, 0, 1, 0, 15, "", "6 mois de garantie", "Adaptateur secteur USB-C 20 W pour la charge rapide de l'iPhone.", { "Puissance": "20 W" }]),
  P(["cable-usb-c-lightning", "Câble USB-C vers Lightning 1 m", "chargeurs", "Apple", "Câbles", 5000, 0, 0, 0, 0, 25, "", "3 mois de garantie", "Câble de charge et de données pour iPhone.", { "Longueur": "1 m" }]),
  P(["oraimo-cable-type-c-renforce", "Câble Type-C renforcé Oraimo 1 m", "chargeurs", "Oraimo", "Câbles", 2500, 0, 0, 1, 0, 60, "", "6 mois de garantie Oraimo", "Câble tressé résistant, charge rapide jusqu'à 3 A.", { "Longueur": "1 m", "Intensité": "3 A" }]),
  P(["oraimo-freepods", "Écouteurs sans fil Oraimo FreePods", "audio", "Oraimo", "Écouteurs", 15000, 18000, 1, 1, 1, 18, "", "6 mois de garantie Oraimo", "Écouteurs Bluetooth avec boîtier de charge, son puissant et longue autonomie.", { "Connexion": "Bluetooth 5.3", "Autonomie": "Jusqu'à 30 h avec le boîtier" }]),
  P(["oraimo-freepods-lite", "Écouteurs sans fil Oraimo FreePods Lite", "audio", "Oraimo", "Écouteurs", 12000, 0, 0, 1, 0, 20, "", "6 mois de garantie Oraimo", "Écouteurs Bluetooth légers avec boîtier de charge, parfaits au quotidien.", { "Connexion": "Bluetooth" }]),
  P(["oraimo-ecouteurs-boitier-rond", "Écouteurs sans fil Oraimo (boîtier rond lumineux)", "audio", "Oraimo", "Écouteurs", 22000, 25000, 1, 1, 1, 10, "", "6 mois de garantie Oraimo", "Écouteurs intra-auriculaires avec réduction de bruit et boîtier rond à anneau lumineux.", { "Connexion": "Bluetooth" }]),
  P(["ecouteurs-sans-fil-pods-blancs", "Écouteurs sans fil Pods blancs (iPhone et Android)", "audio", "Universel", "Écouteurs", 10000, 0, 0, 1, 0, 25, "", "3 mois de garantie", "Écouteurs Bluetooth blancs avec boîtier de charge, compatibles iPhone et Android.", { "Compatibilité": "iPhone et Android" }]),
  P(["oraimo-ecouteurs-tour-de-cou", "Écouteurs tour de cou Oraimo", "audio", "Oraimo", "Écouteurs", 8000, 0, 0, 0, 0, 20, "", "6 mois de garantie Oraimo", "Écouteurs Bluetooth sportifs avec tour de cou, embouts magnétiques et longue autonomie.", { "Connexion": "Bluetooth" }]),
  P(["oraimo-casque-bluetooth", "Casque Bluetooth Oraimo à réduction de bruit", "audio", "Oraimo", "Casques", 30000, 0, 0, 1, 1, 8, "", "6 mois de garantie Oraimo", "Casque circum-auriculaire pliable, son puissant, réduction de bruit et grande autonomie.", { "Connexion": "Bluetooth", "Format": "Circum-auriculaire pliable" }]),
  P(["ecouteurs-filaires-type-c", "Écouteurs filaires Type-C avec micro", "audio", "Oraimo", "Écouteurs", 3000, 0, 0, 1, 0, 50, "", "3 mois de garantie", "Kit main-libre Type-C avec micro et bouton de réponse.", {}]),
  P(["oraimo-enceinte-bluetooth", "Enceinte Bluetooth Oraimo portable", "audio", "Oraimo", "Enceintes", 18000, 0, 0, 0, 0, 10, "", "6 mois de garantie Oraimo", "Enceinte compacte et puissante, résistante aux éclaboussures.", { "Connexion": "Bluetooth" }]),
  P(["verre-trempe", "Verre trempé (tous modèles)", "protection", "Universel", "Verres trempés", 2000, 0, 0, 1, 0, 200, "", "Pose offerte en boutique", "Protection d'écran 9H. Précisez votre modèle : nous le posons gratuitement en boutique.", { "Dureté": "9H" }]),
  P(["coque-silicone", "Coque silicone (tous modèles)", "protection", "Universel", "Coques", 3000, 0, 0, 1, 0, 150, "", "—", "Coque souple antichoc, plusieurs couleurs. Précisez votre modèle à la commande.", {}]),
  P(["oraimo-powerbank-20000", "Power bank Oraimo 20 000 mAh", "energie", "Oraimo", "Power banks", 15000, 17000, 1, 1, 0, 25, "", "6 mois de garantie Oraimo", "Batterie externe haute capacité avec charge rapide et deux sorties USB.", { "Capacité": "20 000 mAh" }]),
  P(["oraimo-powerbank-10000", "Power bank Oraimo 10 000 mAh avec câbles intégrés", "energie", "Oraimo", "Power banks", 10000, 0, 0, 1, 0, 30, "", "12 mois de garantie Oraimo", "Batterie externe fine avec câbles Type-C, Lightning et micro-USB intégrés : plus besoin d'emporter de câble.", { "Capacité": "10 000 mAh", "Câbles": "Type-C, Lightning, micro-USB intégrés" }]),
  P(["oraimo-watch", "Montre connectée Oraimo Watch", "montres", "Oraimo", "Montres", 20000, 0, 0, 1, 1, 12, "", "6 mois de garantie Oraimo", "Notifications, appels Bluetooth, suivi du sommeil et des pas. Compatible Android et iPhone.", { "Compatibilité": "Android et iOS" }]),
  P(["carte-memoire-64go", "Carte mémoire microSD 64 Go", "accessoires", "Universel", "Stockage", 6000, 0, 0, 0, 0, 40, "", "3 mois de garantie", "Pour stocker plus de photos, vidéos et musique.", { "Capacité": "64 Go" }]),
  P(["support-voiture-magnetique", "Support voiture magnétique (anneau MagSafe)", "accessoires", "Universel", "Voiture", 8000, 0, 0, 1, 0, 20, "", "—", "Support aimanté à anneau, orientable, pour tableau de bord. Compatible MagSafe.", {}]),
  P(["support-voiture-ventouse", "Support voiture à ventouse Oraimo", "accessoires", "Oraimo", "Voiture", 7000, 0, 0, 0, 0, 15, "", "6 mois de garantie Oraimo", "Support à pince réglable avec bras télescopique et ventouse solide pour pare-brise ou tableau de bord.", {}]),
  P(["oraimo-defroisseur-vapeur", "Défroisseur vapeur portable Oraimo", "accessoires", "Oraimo", "Maison", 25000, 0, 0, 0, 1, 6, "", "6 mois de garantie Oraimo", "Défroisseur à vapeur compact avec écran, pour des vêtements nets en quelques minutes, à la maison ou en voyage.", {}])
];
// ⚠ Exemples à remplacer par de vrais avis de clients de la boutique.
const REVIEWS = [
  ["Kouassi J.-M.", "J'ai pris mon Tecno Camon à crédit. Apport versé, dossier vite réglé et je suis reparti le jour même avec le téléphone.", "Tecno Camon"],
  ["Awa T.", "Commande d'écouteurs et d'une coque sur WhatsApp, livrés le jour même. Ils ont même posé le verre trempé gratuitement.", "Accessoires"],
  ["Ibrahim K.", "Le patron m'a montré comment reconnaître un vrai Infinix. Téléphone scellé, garanti Carlcare. Je recommande.", "Infinix Hot"],
  ["Yasmine B.", "Bons prix et accueil chaleureux. J'ai pu payer mon itel en plusieurs fois par Wave.", "itel"]
];
const TABS = [['accueil', 'Accueil'], ['boutique', 'Téléphones'], ['accessoires', 'Accessoires'], ['credit', 'Achat à crédit'], ['promotions', 'Promos'], ['contact', 'Contact']];
const CFIELDS = [['storeName', 'Nom de la boutique'], ['tagline', 'Slogan'], ['primaryPhone', 'Téléphone principal'], ['secondaryPhone', 'Téléphone secondaire'], ['whatsappNumber', 'WhatsApp (chiffres, ex : 2250709138136)'], ['address', 'Adresse'], ['city', 'Ville'], ['region', 'Région'], ['openingHoursWeek', 'Horaires semaine'], ['openingHoursSunday', 'Horaires dimanche'], ['googleMapsUrl', 'Lien Google Maps'], ['announcementBanner', 'Message d\'annonce (bandeau du haut)'],
  ['creditMarques', 'Crédit : marques éligibles (séparées par des virgules)'], ['creditApport', 'Crédit : apport minimum (% du prix)'], ['creditDurees', 'Crédit : durées proposées en mois (séparées par des virgules)'], ['creditFrais', 'Crédit : frais en % du prix (0 si aucun)'], ['creditPieces', 'Crédit : pièces à fournir (séparées par des points-virgules)']];
