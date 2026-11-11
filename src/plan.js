// Il piano di Sofia senza spuntini: dati, fabbisogno e piano del giorno dalle risposte del quiz.
// Valori per 100 g a crudo (medie da tabella): kcal, proteine, carboidrati, grassi.

export const FOODS = {
  'Petto di pollo': [110, 23, 0, 1.5],
  'Petto di tacchino': [107, 24, 0, 1],
  'Prosciutto cotto': [130, 20, 1, 5],
  'Merluzzo': [82, 18, 0, 0.7],
  'Manzo macinato magro': [130, 21, 0, 5],
  'Bistecca magra di manzo': [140, 22, 0, 5.5],
  'Salmone': [200, 20, 0, 13],
  'Tonno al naturale': [103, 23.5, 0, 1],
  'Uova': [143, 12.6, 0.7, 9.5],
  'Yogurt greco 2%': [75, 9.5, 4, 2],
  'Yogurt bianco': [61, 3.5, 4.7, 3.3],
  'Latte parz. scremato': [46, 3.4, 5, 1.6],
  'Fiocchi di latte': [100, 12, 3, 4.5],
  'Ricotta': [146, 11, 3, 10.5],
  'Feta': [264, 14, 4, 21],
  'Mozzarella': [250, 18, 2, 19.5],
  'Formaggio a fette': [300, 20, 5, 22],
  'Parmigiano': [390, 33, 0, 28],
  'Riso': [350, 7, 79, 0.6],
  'Pasta': [355, 12.5, 72, 1.5],
  'Rigatoni integrali': [340, 13, 65, 2.5],
  'Pane integrale': [250, 9, 45, 3],
  'Panino da hamburger': [270, 9, 50, 4],
  'Pane per toast': [270, 8.5, 50, 4],
  'Piadina': [300, 8, 50, 7],
  'Corn flakes': [375, 7, 84, 1],
  "Fiocchi d'avena": [372, 13, 60, 7],
  'Gallette di riso': [380, 8, 80, 3],
  'Patate': [77, 2, 17, 0.1],
  'Patate dolci': [86, 1.6, 20, 0.1],
  'Mais in scatola': [80, 2.5, 15, 1.2],
  'Banana': [89, 1.1, 23, 0.3],
  'Mela': [52, 0.3, 14, 0.2],
  'Avocado': [160, 2, 8.5, 15],
  'Pomodori': [18, 0.9, 3.9, 0.2],
  'Pomodorini': [18, 0.9, 3.9, 0.2],
  'Zucchine': [17, 1.2, 3, 0.3],
  'Cetrioli': [15, 0.7, 3.6, 0.1],
  'Asparagi': [20, 2.2, 3.9, 0.1],
  'Fagiolini': [31, 1.8, 7, 0.1],
  'Peperoni': [26, 1, 5, 0.3],
  'Piselli': [80, 5.4, 14, 0.4],
  'Lattuga': [15, 1.4, 2.9, 0.2],
  'Mandorle': [600, 21, 10, 50],
  'Passata di pomodoro': [30, 1.4, 5, 0.2],
  'Burro di arachidi': [600, 25, 15, 50],
  'Crema di nocciole': [540, 6, 57, 31],
  'Marmellata': [220, 0.5, 55, 0],
  'Miele': [304, 0.3, 82, 0],
  'Olio extravergine': [900, 0, 0, 100],
  'Bresaola': [151, 32, 0.4, 2],
  'Salmone affumicato': [117, 18, 0, 4.5],
  'Gamberi': [85, 18, 0, 1],
  'Ceci in scatola': [120, 7, 17, 2.5],
  'Lenticchie lessate': [116, 9, 20, 0.4],
  'Formaggio spalmabile light': [150, 8, 4, 11],
  'Couscous': [360, 12.8, 72, 1.1],
  'Gnocchi di patate': [150, 4, 33, 0.3],
  'Granola': [450, 10, 64, 16],
  'Cacao amaro': [230, 20, 58, 14],
  'Fragole': [32, 0.7, 7.7, 0.3],
  'Kiwi': [61, 1.1, 15, 0.5],
  'Arancia': [47, 0.9, 12, 0.1],
  'Spinaci': [23, 2.9, 3.6, 0.4],
  'Funghi': [22, 3.1, 3.3, 0.3],
  'Rucola': [25, 2.6, 3.7, 0.7],
  'Cipolla': [40, 1.1, 9, 0.1],
  'Pesto': [450, 5, 6, 45],
  'Salsa di soia': [53, 8, 5, 0],
  'Pizza margherita': [800, 32, 110, 26], // una pizza intera = 100
}

// Carboidrati che si possono allargare o stringere per arrivare al fabbisogno.
// Il riso resta fisso a 80 g; pollo, tacchino e macinato fissi a 250 g.
export const SCALABLE = new Set(['Pasta', 'Rigatoni integrali', 'Pane integrale', 'Panino da hamburger', 'Pane per toast', 'Piadina',
  'Corn flakes', "Fiocchi d'avena", 'Gallette di riso', 'Patate', 'Patate dolci', 'Couscous', 'Gnocchi di patate'])

const AISLE = {
  Carne: ['Petto di pollo', 'Petto di tacchino', 'Manzo macinato magro', 'Bistecca magra di manzo', 'Prosciutto cotto', 'Bresaola'],
  Pesce: ['Salmone', 'Salmone affumicato', 'Tonno al naturale', 'Merluzzo', 'Gamberi'],
  'Frigo e latticini': ['Uova', 'Yogurt greco 2%', 'Yogurt bianco', 'Latte parz. scremato', 'Fiocchi di latte', 'Ricotta', 'Feta', 'Mozzarella', 'Formaggio a fette', 'Formaggio spalmabile light', 'Parmigiano', 'Pesto', 'Gnocchi di patate'],
  'Pane, pasta e cereali': ['Riso', 'Pasta', 'Rigatoni integrali', 'Couscous', 'Pane integrale', 'Panino da hamburger', 'Pane per toast', 'Piadina', 'Corn flakes', "Fiocchi d'avena", 'Granola', 'Gallette di riso', 'Mais in scatola', 'Ceci in scatola', 'Lenticchie lessate'],
  'Frutta e verdura': ['Banana', 'Mela', 'Fragole', 'Kiwi', 'Arancia', 'Avocado', 'Patate', 'Patate dolci', 'Pomodori', 'Pomodorini', 'Zucchine', 'Cetrioli', 'Asparagi', 'Fagiolini', 'Peperoni', 'Piselli', 'Lattuga', 'Spinaci', 'Funghi', 'Rucola', 'Cipolla'],
  Dispensa: ['Passata di pomodoro', 'Burro di arachidi', 'Mandorle', 'Crema di nocciole', 'Cacao amaro', 'Marmellata', 'Miele', 'Salsa di soia', 'Olio extravergine'],
}

export const MEALS = {
  toast: { name: 'Toast con uova strapazzate, avocado e pomodoro', recipe: 7, kind: 'salata',
    ing: [['Pane integrale', 90], ['Uova', 110], ['Avocado', 40], ['Pomodori', 80]] },
  uovaFeta: { name: "Uova all'occhio con toast e feta", recipe: 8, kind: 'salata',
    ing: [['Uova', 110], ['Pane integrale', 90], ['Feta', 30]] },
  yogurt: { name: 'Yogurt greco con banana, avena e miele', recipe: 2, kind: 'dolce',
    ing: [['Yogurt greco 2%', 200], ['Banana', 120], ["Fiocchi d'avena", 40], ['Miele', 10]] },
  yogurtPb: { name: 'Yogurt greco con banana e burro di arachidi', recipe: 2, kind: 'dolce',
    ing: [['Yogurt greco 2%', 200], ['Banana', 120], ["Fiocchi d'avena", 30], ['Burro di arachidi', 15]] },
  pancake: { name: 'Pancake con banana e crema di nocciole', recipe: 10, kind: 'dolce',
    ing: [['Banana', 150], ['Uova', 110], ["Fiocchi d'avena", 50], ['Crema di nocciole', 15]] },

  salmoneRiso: { name: 'Salmone piccante e riso al pomodoro', recipe: 42,
    ing: [['Salmone', 150], ['Riso', 80], ['Passata di pomodoro', 100], ['Zucchine', 150], ['Olio extravergine', 10]] },
  polloPatateDolci: { name: 'Pollo speziato, patate dolci e fiocchi di latte', recipe: 13,
    ing: [['Petto di pollo', 250], ['Patate dolci', 300], ['Fiocchi di latte', 100], ['Olio extravergine', 10]] },
  pastaRagu: { name: 'Pasta al ragù di manzo', recipe: 26,
    ing: [['Pasta', 110], ['Manzo macinato magro', 250], ['Passata di pomodoro', 150], ['Parmigiano', 10], ['Olio extravergine', 5]] },
  polloPatate: { name: 'Pollo, patate al forno e zucchine',
    ing: [['Petto di pollo', 250], ['Patate', 300], ['Zucchine', 150], ['Olio extravergine', 10]] },
  rigatoniTonno: { name: 'Rigatoni integrali freddi con tonno, pomodorini e ricotta', recipe: 34, cold: true,
    ing: [['Rigatoni integrali', 110], ['Tonno al naturale', 100], ['Pomodorini', 120], ['Ricotta', 60], ['Olio extravergine', 5]] },
  polloRiso: { name: 'Pollo, zucchine grigliate e riso', recipe: 15,
    ing: [['Petto di pollo', 250], ['Riso', 80], ['Zucchine', 200], ['Olio extravergine', 10]] },
  pastaFredda: { name: 'Pasta fredda con tonno, mais, pomodoro e feta', recipe: 30, cold: true,
    ing: [['Pasta', 110], ['Tonno al naturale', 110], ['Mais in scatola', 60], ['Pomodori', 100], ['Cetrioli', 80], ['Feta', 30], ['Olio extravergine', 5]] },
  bistecca: { name: 'Bistecca, avocado e patate dolci', recipe: 27,
    ing: [['Bistecca magra di manzo', 180], ['Patate dolci', 300], ['Avocado', 50], ['Zucchine', 150], ['Olio extravergine', 5]] },
  risoManzo: { name: 'Riso, manzo macinato, avocado e sriracha', recipe: 21,
    ing: [['Manzo macinato magro', 250], ['Riso', 80], ['Avocado', 60], ['Pomodorini', 100], ['Olio extravergine', 5]] },
  salmonePatate: { name: 'Salmone, patate al forno e asparagi',
    ing: [['Salmone', 150], ['Patate', 350], ['Asparagi', 150], ['Olio extravergine', 5]] },
  insalataTonno: { name: 'Insalata di tonno, feta e mais con pane', recipe: 31, cold: true,
    ing: [['Tonno al naturale', 110], ['Pane integrale', 100], ['Pomodorini', 120], ['Cetrioli', 100], ['Mais in scatola', 60], ['Feta', 30], ['Olio extravergine', 5]] },
  pizza: { name: 'Pizza margherita in pizzeria', treat: true, ing: [['Pizza margherita', 100]] },
  burger: { name: 'Burger fatto in casa con patate al forno', treat: true,
    ing: [['Panino da hamburger', 80], ['Manzo macinato magro', 250], ['Formaggio a fette', 20], ['Pomodori', 60], ['Patate', 300], ['Olio extravergine', 10]] },
  uovaMozzarella: { name: 'Uova, pomodori e mozzarella con pane', recipe: 35,
    ing: [['Uova', 110], ['Mozzarella', 60], ['Pomodori', 200], ['Pane integrale', 80], ['Olio extravergine', 5]] },

  gallette: { name: 'Gallette, burro di arachidi e banana', recipe: 11,
    ing: [['Gallette di riso', 30], ['Burro di arachidi', 15], ['Banana', 120]] },
  // Opzioni in più, per il pulsante "Cambia piatto".
  toastProsciutto: { name: 'Toast prosciutto cotto e formaggio', kind: 'salata',
    ing: [['Pane per toast', 80], ['Prosciutto cotto', 60], ['Formaggio a fette', 20]] },
  toastPbBanana: { name: 'Toast con burro di arachidi e banana', kind: 'dolce',
    ing: [['Pane per toast', 80], ['Burro di arachidi', 20], ['Banana', 120]] },
  tacchinoRiso: { name: 'Tacchino alla piastra, riso e zucchine',
    ing: [['Petto di tacchino', 250], ['Riso', 80], ['Zucchine', 150], ['Olio extravergine', 10]] },
  pastaTonno: { name: 'Pasta al tonno e pomodoro',
    ing: [['Pasta', 110], ['Tonno al naturale', 110], ['Passata di pomodoro', 150], ['Olio extravergine', 10]] },
  polpette: { name: 'Polpette di manzo al sugo con pane',
    ing: [['Manzo macinato magro', 250], ['Passata di pomodoro', 150], ['Parmigiano', 10], ['Pane integrale', 80], ['Olio extravergine', 5]] },
  risoTonnoMozzarella: { name: 'Riso freddo con tonno, mozzarella e pomodorini', cold: true,
    ing: [['Riso', 80], ['Tonno al naturale', 110], ['Mozzarella', 60], ['Pomodorini', 120], ['Olio extravergine', 5]] },
  piadinaPollo: { name: 'Piadina con pollo, pomodori e insalata', cold: true,
    ing: [['Piadina', 100], ['Petto di pollo', 250], ['Pomodori', 100], ['Lattuga', 40], ['Olio extravergine', 5]] },
  merluzzo: { name: 'Merluzzo al forno, patate e fagiolini',
    ing: [['Merluzzo', 200], ['Patate', 300], ['Fagiolini', 150], ['Olio extravergine', 10]] },
  frittata: { name: 'Frittata di zucchine con pane',
    ing: [['Uova', 165], ['Zucchine', 150], ['Pane integrale', 80], ['Olio extravergine', 5]] },
  polloPeperoni: { name: 'Pollo con peperoni e riso',
    ing: [['Petto di pollo', 250], ['Riso', 80], ['Peperoni', 150], ['Olio extravergine', 10]] },
  pokeSalmone: { name: 'Poke di salmone con riso, avocado e cetrioli', cold: true,
    ing: [['Salmone', 150], ['Riso', 80], ['Avocado', 60], ['Cetrioli', 100], ['Mais in scatola', 40]] },
  macinatoPiselli: { name: 'Manzo macinato con patate e piselli',
    ing: [['Manzo macinato magro', 250], ['Patate', 300], ['Piselli', 100], ['Olio extravergine', 10]] },
  bananaMandorle: { name: 'Banana e mandorle', ing: [['Banana', 120], ['Mandorle', 20]] },
  bananaSola: { name: 'Una banana', ing: [['Banana', 150]] },
  toastBanana: { name: 'Due toast con banana e miele', ing: [['Pane per toast', 60], ['Banana', 120], ['Miele', 10]] },
  yogurtMela: { name: 'Yogurt bianco con mela e miele', ing: [['Yogurt bianco', 150], ['Mela', 150], ['Miele', 10]] },
  galletteMiele: { name: 'Gallette con miele e una mela', ing: [['Gallette di riso', 25], ['Miele', 15], ['Mela', 150]] },

  // Quaranta ricette in più (novembre 2026).
  porridgeBanana: { name: "Porridge d'avena con yogurt, banana e cacao", kind: 'dolce',
    ing: [["Fiocchi d'avena", 50], ['Yogurt bianco', 150], ['Banana', 120], ['Cacao amaro', 5]] },
  toastRicotta: { name: 'Toast con ricotta, miele e fragole', kind: 'dolce',
    ing: [['Pane per toast', 70], ['Ricotta', 80], ['Miele', 10], ['Fragole', 100]] },
  yogurtGranola: { name: 'Yogurt bianco con granola e kiwi', kind: 'dolce',
    ing: [['Yogurt bianco', 170], ['Granola', 40], ['Kiwi', 100]] },
  pancakeFragole: { name: "Pancake d'avena con fragole e miele", kind: 'dolce',
    ing: [['Uova', 110], ["Fiocchi d'avena", 50], ['Fragole', 100], ['Miele', 10]] },
  avenaMela: { name: 'Avena e yogurt con mela e miele', kind: 'dolce',
    ing: [['Yogurt bianco', 170], ["Fiocchi d'avena", 50], ['Mela', 150], ['Miele', 5]] },
  toastNoccioleArancia: { name: 'Toast con crema di nocciole e banana, con un\'arancia', kind: 'dolce',
    ing: [['Pane per toast', 70], ['Crema di nocciole', 15], ['Banana', 100], ['Arancia', 200]] },
  frenchToast: { name: 'French toast con fragole e miele', kind: 'dolce',
    ing: [['Pane per toast', 80], ['Uova', 55], ['Fragole', 100], ['Miele', 10]] },
  cerealiFragole: { name: 'Corn flakes con yogurt bianco e fragole', kind: 'dolce',
    ing: [['Corn flakes', 40], ['Yogurt bianco', 150], ['Fragole', 100], ['Miele', 5]] },
  toastBresaola: { name: 'Toast con bresaola, rucola e formaggio spalmabile', kind: 'salata',
    ing: [['Pane per toast', 80], ['Bresaola', 50], ['Rucola', 20], ['Formaggio spalmabile light', 30]] },
  uovaSpinaci: { name: 'Uova strapazzate con spinaci e pane', kind: 'salata',
    ing: [['Uova', 110], ['Spinaci', 100], ['Pane integrale', 80], ['Olio extravergine', 5]] },
  toastSalmone: { name: 'Toast con salmone affumicato e formaggio spalmabile', kind: 'salata',
    ing: [['Pane integrale', 80], ['Salmone affumicato', 60], ['Formaggio spalmabile light', 30]] },
  omelette: { name: 'Omelette prosciutto e formaggio con pane', kind: 'salata',
    ing: [['Uova', 110], ['Prosciutto cotto', 40], ['Formaggio a fette', 20], ['Pane integrale', 60]] },
  piadinaUova: { name: 'Piadina con uova strapazzate e pomodorini', kind: 'salata',
    ing: [['Piadina', 70], ['Uova', 110], ['Pomodorini', 80]] },
  toastFiocchi: { name: 'Pane con fiocchi di latte e pomodorini', kind: 'salata',
    ing: [['Pane integrale', 80], ['Fiocchi di latte', 150], ['Pomodorini', 100], ['Olio extravergine', 5]] },

  pastaPesto: { name: 'Pasta al pesto con pollo e pomodorini',
    ing: [['Pasta', 100], ['Petto di pollo', 250], ['Pesto', 20], ['Pomodorini', 100]] },
  couscousPollo: { name: 'Couscous con pollo, zucchine e peperoni',
    ing: [['Couscous', 80], ['Petto di pollo', 250], ['Zucchine', 100], ['Peperoni', 100], ['Olio extravergine', 10]] },
  gnocchiPomodoro: { name: 'Gnocchi al pomodoro con mozzarella',
    ing: [['Gnocchi di patate', 300], ['Passata di pomodoro', 150], ['Mozzarella', 80], ['Parmigiano', 10], ['Olio extravergine', 5]] },
  risottoFunghi: { name: 'Risotto ai funghi con tacchino alla piastra',
    ing: [['Riso', 80], ['Funghi', 150], ['Petto di tacchino', 250], ['Parmigiano', 10], ['Olio extravergine', 5]] },
  risoGamberi: { name: 'Riso saltato con gamberi, piselli e uovo',
    ing: [['Riso', 80], ['Gamberi', 200], ['Piselli', 80], ['Uova', 55], ['Salsa di soia', 10], ['Olio extravergine', 10]] },
  pastaGamberi: { name: 'Pasta con gamberi, zucchine e pomodorini',
    ing: [['Pasta', 100], ['Gamberi', 200], ['Zucchine', 150], ['Pomodorini', 80], ['Olio extravergine', 10]] },
  pastaLenticchie: { name: 'Pasta e lenticchie',
    ing: [['Pasta', 90], ['Lenticchie lessate', 200], ['Passata di pomodoro', 100], ['Parmigiano', 10], ['Olio extravergine', 10]] },
  polloCeci: { name: 'Insalata di pollo, ceci, pomodori e feta con pane', cold: true,
    ing: [['Petto di pollo', 250], ['Ceci in scatola', 150], ['Pomodori', 150], ['Feta', 30], ['Pane integrale', 60], ['Olio extravergine', 10]] },
  tacchinoPatate: { name: 'Tacchino arrosto, patate e fagiolini',
    ing: [['Petto di tacchino', 250], ['Patate', 300], ['Fagiolini', 150], ['Olio extravergine', 10]] },
  salmoneCouscous: { name: 'Salmone al forno con couscous e zucchine',
    ing: [['Salmone', 150], ['Couscous', 70], ['Zucchine', 150], ['Olio extravergine', 5]] },
  merluzzoRiso: { name: 'Merluzzo in padella con pomodorini e riso',
    ing: [['Merluzzo', 200], ['Riso', 80], ['Pomodorini', 150], ['Olio extravergine', 10]] },
  piadinaTacchino: { name: 'Piadina con tacchino, formaggio spalmabile e rucola', cold: true,
    ing: [['Piadina', 100], ['Petto di tacchino', 250], ['Formaggio spalmabile light', 30], ['Rucola', 30], ['Pomodori', 80]] },
  pastaZucchine: { name: 'Pasta con zucchine, uova e parmigiano',
    ing: [['Pasta', 100], ['Zucchine', 200], ['Uova', 110], ['Parmigiano', 15], ['Olio extravergine', 5]] },
  polloSpinaci: { name: 'Pollo al limone con riso e spinaci',
    ing: [['Petto di pollo', 250], ['Riso', 80], ['Spinaci', 150], ['Olio extravergine', 10]] },
  polpetteTacchino: { name: 'Polpette di tacchino al forno con patate dolci',
    ing: [['Petto di tacchino', 250], ['Patate dolci', 300], ['Parmigiano', 10], ['Olio extravergine', 5]] },
  insalataRiso: { name: 'Insalata di riso con tonno, uovo e piselli', cold: true,
    ing: [['Riso', 80], ['Tonno al naturale', 110], ['Uova', 55], ['Piselli', 60], ['Mais in scatola', 40], ['Olio extravergine', 5]] },
  bresaolaRucola: { name: 'Bresaola, rucola e grana con pane', cold: true,
    ing: [['Bresaola', 100], ['Rucola', 50], ['Parmigiano', 20], ['Pane integrale', 100], ['Olio extravergine', 5]] },
  frittataPatate: { name: 'Frittata di patate e cipolla con pane',
    ing: [['Uova', 165], ['Patate', 200], ['Cipolla', 50], ['Pane integrale', 40], ['Olio extravergine', 10]] },
  bisteccaRucola: { name: 'Bistecca con rucola, pomodorini e patate al forno',
    ing: [['Bistecca magra di manzo', 180], ['Rucola', 50], ['Pomodorini', 100], ['Patate', 300], ['Olio extravergine', 10]] },
  salmoneSpinaci: { name: 'Salmone alla piastra con spinaci e patate',
    ing: [['Salmone', 150], ['Spinaci', 150], ['Patate', 300], ['Olio extravergine', 5]] },
  couscousTonno: { name: 'Couscous freddo con tonno, ceci e pomodorini', cold: true,
    ing: [['Couscous', 70], ['Tonno al naturale', 110], ['Ceci in scatola', 100], ['Pomodorini', 120], ['Olio extravergine', 5]] },
  risoMessicano: { name: 'Riso con pollo, avocado, mais e pomodori',
    ing: [['Riso', 80], ['Petto di pollo', 250], ['Avocado', 50], ['Mais in scatola', 60], ['Pomodori', 100], ['Olio extravergine', 5]] },

  kiwiGallette: { name: 'Due kiwi e gallette di riso', ing: [['Gallette di riso', 25], ['Kiwi', 200]] },
  aranciaMandorle: { name: 'Arancia e qualche mandorla', ing: [['Arancia', 200], ['Mandorle', 15]] },
  toastNocciole: { name: 'Toast con crema di nocciole', ing: [['Pane per toast', 40], ['Crema di nocciole', 10]] },
  melaBurro: { name: 'Mela con burro di arachidi', ing: [['Mela', 150], ['Burro di arachidi', 15]] },
}

// Le alternative che il pulsante "Cambia piatto" fa girare, per tipo di pasto.
const MAINS = ['salmoneRiso', 'polloPatateDolci', 'pastaRagu', 'polloPatate', 'rigatoniTonno', 'polloRiso', 'pastaFredda', 'bistecca',
  'risoManzo', 'salmonePatate', 'insalataTonno', 'uovaMozzarella', 'tacchinoRiso', 'pastaTonno', 'polpette', 'risoTonnoMozzarella',
  'piadinaPollo', 'merluzzo', 'frittata', 'polloPeperoni', 'pokeSalmone', 'macinatoPiselli',
  'pastaPesto', 'couscousPollo', 'gnocchiPomodoro', 'risottoFunghi', 'risoGamberi', 'pastaGamberi', 'pastaLenticchie', 'polloCeci',
  'tacchinoPatate', 'salmoneCouscous', 'merluzzoRiso', 'piadinaTacchino', 'pastaZucchine', 'polloSpinaci', 'polpetteTacchino',
  'insalataRiso', 'bresaolaRucola', 'frittataPatate', 'bisteccaRucola', 'salmoneSpinaci', 'couscousTonno', 'risoMessicano']
const PRE = ['gallette', 'bananaMandorle', 'bananaSola', 'toastBanana', 'yogurtMela', 'galletteMiele',
  'kiwiGallette', 'aranciaMandorle', 'toastNocciole', 'melaBurro']
const BREAKFAST = {
  salata: ['toast', 'uovaFeta', 'toastProsciutto', 'toastBresaola', 'uovaSpinaci', 'toastSalmone', 'omelette', 'piadinaUova', 'toastFiocchi'],
  dolce: ['toastPbBanana', 'pancake', 'porridgeBanana', 'toastRicotta', 'yogurtGranola', 'pancakeFragole',
    'avenaMela', 'toastNoccioleArancia', 'frenchToast', 'cerealiFragole'],
}

export function options(slot, id, day) {
  if (slot === 'Pre-allenamento') return PRE
  if (slot === 'Colazione') {
    const kind = MEALS[id]?.kind || 'dolce'
    return kind === 'dolce' && (day === 1 || day === 4) ? [day === 1 ? 'yogurt' : 'yogurtPb', ...BREAKFAST.dolce] : BREAKFAST[kind]
  }
  return MEALS[id]?.treat ? [id, ...MAINS] : MAINS
}

// Un'alternativa a caso, diversa dal piatto attuale e da quelli già nella giornata.
export function nextOption(slot, id, day, taken = [], rnd = Math.random) {
  const pool = options(slot, id, day).filter((c) => c !== id && !taken.includes(c))
  return pool.length ? pool[Math.floor(rnd() * pool.length)] : id
}

// La voglia del giorno: se pranzo e cena non la accontentano, il pranzo diventa un piatto di quel tipo.
export const CRAVINGS = {
  pasta: ['pastaRagu', 'rigatoniTonno', 'pastaFredda', 'pastaTonno', 'pastaPesto', 'pastaGamberi', 'pastaLenticchie', 'pastaZucchine', 'gnocchiPomodoro'],
  riso: ['salmoneRiso', 'polloRiso', 'risoManzo', 'tacchinoRiso', 'risoTonnoMozzarella', 'polloPeperoni', 'pokeSalmone',
    'risottoFunghi', 'risoGamberi', 'merluzzoRiso', 'polloSpinaci', 'insalataRiso', 'risoMessicano'],
  carne: ['polloPatateDolci', 'polloPatate', 'polloRiso', 'bistecca', 'risoManzo', 'tacchinoRiso', 'polpette', 'piadinaPollo', 'polloPeperoni', 'macinatoPiselli',
    'pastaPesto', 'couscousPollo', 'risottoFunghi', 'polloCeci', 'tacchinoPatate', 'piadinaTacchino', 'polloSpinaci', 'polpetteTacchino', 'bresaolaRucola', 'bisteccaRucola', 'risoMessicano'],
  pesce: ['salmoneRiso', 'rigatoniTonno', 'pastaFredda', 'salmonePatate', 'insalataTonno', 'pastaTonno', 'risoTonnoMozzarella', 'merluzzo', 'pokeSalmone',
    'risoGamberi', 'pastaGamberi', 'salmoneCouscous', 'merluzzoRiso', 'insalataRiso', 'salmoneSpinaci', 'couscousTonno'],
}

export const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

// Settimana di Sofia (colazione, pranzo, cena, pre-allenamento se si allena).
export const WEEK = [
  { colazione: 'toast', pranzo: 'salmoneRiso', cena: 'polloPatateDolci', pre: 'gallette' },
  { colazione: 'yogurt', pranzo: 'pastaRagu', cena: 'polloPatate', pre: 'gallette' },
  { colazione: 'toastRicotta', pranzo: 'rigatoniTonno', cena: 'polloRiso', pre: 'gallette' },
  { colazione: 'cerealiFragole', pranzo: 'pastaFredda', cena: 'bistecca', pre: 'toastBanana' },
  { colazione: 'yogurtPb', pranzo: 'risoManzo', cena: 'salmonePatate', pre: 'toastBanana' },
  { colazione: 'uovaFeta', pranzo: 'insalataTonno', cena: 'pizza', pre: 'gallette' },
  { colazione: 'pancake', pranzo: 'burger', cena: 'uovaMozzarella', pre: 'toastBanana' },
]

export function macros(ing) {
  const t = [0, 0, 0, 0]
  for (const [food, g] of ing) FOODS[food].forEach((v, i) => { t[i] += v * g / 100 })
  return t
}

// Fabbisogno: Mifflin-St Jeor (donna, 1,74 m, 18 anni) × attività, + allenamento, + un margine minimo per il muscolo.
export function target({ weight = 58, work = true, training = 'no', hunger = 'normale' }) {
  const bmr = 10 * weight + 6.25 * 174 - 5 * 18 - 161
  let kcal = bmr * (work ? 1.42 : 1.32) + 80
  if (training !== 'no') kcal += 200
  if (hunger === 'tanta') kcal += 100
  if (hunger === 'poca') kcal -= 100
  return { kcal: Math.round(kcal / 10) * 10, protein: Math.round(weight * 2) }
}

// La colazione segue la preferenza dolce/salata; lo yogurt greco resta solo martedì e venerdì.
function pickBreakfast(day, pref) {
  const base = WEEK[day].colazione
  if (!pref || MEALS[base].kind === pref) return base
  if (pref === 'salata') return [0, 3, 6].includes(day) ? 'toast' : 'uovaFeta'
  if (day === 1) return 'yogurt'
  if (day === 4) return 'yogurtPb'
  if (day >= 5) return 'pancake'
  return day % 2 ? 'cerealiFragole' : 'toastRicotta'
}

const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
export const fmt = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const TRAIN_AT = { pomeriggio: '17:00', sera: '19:30' }

export function buildDay(a) {
  const day = a.day
  const work = a.work !== false
  const wake = toMin(a.wake || '07:00')
  const training = a.training || 'no'
  const lunch = !work || a.lunch === 'libera' ? toMin('13:00') : toMin(a.lunch || '13:30')
  const sw = a.swaps || {}
  // I piatti inventati dall'assistente arrivano in a.custom, con il loro id.
  const meal = (id) => a.custom?.[id] || MEALS[id]
  const pick = (slot, id) => (sw[slot] && meal(sw[slot]) ? sw[slot] : id)
  const slots = []

  if (training === 'mattina') {
    slots.push({ slot: 'Pre-allenamento', at: wake + 10, id: pick('Pre-allenamento', WEEK[day].pre), note: "Leggero: ti alleni dopo circa un'ora." })
    slots.push({ slot: 'Colazione', at: wake + 150, id: pick('Colazione', pickBreakfast(day, a.breakfast)), note: "Dopo l'allenamento: è il tuo pasto di recupero." })
  } else {
    slots.push({ slot: 'Colazione', at: wake + 30, id: pick('Colazione', pickBreakfast(day, a.breakfast)) })
  }
  let lunchId = pick('Pranzo', WEEK[day].pranzo)
  const fits = CRAVINGS[a.craving]
  let cravingNote = null
  if (fits && !sw.Pranzo && !fits.includes(lunchId) && !fits.includes(WEEK[day].cena)) {
    const choices = fits.filter((id) => id !== WEEK[day].cena)
    lunchId = choices[day % choices.length]
    cravingNote = `Avevi voglia di ${a.craving}: ${{ pasta: 'eccola', riso: 'eccolo', carne: 'eccola', pesce: 'eccolo' }[a.craving]} a pranzo.`
  }
  const dinnerId = pick('Cena', WEEK[day].cena)
  const lunchNote = !work ? null
    : a.lunch === 'libera' ? 'Niente pausa fissa: tienilo pronto in borsa e mangialo appena hai venti minuti.'
      : meal(lunchId).cold ? 'Si mangia freddo: preparalo la sera prima e portalo al salone.'
        : 'Preparalo la sera prima e scaldalo al salone.'
  slots.push({ slot: 'Pranzo', at: lunch, id: lunchId, note: [cravingNote, lunchNote].filter(Boolean).join(' ') || null })

  let dinner = toMin('20:00')
  if (training === 'pomeriggio' || training === 'sera') {
    const t = toMin(TRAIN_AT[training])
    slots.push({ slot: 'Pre-allenamento', at: t - 75, id: pick('Pre-allenamento', WEEK[day].pre), note: `Ti alleni alle ${TRAIN_AT[training]}: mangialo un'ora e un quarto prima.` })
    if (training === 'sera') dinner = t + 105
  }
  slots.push({ slot: 'Cena', at: dinner, id: dinnerId,
    note: training === 'sera' ? "Dopo l'allenamento: proteine e carboidrati per il recupero."
      : meal(dinnerId).treat ? 'La serata libera: goditela, è già nei conti.' : null })

  const goal = target({ weight: a.weight, work, training, hunger: a.hunger })
  // Stringe o allarga solo i carboidrati elastici per arrivare al fabbisogno (tra -30% e +40%).
  let fixed = 0, flex = 0
  for (const s of slots) for (const [f, g] of meal(s.id).ing) {
    const k = FOODS[f][0] * g / 100
    if (SCALABLE.has(f)) flex += k
    else fixed += k
  }
  const factor = Math.min(1.4, Math.max(0.7, (goal.kcal - fixed) / flex))

  const meals = slots.sort((x, y) => x.at - y.at).map((s) => {
    const m = meal(s.id)
    const ing = m.ing.map(([f, g]) => [f, SCALABLE.has(f) ? Math.round(g * factor / 5) * 5 : g])
    return { ...s, time: fmt(s.at), name: m.name, recipe: m.recipe, img: `/img/meals/${m.photo || s.id}.jpg`, custom: !!a.custom?.[s.id], treat: !!m.treat, ing, mac: macros(ing) }
  })
  const total = meals.reduce((t, m) => t.map((v, i) => v + m.mac[i]), [0, 0, 0, 0])
  return { day: DAYS[day], goal, meals, total }
}

// Piatti dello stesso tipo con calorie e proteine più vicine al pasto attuale, ai conti di quella giornata.
// Tutte le colazioni possibili quel giorno, dolci e salate (lo yogurt greco solo martedì e venerdì).
export const breakfasts = (day) => [...options('Colazione', 'toast', day), ...options('Colazione', 'toastRicotta', day)]

export function similar(a, slot, n = 3, pool) {
  const base = buildDay(a)
  const cur = base.meals.find((m) => m.slot === slot)
  const taken = base.meals.filter((m) => m.slot !== slot).map((m) => m.id)
  return (pool || options(slot, cur.id, a.day)).filter((id) => id !== cur.id && !taken.includes(id))
    .map((id) => buildDay({ ...a, swaps: { ...a.swaps, [slot]: id } }).meals.find((m) => m.slot === slot))
    .map((m) => ({ ...m, off: Math.abs(m.mac[0] - cur.mac[0]) + 4 * Math.abs(m.mac[1] - cur.mac[1]) }))
    .sort((x, y) => x.off - y.off).slice(0, n)
}

export function shopping(plans) {
  const sum = {}
  for (const p of plans) for (const m of p.meals) for (const [f, g] of m.ing) sum[f] = (sum[f] || 0) + g
  return Object.entries(AISLE)
    .map(([aisle, foods]) => [aisle, foods.filter((f) => sum[f]).map((f) => [f, qty(f, sum[f])])])
    .concat(sum['Pizza margherita'] ? [['Fuori casa', [['Pizza margherita', '1 pizza']]]] : [])
    .filter(([, items]) => items.length)
}

export function qty(f, g) {
  const n = (x) => Math.max(1, Math.round(x))
  if (f === 'Uova') return n(g / 55) === 1 ? '1 uovo' : `${n(g / 55)} uova`
  if (f === 'Banana') return n(g / 120) === 1 ? '1 banana' : `${n(g / 120)} banane`
  if (f === 'Mela') return n(g / 150) === 1 ? '1 mela' : `${n(g / 150)} mele`
  if (f === 'Avocado') return `${g} g (${g <= 75 ? 'mezzo' : `circa ${n(g / 150)}`} avocado)`
  if (f === 'Tonno al naturale') return `${g} g sgocciolato (${Math.ceil(g / 56)} scatolett${Math.ceil(g / 56) === 1 ? 'a' : 'e'})`
  return g >= 1000 ? `${(g / 1000).toFixed(1).replace('.', ',')} kg` : `${g} g`
}

// Il formato italiano non raggruppa i numeri di quattro cifre: il punto delle migliaia lo mettiamo noi.
export const itNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
