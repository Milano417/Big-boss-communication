/* CATALOGUE DE DÉPART : téléphones par marque.
   ⚠ Les PRIX ci-dessous sont des estimations de départ : à corriger dans l'espace administrateur.
   Photos : déposez images/produits/<id>.jpg (l'id = nom en minuscules avec des tirets, visible dans l'administration).
   Tant qu'une photo manque, une vignette aux couleurs de la marque s'affiche. */
const BRANDS = [
  { id: 'tecno', label: 'Tecno', match: 'Tecno', color: '#1459c9' },
  { id: 'infinix', label: 'Infinix', match: 'Infinix', color: '#0b5d3b' },
  { id: 'itel', label: 'itel', match: 'itel', color: '#d0121b' },
  { id: 'samsung', label: 'Samsung', match: 'Samsung', color: '#14357a' },
  { id: 'iphone', label: 'iPhone', match: 'Apple', color: '#2b2b30' },
  { id: 'oraimo', label: 'Oraimo', match: 'Oraimo', color: '#3f8f12' }
];
// [marque, série, nom, catégorie, prix FCFA, stock, drapeaux : o=promo p=populaire n=nouveau]
const RAW = [
  ['tecno', 'Pop', 'Tecno Pop 8', 'smartphones', 55000, 22, 'p'],
  ['tecno', 'Spark', 'Tecno Spark Go 1', 'smartphones', 60000, 20, 'o'],
  ['tecno', 'Spark', 'Tecno Spark 30', 'smartphones', 105000, 12, 'n'],
  ['tecno', 'Spark', 'Tecno Spark 40', 'smartphones', 120000, 15, 'pn'],
  ['tecno', 'Camon', 'Tecno Camon 30', 'smartphones', 150000, 9, 'po'],
  ['tecno', 'Camon', 'Tecno Camon 40 Pro', 'smartphones', 220000, 6, 'n'],
  ['tecno', 'Pova', 'Tecno Pova 6 Pro', 'smartphones', 175000, 7, ''],
  ['tecno', 'Phantom', 'Tecno Phantom X2', 'smartphones', 330000, 3, ''],
  ['infinix', 'Smart', 'Infinix Smart 8', 'smartphones', 65000, 20, 'p'],
  ['infinix', 'Smart', 'Infinix Smart 9', 'smartphones', 75000, 18, 'n'],
  ['infinix', 'Hot', 'Infinix Hot 30', 'smartphones', 90000, 14, 'po'],
  ['infinix', 'Hot', 'Infinix Hot 50i', 'smartphones', 95000, 16, 'n'],
  ['infinix', 'Note', 'Infinix Note 30', 'smartphones', 115000, 10, 'o'],
  ['infinix', 'Note', 'Infinix Note 40', 'smartphones', 140000, 11, 'p'],
  ['infinix', 'GT', 'Infinix GT 20 Pro', 'smartphones', 260000, 5, 'n'],
  ['infinix', 'Zero', 'Infinix Zero Flip', 'smartphones', 480000, 3, 'n'],
  ['itel', 'Touches', 'itel it2163', 'smartphones', 8000, 30, 'p'],
  ['itel', 'Touches', 'itel téléphone à touches double SIM', 'smartphones', 10000, 25, ''],
  ['itel', 'A', 'itel A04', 'smartphones', 40000, 15, 'o'],
  ['itel', 'A', 'itel A50', 'smartphones', 45000, 20, 'p'],
  ['itel', 'A', 'itel A70', 'smartphones', 55000, 18, 'po'],
  ['itel', 'A', 'itel A80', 'smartphones', 65000, 15, 'n'],
  ['itel', 'P', 'itel P55', 'smartphones', 75000, 12, 'p'],
  ['itel', 'P', 'itel P65', 'smartphones', 85000, 10, 'n'],
  ['itel', 'S', 'itel S24', 'smartphones', 95000, 9, 'o'],
  ['itel', 'S', 'itel S25', 'smartphones', 110000, 8, 'n'],
  ['iphone', 'iPhone 11', 'Apple iPhone 11', 'smartphones', 150000, 8, 'o'],
  ['iphone', 'iPhone 12', 'Apple iPhone 12', 'smartphones', 190000, 7, 'p'],
  ['iphone', 'iPhone 13', 'Apple iPhone 13', 'smartphones', 260000, 6, 'p'],
  ['iphone', 'iPhone 14', 'Apple iPhone 14 Pro', 'smartphones', 480000, 4, ''],
  ['iphone', 'iPhone 15', 'Apple iPhone 15', 'smartphones', 450000, 4, 'p'],
  ['iphone', 'iPhone 16', 'Apple iPhone 16', 'smartphones', 620000, 3, 'n'],
  ['iphone', 'iPhone 17', 'Apple iPhone 17 Pro', 'smartphones', 950000, 3, 'n'],
  ['iphone', 'iPhone Air', 'Apple iPhone Air', 'smartphones', 800000, 2, 'n'],
  ['samsung', 'Galaxy A', 'Samsung Galaxy A05', 'smartphones', 70000, 18, 'o'],
  ['samsung', 'Galaxy A', 'Samsung Galaxy A15', 'smartphones', 105000, 14, 'p'],
  ['samsung', 'Galaxy A', 'Samsung Galaxy A25 5G', 'smartphones', 150000, 10, ''],
  ['samsung', 'Galaxy A', 'Samsung Galaxy A35 5G', 'smartphones', 200000, 8, 'p'],
  ['samsung', 'Galaxy S', 'Samsung Galaxy S23', 'smartphones', 420000, 4, 'o'],
  ['samsung', 'Galaxy S', 'Samsung Galaxy S24', 'smartphones', 520000, 3, ''],
  ['samsung', 'Galaxy S', 'Samsung Galaxy S25 Ultra', 'smartphones', 900000, 2, 'n'],
  ['samsung', 'Galaxy Z', 'Samsung Galaxy Z Flip 5', 'smartphones', 450000, 2, ''],
  ['samsung', 'Galaxy Tab', 'Samsung Galaxy Tab A9', 'smartphones', 120000, 6, '']
];
const WAR = { infinix: '12 mois de garantie Carlcare', tecno: '13 mois de garantie Carlcare', itel: '12 mois de garantie Carlcare', iphone: '3 mois de garantie en boutique', samsung: '12 mois de garantie officielle Samsung', oraimo: '6 mois de garantie Oraimo' };
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const DESC = {
  'tecno-spark-40': 'Le Tecno Spark 40 : design fin de 7,67 mm, grand écran 6,67 pouces 120 Hz et batterie 5 200 mAh avec charge rapide 45 W. Original, garanti Carlcare.',
  'samsung-galaxy-s25-ultra': 'Le haut de gamme Samsung : écran 6,9 pouces Dynamic AMOLED 2X 120 Hz, capteur principal 200 MP, S Pen intégré et puissance Snapdragon 8 Elite for Galaxy. Original, garantie officielle Samsung.',
  'infinix-zero-flip': "Le smartphone pliable à clapet d'Infinix : grand écran AMOLED 120 Hz et mini-écran externe pour les notifications et les selfies.",
  'itel-it2163': "Le téléphone à touches qui ne lâche pas : double SIM, radio FM, torche et une batterie qui tient plusieurs jours."
};
const SPECS = {
  'tecno-spark-40': { 'Écran': "6,67'' 120 Hz", 'Épaisseur': '7,67 mm', 'Batterie': '5 200 mAh, charge 45 W', 'Appareil photo': '50 MP' },
  'samsung-galaxy-s25-ultra': { 'Écran': "6,9'' Dynamic AMOLED 2X 120 Hz", 'Processeur': 'Snapdragon 8 Elite for Galaxy', 'Appareil photo': 'Principal 200 MP', 'Stylet': 'S Pen intégré', 'Batterie': '5 000 mAh' },
  'infinix-zero-flip': { 'Format': 'Pliable à clapet', 'Écrans': 'AMOLED 120 Hz + écran externe' },
  'itel-it2163': { 'Type': 'Téléphone à touches', 'SIM': 'Double SIM', 'Extras': 'Radio FM, torche' }
};
const EXTRA_PRODUCTS = RAW.map((r) => {
  const b = BRANDS.find((x) => x.id === r[0]), id = slug(r[2]);
  return { id, name: r[2], category: r[3], brand: b.match, series: r[1], price: r[4], originalPrice: r[6].includes('o') ? Math.round(r[4] * 1.1 / 1000) * 1000 : undefined,
    isPromo: r[6].includes('o'), isPopular: r[6].includes('p'), isNew: r[6].includes('n'), inStock: true, stockCount: r[5], image: 'images/produits/' + id + '.jpg',
    warranty: WAR[r[0]], description: DESC[id] || (r[2] + ' : produit original ' + b.label + ' (série ' + r[1] + '), vérifié devant vous avant paiement.'), specs: SPECS[id] || {} };
});
