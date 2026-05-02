let tokens = Number(localStorage.getItem("tokens")) || 0;
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let bazaarListings = JSON.parse(localStorage.getItem("bazaarListings")) || [];
let currentMode = "easy";
let currentTrade = null;
let inventoryView = "normal";
let bazaarSortMode = localStorage.getItem("bazaarSortMode") || "default";
let inventorySortMode = localStorage.getItem("inventorySortMode") || "rarityHigh";
let ownedBackgrounds = JSON.parse(localStorage.getItem("ownedBackgrounds")) || ["default"];
let equippedBackground = localStorage.getItem("equippedBackground") || "default";
let limitedChromaStartDate = localStorage.getItem("limitedChromaStartDate") || new Date().toISOString().slice(0, 10);
let limitedChromaDailyRates = JSON.parse(localStorage.getItem("limitedChromaDailyRates")) || {};

localStorage.setItem("limitedChromaStartDate", limitedChromaStartDate);

function saveGame() {
  localStorage.setItem("tokens", tokens);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("bazaarListings", JSON.stringify(bazaarListings));
  localStorage.setItem("bazaarSortMode", bazaarSortMode);
  localStorage.setItem("inventorySortMode", inventorySortMode);
  localStorage.setItem("ownedBackgrounds", JSON.stringify(ownedBackgrounds));
  localStorage.setItem("equippedBackground", equippedBackground);
  localStorage.setItem("limitedChromaStartDate", limitedChromaStartDate);
  localStorage.setItem("limitedChromaDailyRates", JSON.stringify(limitedChromaDailyRates));
}

function updateTokens() {
  document.getElementById("tokenCount").textContent = Math.floor(tokens).toLocaleString();
}

function daysSince(dateString) {
  const start = new Date(`${dateString}T00:00:00`);
  const now = new Date();
  const diff = now - start;
  return Math.max(0, Math.floor(diff / 86400000));
}

function getLimitedChromaDailyRate(blookName) {
  if (!limitedChromaDailyRates[blookName]) {
    limitedChromaDailyRates[blookName] = randomNumber(75, 100);
    saveGame();
  }

  return limitedChromaDailyRates[blookName];
}

function getLimitedChromaBonus(blookName) {
  return daysSince(limitedChromaStartDate) * getLimitedChromaDailyRate(blookName);
}

const easyQuestions = [
  { question: "What is 2 + 2?", answers: ["3", "4", "5", "22"], correct: "4" },
  { question: "What color is the sky?", answers: ["Blue", "Green", "Red", "Purple"], correct: "Blue" },
  { question: "How many days are in a week?", answers: ["5", "6", "7", "8"], correct: "7" },
  { question: "Which animal says meow?", answers: ["Dog", "Cat", "Cow", "Duck"], correct: "Cat" },
  { question: "What is 10 - 5?", answers: ["2", "3", "5", "10"], correct: "5" },
  { question: "Which one is a fruit?", answers: ["Car", "Apple", "Chair", "Rock"], correct: "Apple" },
  { question: "What is 3 x 3?", answers: ["6", "8", "9", "12"], correct: "9" },
  { question: "What planet do we live on?", answers: ["Mars", "Earth", "Venus", "Jupiter"], correct: "Earth" }
];

const hardQuestions = [
  { question: "What is 12 x 12?", answers: ["124", "132", "144", "156"], correct: "144" },
  { question: "What is the capital of France?", answers: ["Madrid", "Paris", "Rome", "Berlin"], correct: "Paris" },
  { question: "Which gas do plants take in?", answers: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Helium"], correct: "Carbon Dioxide" },
  { question: "What is 100 divided by 4?", answers: ["20", "25", "30", "40"], correct: "25" },
  { question: "How many sides does a hexagon have?", answers: ["5", "6", "7", "8"], correct: "6" },
  { question: "What is the largest ocean?", answers: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: "Pacific" },
  { question: "What is 9 squared?", answers: ["18", "72", "81", "99"], correct: "81" },
  { question: "What force pulls things toward Earth?", answers: ["Friction", "Gravity", "Magnetism", "Electricity"], correct: "Gravity" }
];

const biologyQuestions = [
  { question: "What molecule carries genetic instructions?", answers: ["DNA", "Sugar", "Water", "Fat"], correct: "DNA" },
  { question: "Where is DNA found in a cell?", answers: ["Nucleus", "Cell wall", "Ribosome", "Cytoplasm only"], correct: "Nucleus" },
  { question: "What are proteins made of?", answers: ["Amino acids", "Alleles", "Chromosomes", "Cells"], correct: "Amino acids" },
  { question: "What is the process that makes mRNA from DNA?", answers: ["Transcription", "Translation", "Meiosis", "Fertilization"], correct: "Transcription" },
  { question: "What is the process that makes proteins from mRNA?", answers: ["Translation", "Transcription", "Mutation", "Osmosis"], correct: "Translation" },
  { question: "What are different versions of a gene called?", answers: ["Alleles", "Proteins", "Bases", "Gametes"], correct: "Alleles" },
  { question: "What kind of cell has half the chromosomes?", answers: ["Gamete", "Zygote", "Skin cell", "Muscle cell"], correct: "Gamete" },
  { question: "What is a fertilized egg called?", answers: ["Zygote", "Gamete", "Allele", "Protein"], correct: "Zygote" },
  { question: "What pigment helps protect skin from UV radiation?", answers: ["Melanin", "Folate", "Insulin", "Keratin"], correct: "Melanin" },
  { question: "What cell division creates gametes?", answers: ["Meiosis", "Mitosis", "Translation", "Transcription"], correct: "Meiosis" },
  { question: "Which body system controls fast messages using nerves?", answers: ["Nervous system", "Digestive system", "Skeletal system", "Respiratory system"], correct: "Nervous system" },
  { question: "Which body system uses hormones as chemical messengers?", answers: ["Endocrine system", "Muscular system", "Integumentary system", "Immune system"], correct: "Endocrine system" },
  { question: "Which organ is the control center of the nervous system?", answers: ["Brain", "Liver", "Stomach", "Kidney"], correct: "Brain" },
  { question: "What hormone helps control blood sugar?", answers: ["Insulin", "Melanin", "Keratin", "Hemoglobin"], correct: "Insulin" },
  { question: "Which system breaks food into nutrients?", answers: ["Digestive system", "Nervous system", "Endocrine system", "Reproductive system"], correct: "Digestive system" },
  { question: "Which system moves oxygen into the body?", answers: ["Respiratory system", "Digestive system", "Skeletal system", "Endocrine system"], correct: "Respiratory system" },
  { question: "Which system pumps blood around the body?", answers: ["Circulatory system", "Nervous system", "Digestive system", "Muscular system"], correct: "Circulatory system" },
  { question: "Which system protects the body from pathogens?", answers: ["Immune system", "Skeletal system", "Endocrine system", "Digestive system"], correct: "Immune system" },
  { question: "What do amino acids link together to form?", answers: ["Proteins", "Genes", "Alleles", "Chromosomes"], correct: "Proteins" },
  { question: "What determines the order of amino acids in a protein?", answers: ["mRNA codons", "Cell walls", "Lipids", "Water"], correct: "mRNA codons" },
  { question: "How many bases are in one codon?", answers: ["3", "1", "2", "4"], correct: "3" },
  { question: "Where does translation happen?", answers: ["Ribosome", "Nucleus", "Mitochondria", "Cell membrane"], correct: "Ribosome" },
  { question: "What can happen if an amino acid sequence changes?", answers: ["Protein shape can change", "The cell disappears", "DNA turns into sugar", "Mitosis stops forever"], correct: "Protein shape can change" }
];

let currentQuestion = null;

function loadQuestion() {
  let questions = easyQuestions;

  if (currentMode === "hard") questions = hardQuestions;
  if (currentMode === "biology") questions = biologyQuestions;

  currentQuestion = randomFromArray(questions);

  document.getElementById("questionText").textContent = currentQuestion.question;

  if (currentMode === "easy") document.getElementById("questionModeLabel").textContent = "Easy Mode";
  if (currentMode === "hard") document.getElementById("questionModeLabel").textContent = "Hard Mode";
  if (currentMode === "biology") document.getElementById("questionModeLabel").textContent = "Biology Mode";

  document.getElementById("resultText").textContent = "";
  document.getElementById("resultText").className = "result";

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach(answer => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(answer);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(answer) {
  const resultText = document.getElementById("resultText");

  if (answer === currentQuestion.correct) {
    let earned = randomNumber(5, 10);

    if (currentMode === "hard") earned = randomNumber(30, 50);
    if (currentMode === "biology") earned = randomNumber(75, 100);

    tokens += earned;
    resultText.textContent = `Correct! You earned ${earned} tokens.`;
    resultText.classList.add("correct");

    saveGame();
    updateTokens();
  } else {
    resultText.textContent = `Wrong! The answer was ${currentQuestion.correct}.`;
    resultText.classList.add("wrong");
  }

  setTimeout(loadQuestion, 900);
}

function setQuestionMode(mode) {
  currentMode = mode;

  document.getElementById("easyModeBtn").classList.remove("active");
  document.getElementById("hardModeBtn").classList.remove("active");
  document.getElementById("biologyModeBtn").classList.remove("active");

  if (mode === "easy") document.getElementById("easyModeBtn").classList.add("active");
  if (mode === "hard") document.getElementById("hardModeBtn").classList.add("active");
  if (mode === "biology") document.getElementById("biologyModeBtn").classList.add("active");

  loadQuestion();
}

document.getElementById("easyModeBtn").onclick = () => setQuestionMode("easy");
document.getElementById("hardModeBtn").onclick = () => setQuestionMode("hard");
document.getElementById("biologyModeBtn").onclick = () => setQuestionMode("biology");

const blooks = [
  { name: "Pebble Mouse", icon: "🐭", rarity: "common", sell: 10, tradable: true },
  { name: "Cozy Hamster", icon: "🐹", rarity: "common", sell: 10, tradable: true },
  { name: "Moss Turtle", icon: "🐢", rarity: "common", sell: 12, tradable: true },
  { name: "Bubble Guppy", icon: "🐟", rarity: "common", sell: 12, tradable: true },
  { name: "Prickle Hedgehog", icon: "🦔", rarity: "common", sell: 14, tradable: true },
  { name: "Lucky Ladybug", icon: "🐞", rarity: "common", sell: 14, tradable: true },

  { name: "Amber Fox", icon: "🦊", rarity: "uncommon", sell: 25, tradable: true },
  { name: "Bandit Raccoon", icon: "🦝", rarity: "uncommon", sell: 25, tradable: true },
  { name: "River Otter", icon: "🦦", rarity: "uncommon", sell: 28, tradable: true },
  { name: "Cloud Panda", icon: "🐼", rarity: "uncommon", sell: 28, tradable: true },
  { name: "Mint Frog", icon: "🐸", rarity: "uncommon", sell: 30, tradable: true },
  { name: "Frost Penguin", icon: "🐧", rarity: "uncommon", sell: 30, tradable: true },

  { name: "Twilight Owl", icon: "🦉", rarity: "rare", sell: 75, tradable: true },
  { name: "Cactus Lizard", icon: "🦎", rarity: "rare", sell: 75, tradable: true },
  { name: "Forest Deer", icon: "🦌", rarity: "rare", sell: 85, tradable: true },
  { name: "Pastel Unicorn", icon: "🦄", rarity: "rare", sell: 85, tradable: true },
  { name: "Deep Sea Octopus", icon: "🐙", rarity: "rare", sell: 95, tradable: true },
  { name: "Dune Scorpion", icon: "🦂", rarity: "rare", sell: 95, tradable: true },

  { name: "Shadow Dragon", icon: "🐉", rarity: "epic", sell: 180, tradable: true },
  { name: "Neon Shark", icon: "🦈", rarity: "epic", sell: 180, tradable: true },
  { name: "Royal Peacock", icon: "🦚", rarity: "epic", sell: 200, tradable: true },
  { name: "Night Bat", icon: "🦇", rarity: "epic", sell: 200, tradable: true },
  { name: "Aqua Dolphin", icon: "🐬", rarity: "epic", sell: 220, tradable: true },
  { name: "Spirit Wolf", icon: "🐺", rarity: "epic", sell: 220, tradable: true },

  { name: "Solar Serpent", icon: "☀️", rarity: "legendary", sell: 550, tradable: true },
  { name: "Thunder Titan", icon: "⚡", rarity: "legendary", sell: 550, tradable: true },
  { name: "Moon Sovereign", icon: "🌙", rarity: "legendary", sell: 600, tradable: true },
  { name: "Tide Emperor", icon: "🔱", rarity: "legendary", sell: 625, tradable: true },
  { name: "Aegis Knight", icon: "🛡️", rarity: "legendary", sell: 650, tradable: true },
  { name: "Inferno King", icon: "🔥", rarity: "legendary", sell: 675, tradable: true },

  { name: "Chroma Crown", icon: "👑", rarity: "mythic", sell: 1800, tradable: true },
  { name: "Chroma Galaxy", icon: "🌌", rarity: "mythic", sell: 1900, tradable: true },
  { name: "Chroma Phantom", icon: "👻", rarity: "mythic", sell: 2000, tradable: true },
  { name: "Chroma Rift", icon: "🌀", rarity: "mythic", sell: 2200, tradable: true },
  { name: "Chroma Nova", icon: "💫", rarity: "mythic", sell: 2400, tradable: true },
  { name: "Chroma Evergreen", icon: "🍃", rarity: "mythic", sell: 2600, tradable: true, exclusivePack: "Forest Pack" },
  { name: "Chroma Leviathan", icon: "🐋", rarity: "mythic", sell: 2700, tradable: true, exclusivePack: "Aquatic Pack" },
  { name: "Chroma Cloudwing", icon: "🕊️", rarity: "mythic", sell: 2750, tradable: true, exclusivePack: "Sky Pack" },
  { name: "Chroma Clover", icon: "🍄", rarity: "mythic", sell: 2650, tradable: true, exclusivePack: "Meadow Pack" },
  { name: "Chroma Eclipse", icon: "🌘", rarity: "mythic", sell: 2850, tradable: true, exclusivePack: "Twilight Pack" },
  { name: "Chroma Snowfall", icon: "⛄", rarity: "mythic", sell: 2700, tradable: true, exclusivePack: "Frost Pack" },
  { name: "Chroma Prism", icon: "🔮", rarity: "mythic", sell: 3000, tradable: true, exclusivePack: "Crystal Pack" },
  { name: "Chroma Spellbook", icon: "📖", rarity: "mythic", sell: 2900, tradable: true, exclusivePack: "Magic Pack" },
  { name: "Chroma Phoenix", icon: "🦅", rarity: "mythic", sell: 2950, tradable: true, exclusivePack: "Sky Pack" },
  { name: "Chroma Lantern", icon: "🏮", rarity: "mythic", sell: 2800, tradable: true, exclusivePack: "Twilight Pack" },
  { name: "Chroma Diamond", icon: "💠", rarity: "mythic", sell: 3100, tradable: true, exclusivePack: "Crystal Pack" },
  { name: "Chroma Potion", icon: "🧪", rarity: "mythic", sell: 2850, tradable: true, exclusivePack: "Magic Pack" },

  { name: "Mystical Jellyfish", icon: "🪼", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Aquatic Pack" },
  { name: "Chubby Bear", icon: "🐻", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Forest Pack" },
  { name: "Vibrant Balloons", icon: "🪂", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Sky Pack" },

  { name: "Limited Egg Chick", icon: "🐣", rarity: "common", sell: 18, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Hatching Egg", icon: "🥚", rarity: "common", sell: 18, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Spring Flower", icon: "🌷", rarity: "common", sell: 20, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Blossom", icon: "🌸", rarity: "uncommon", sell: 40, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Honeybee", icon: "🐝", rarity: "uncommon", sell: 45, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Carrot", icon: "🥕", rarity: "uncommon", sell: 50, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Basket", icon: "🧺", rarity: "rare", sell: 120, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Candy", icon: "🍬", rarity: "rare", sell: 125, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Daisy", icon: "🌼", rarity: "rare", sell: 130, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Butterfly", icon: "🦋", rarity: "epic", sell: 260, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Lamb", icon: "🐑", rarity: "epic", sell: 280, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Spring Angel", icon: "🪽", rarity: "legendary", sell: 800, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Limited Bloom Crown", icon: "💐", rarity: "legendary", sell: 850, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack" },
  { name: "Chroma Bunny", icon: "🐰", rarity: "mythic", sell: 3500, tradable: false, limited: true, exclusivePack: "Easter Blossom Pack", risingValue: true },

  { name: "Summer Shell", icon: "🐚", rarity: "common", sell: 22, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Beach Ball", icon: "🏖️", rarity: "common", sell: 22, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Surf Wave", icon: "🏄", rarity: "uncommon", sell: 55, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Coconut Chill", icon: "🥥", rarity: "uncommon", sell: 60, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Watermelon Slice", icon: "🍉", rarity: "rare", sell: 140, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Ice Cream Cone", icon: "🍦", rarity: "rare", sell: 150, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Tropical Drink", icon: "🍹", rarity: "epic", sell: 300, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Palm Paradise", icon: "🌴", rarity: "epic", sell: 320, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Summer Fireworks", icon: "🎆", rarity: "legendary", sell: 900, tradable: false, limited: true, exclusivePack: "Summer Splash Pack" },
  { name: "Chroma Sun", icon: "🌞", rarity: "mythic", sell: 3800, tradable: false, limited: true, exclusivePack: "Summer Splash Pack", risingValue: true }
];

const STANDARD_ODDS = {
  common: 35,
  uncommon: 25,
  rare: 23,
  epic: 15,
  legendary: 2,
  mythic: 0.05
};

const MYSTICAL_ODDS = {
  common: 35,
  uncommon: 25,
  rare: 23,
  epic: 15,
  legendary: 2,
  mythic: 0.05,
  mystical: 0.01
};

const packs = [
  {
    name: "Summer Splash Pack",
    icon: "🌞",
    price: 350,
    odds: STANDARD_ODDS,
    limited: true,
    summer: true,
    archived: false,
    description: "A limited summer pack with only summer-themed untradeable blooks.",
    emojis: ["🐚", "🏖️", "🏄", "🥥", "🍉", "🍦", "🍹", "🌴", "🎆", "🌞"]
  },
  {
    name: "Forest Pack",
    icon: "🌲",
    price: 200,
    odds: MYSTICAL_ODDS,
    mystical: true,
    description: "A calm forest pack with the ultra-rare Mystical Chubby Bear.",
    emojis: ["🐭", "🐹", "🐢", "🦊", "🦝", "🍃", "🐻"]
  },
  {
    name: "Aquatic Pack",
    icon: "🌊",
    price: 200,
    odds: MYSTICAL_ODDS,
    mystical: true,
    description: "A blue aquatic pack with sea creatures, chromas, and the ultra-rare Mystical Jellyfish.",
    emojis: ["🐟", "🦦", "🐙", "🦈", "🐬", "🐋", "🪼"]
  },
  {
    name: "Sky Pack",
    icon: "☁️",
    price: 200,
    odds: MYSTICAL_ODDS,
    mystical: true,
    skyMystical: true,
    description: "A light sky pack with clouds, chromas, and the ultra-rare Mystical Vibrant Balloons.",
    emojis: ["🐞", "🐧", "🦉", "🦚", "☀️", "🕊️", "🦅", "🪂"]
  },
  {
    name: "Meadow Pack",
    icon: "🍀",
    price: 200,
    odds: STANDARD_ODDS,
    description: "A soft meadow pack with lucky and peaceful blooks.",
    emojis: ["🦔", "🐸", "🦎", "🦄", "🐺", "🍄"]
  },
  {
    name: "Twilight Pack",
    icon: "🌆",
    price: 200,
    odds: STANDARD_ODDS,
    description: "A sunset pack with rare night-themed blooks.",
    emojis: ["🦇", "🐉", "🦂", "🔥", "👻", "🌘", "🏮"]
  },
  {
    name: "Frost Pack",
    icon: "❄️",
    price: 200,
    odds: STANDARD_ODDS,
    description: "A cool pack with icy, clean, and crisp pulls.",
    emojis: ["🐧", "🐼", "🦦", "💫", "⛄", "👑"]
  },
  {
    name: "Crystal Pack",
    icon: "💎",
    price: 200,
    odds: STANDARD_ODDS,
    description: "A shiny pack with a premium crystal style.",
    emojis: ["🦄", "🦚", "🐉", "⚡", "👑", "🔮", "💠"]
  },
  {
    name: "Magic Pack",
    icon: "✨",
    price: 200,
    odds: STANDARD_ODDS,
    description: "A mystical pack with magical and high-aura blooks.",
    emojis: ["🐺", "🦇", "☀️", "🌙", "🌌", "📖", "🧪"]
  },
  {
    name: "Easter Blossom Pack",
    icon: "🐰",
    price: 350,
    odds: STANDARD_ODDS,
    limited: true,
    archived: true,
    description: "An archived Easter pack with Easter-themed blooks. This pack is no longer purchasable.",
    emojis: ["🐣", "🥚", "🌷", "🌸", "🐝", "🥕", "🧺", "🍬", "🌼", "🦋", "🐑", "🪽", "💐"]
  }
];

const backgrounds = [
  { id: "default", name: "Default", price: 0, preview: "preview-default" },
  { id: "dark", name: "Dark", price: 750, preview: "preview-dark" },
  { id: "sunset", name: "Sunset", price: 1000, preview: "preview-sunset" },
  { id: "ocean", name: "Ocean", price: 1250, preview: "preview-ocean" },
  { id: "forest", name: "Forest", price: 1250, preview: "preview-forest" },
  { id: "galaxy", name: "Galaxy", price: 2500, preview: "preview-galaxy" },
  { id: "candy", name: "Candy", price: 1500, preview: "preview-candy" },
  { id: "summer", name: "Summer", price: 2000, preview: "preview-summer" }
];

function getSellValue(blook) {
  const realBlook = blooks.find(b => b.name === blook.name);
  const cleanBlook = realBlook || blook;

  if (cleanBlook.limited && cleanBlook.rarity === "mythic") {
    return cleanBlook.sell + getLimitedChromaBonus(cleanBlook.name);
  }

  return cleanBlook.sell || getFallbackSellValue(cleanBlook.rarity);
}

function getFallbackSellValue(rarity) {
  const values = {
    common: 10,
    uncommon: 25,
    rare: 75,
    epic: 180,
    legendary: 550,
    mythic: 1800,
    mystical: 8000
  };

  return values[rarity] || 10;
}

function normalizeInventory() {
  for (const name in inventory) {
    const realBlook = blooks.find(b => b.name === name);

    if (realBlook) {
      inventory[name] = {
        ...realBlook,
        count: inventory[name].count || 1,
        sell: getSellValue(realBlook)
      };
    } else {
      inventory[name].sell = inventory[name].sell || getFallbackSellValue(inventory[name].rarity);
      inventory[name].tradable = inventory[name].tradable !== false;
      inventory[name].count = inventory[name].count || 1;
    }
  }

  saveGame();
}

function getRandomRarity(odds) {
  const entries = Object.entries(odds);
  const totalWeight = entries.reduce((sum, [, value]) => sum + value, 0);
  let roll = Math.random() * totalWeight;

  for (const [rarity, weight] of entries) {
    if (roll < weight) return rarity;
    roll -= weight;
  }

  return "common";
}

function getPackPool(pack, rarity) {
  return blooks.filter(blook => {
    if (blook.rarity !== rarity) return false;

    if (pack.name === "Easter Blossom Pack") {
      return blook.exclusivePack === "Easter Blossom Pack";
    }

    if (pack.name === "Summer Splash Pack") {
      return blook.exclusivePack === "Summer Splash Pack";
    }

    if (!blook.exclusivePack) return true;

    return blook.exclusivePack === pack.name;
  });
}

function getRandomBlookFromPack(pack) {
  const rarity = getRandomRarity(pack.odds);
  let pool = getPackPool(pack, rarity);

  if (pool.length === 0) {
    pool = getPackPool(pack, "common");
  }

  return randomFromArray(pool);
}

function renderPacks() {
  const packGrid = document.getElementById("packGrid");
  const archivedPackGrid = document.getElementById("archivedPackGrid");

  packGrid.innerHTML = "";
  archivedPackGrid.innerHTML = "";

  packs.forEach(pack => {
    const card = createPackCard(pack);

    if (pack.archived) {
      archivedPackGrid.appendChild(card);
    } else {
      packGrid.appendChild(card);
    }
  });
}

function createPackCard(pack) {
  const card = document.createElement("div");

  card.className = `pack-card pack-banner ${pack.name === "Easter Blossom Pack" ? "easter-banner-pack" : ""} ${pack.mystical ? "forest-mystical-pack" : ""} ${pack.skyMystical ? "sky-mystical-pack" : ""} ${pack.summer ? "summer-banner-pack" : ""}`;

  const emojiRow = pack.emojis.map(emoji => `<span>${emoji}</span>`).join("");
  const oddsText = pack.mystical
    ? "Common 35% · Uncommon 25% · Rare 23% · Epic 15% · Legendary 2% · Chroma 0.05% · Mystical 0.01%"
    : "Common 35% · Uncommon 25% · Rare 23% · Epic 15% · Legendary 2% · Chroma 0.05%";

  card.innerHTML = `
    ${pack.archived ? `<div class="archived-badge">ARCHIVED</div>` : ""}
    ${pack.limited && !pack.archived ? `<div class="limited-badge">LIMITED</div>` : ""}
    ${pack.mystical ? `<div class="mystical-badge">MYSTICAL</div>` : ""}
    <div class="pack-banner-icon">${pack.icon}</div>
    <div class="pack-banner-info">
      <h3>${pack.name}</h3>
      <p>${pack.description}</p>
      <p>${oddsText}</p>
      <div class="pack-emoji-row">${emojiRow}</div>
    </div>
    <div class="pack-banner-side">
      <p>Price</p>
      <strong>${pack.price}</strong>
      <p>tokens each</p>
      <div class="pack-quantity-row">
        <input class="pack-qty" type="number" min="1" max="100" value="1" ${pack.archived ? "disabled" : ""}>
        <button ${pack.archived || tokens < pack.price ? "disabled" : ""}>${pack.archived ? "Archived" : pack.limited ? "Open Limited" : "Open Pack"}</button>
      </div>
    </div>
  `;

  const button = card.querySelector("button");
  const quantityInput = card.querySelector(".pack-qty");

  if (!pack.archived) {
    button.onclick = () => {
      const quantity = Math.max(1, Math.min(100, Number(quantityInput.value) || 1));
      quantityInput.value = quantity;
      openPack(pack, quantity);
    };
  }

  return card;
}

function openPack(pack, quantity = 1) {
  if (pack.archived) return;

  const totalCost = pack.price * quantity;

  if (tokens < totalCost) {
    alert(`Not enough tokens! You need ${totalCost.toLocaleString()} tokens.`);
    return;
  }

  tokens -= totalCost;

  const wonBlooks = [];

  for (let i = 0; i < quantity; i++) {
    const wonBlook = getRandomBlookFromPack(pack);
    addBlook(wonBlook);
    wonBlooks.push(wonBlook);
  }

  saveGame();
  updateTokens();
  renderPacks();
  renderInventory();
  renderBazaar();
  renderBackgroundShop();
  showUnboxing(wonBlooks);
}

function addBlook(blook) {
  const cleanBlook = {
    ...blook,
    sell: getSellValue(blook),
    tradable: blook.tradable !== false
  };

  if (!inventory[cleanBlook.name]) {
    inventory[cleanBlook.name] = {
      ...cleanBlook,
      count: 0
    };
  }

  inventory[cleanBlook.name].count++;
  inventory[cleanBlook.name].sell = getSellValue(cleanBlook);
}

function removeBlook(blookName) {
  if (!inventory[blookName]) return false;

  inventory[blookName].count--;

  if (inventory[blookName].count <= 0) {
    delete inventory[blookName];
  }

  return true;
}

document.getElementById("normalInventoryBtn").onclick = () => {
  inventoryView = "normal";
  document.getElementById("normalInventoryBtn").classList.add("active");
  document.getElementById("limitedInventoryBtn").classList.remove("active");
  renderInventory();
};

document.getElementById("limitedInventoryBtn").onclick = () => {
  inventoryView = "limited";
  document.getElementById("limitedInventoryBtn").classList.add("active");
  document.getElementById("normalInventoryBtn").classList.remove("active");
  renderInventory();
};

document.getElementById("inventorySort").onchange = event => {
  inventorySortMode = event.target.value;
  saveGame();
  renderInventory();
};

function sortInventoryItems(items) {
  const sorted = [...items];

  if (inventorySortMode === "rarityHigh") {
    sorted.sort((a, b) => rarityValue(b.rarity) - rarityValue(a.rarity));
  }

  if (inventorySortMode === "rarityLow") {
    sorted.sort((a, b) => rarityValue(a.rarity) - rarityValue(b.rarity));
  }

  if (inventorySortMode === "countHigh") {
    sorted.sort((a, b) => b.count - a.count);
  }

  if (inventorySortMode === "countLow") {
    sorted.sort((a, b) => a.count - b.count);
  }

  if (inventorySortMode === "sellHigh") {
    sorted.sort((a, b) => getSellValue(b) - getSellValue(a));
  }

  if (inventorySortMode === "sellLow") {
    sorted.sort((a, b) => getSellValue(a) - getSellValue(b));
  }

  if (inventorySortMode === "nameAZ") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

function renderInventory() {
  const inventoryGrid = document.getElementById("inventoryGrid");
  inventoryGrid.innerHTML = "";

  let ownedBlooks = Object.values(inventory);

  if (inventoryView === "normal") {
    ownedBlooks = ownedBlooks.filter(blook => !blook.limited);
  } else {
    ownedBlooks = ownedBlooks.filter(blook => blook.limited);
  }

  ownedBlooks = sortInventoryItems(ownedBlooks);

  document.getElementById("inventorySort").value = inventorySortMode;

  if (ownedBlooks.length === 0) {
    inventoryGrid.innerHTML = `
      <div class="card">
        <h2>No ${inventoryView} blooks yet!</h2>
        <p>Open packs or check the Bazaar to grow your collection.</p>
      </div>
    `;
    updateTradeDropdown();
    return;
  }

  ownedBlooks.forEach(blook => {
    const card = document.createElement("div");

    let specialClass = "";
    if (blook.rarity === "legendary") specialClass = "legendary-card";
    if (blook.rarity === "mythic") specialClass = "mythic-card";
    if (blook.rarity === "mystical") specialClass = "mystical-card";
    if (blook.limited) specialClass += " limited-card";
    if (blook.limited && blook.rarity === "mythic") specialClass = "limited-chroma-card";

    const sellValue = getSellValue(blook);

    card.className = `blook-card ${specialClass}`;

    card.innerHTML = `
      <div class="blook-icon">${blook.icon}</div>
      <h3>${blook.name}</h3>
      <span class="rarity ${blook.rarity}">${rarityName(blook.rarity)}</span>
      <p class="count">Owned: ${blook.count}</p>
      <p class="count">Sell: ${sellValue.toLocaleString()} tokens</p>
      <button class="sell-btn">Sell for ${sellValue.toLocaleString()} tokens</button>
    `;

    const sellButton = card.querySelector(".sell-btn");
    sellButton.onclick = () => sellBlook(blook.name);

    inventoryGrid.appendChild(card);
  });

  updateTradeDropdown();
}

function sellBlook(blookName) {
  const blook = inventory[blookName];

  if (!blook) return;

  const sellValue = getSellValue(blook);
  const confirmSell = confirm(`Sell ${blook.name} for ${sellValue.toLocaleString()} tokens?`);

  if (!confirmSell) return;

  tokens += sellValue;
  removeBlook(blookName);

  saveGame();
  updateTokens();
  renderInventory();
  renderPacks();
  renderBazaar();
  renderBackgroundShop();
}

function rarityValue(rarity) {
  const values = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythic: 6,
    mystical: 7
  };

  return values[rarity] || 1;
}

function rarityName(rarity) {
  if (rarity === "mythic") return "CHROMA";
  if (rarity === "mystical") return "MYSTICAL";
  return rarity.toUpperCase();
}

function lowerRarity(rarity) {
  const order = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "mystical"];
  const index = order.indexOf(rarity);

  if (index <= 0) return null;
  return order[index - 1];
}

const sellerFirst = [
  "Sunny", "Pixel", "Mystic", "Token", "Lucky", "Golden", "Cosmic", "Rapid",
  "Turbo", "Nova", "Cloudy", "Frosty", "Shadow", "Minty", "Royal", "Epic",
  "Chroma", "Blook", "Rare", "Glitch", "Spark", "Lunar", "Solar", "Aqua"
];

const sellerSecond = [
  "Seller", "Trader", "Dealer", "Collector", "Hunter", "Market", "Merchant",
  "Goose", "Fox", "Wizard", "Knight", "Boss", "Legend", "Llama", "Dragon",
  "Penguin", "Otter", "Vault", "Shop", "Bazaar", "Captain", "Master"
];

function randomSellerName() {
  const number = randomNumber(10, 9999);
  return `${randomFromArray(sellerFirst)}${randomFromArray(sellerSecond)}${number}`;
}

function getBazaarPrice(blook) {
  const sell = getSellValue(blook);

  if (blook.rarity === "mystical") {
    return randomNumber(28000, 52000);
  }

  if (blook.limited && blook.rarity === "mythic") {
    return Math.max(25000, sell + randomNumber(22000, 45000));
  }

  if (blook.rarity === "mythic") {
    return sell + randomNumber(1000, 2500);
  }

  const multipliers = {
    common: [2, 4],
    uncommon: [3, 5],
    rare: [4, 7],
    epic: [5, 8],
    legendary: [6, 10]
  };

  const [min, max] = multipliers[blook.rarity] || [2, 4];

  return sell * randomNumber(min, max);
}

function generateBazaarListings() {
  bazaarListings = [];

  for (let i = 0; i < 14; i++) {
    const blook = randomFromArray(blooks);

    bazaarListings.push({
      id: Date.now() + "-" + i + "-" + Math.random(),
      blookName: blook.name,
      seller: randomSellerName(),
      price: getBazaarPrice(blook)
    });
  }

  saveGame();
}

function getBlookByName(name) {
  return blooks.find(blook => blook.name === name);
}

document.getElementById("bazaarSort").onchange = event => {
  bazaarSortMode = event.target.value;
  saveGame();
  renderBazaar();
};

function getSortedBazaarListings() {
  const listings = [...bazaarListings];

  if (bazaarSortMode === "rarityHigh") {
    listings.sort((a, b) => {
      const aBlook = getBlookByName(a.blookName);
      const bBlook = getBlookByName(b.blookName);
      return rarityValue(bBlook.rarity) - rarityValue(aBlook.rarity);
    });
  }

  if (bazaarSortMode === "rarityLow") {
    listings.sort((a, b) => {
      const aBlook = getBlookByName(a.blookName);
      const bBlook = getBlookByName(b.blookName);
      return rarityValue(aBlook.rarity) - rarityValue(bBlook.rarity);
    });
  }

  if (bazaarSortMode === "priceHigh") {
    listings.sort((a, b) => b.price - a.price);
  }

  if (bazaarSortMode === "priceLow") {
    listings.sort((a, b) => a.price - b.price);
  }

  return listings;
}

function renderBazaar() {
  const bazaarGrid = document.getElementById("bazaarGrid");
  if (!bazaarGrid) return;

  if (bazaarListings.length === 0) {
    generateBazaarListings();
  }

  document.getElementById("bazaarSort").value = bazaarSortMode;

  bazaarGrid.innerHTML = "";

  const sortedListings = getSortedBazaarListings();

  sortedListings.forEach(listing => {
    const blook = getBlookByName(listing.blookName);

    if (!blook) return;

    let specialClass = "";
    if (blook.rarity === "legendary") specialClass = "legendary-card";
    if (blook.rarity === "mythic") specialClass = "mythic-card";
    if (blook.rarity === "mystical") specialClass = "mystical-card";
    if (blook.limited) specialClass += " limited-card";
    if (blook.limited && blook.rarity === "mythic") specialClass = "limited-chroma-card";

    const card = document.createElement("div");
    card.className = `bazaar-card ${specialClass}`;

    card.innerHTML = `
      <p class="seller-name">Seller: ${listing.seller}</p>
      <div class="bazaar-icon">${blook.icon}</div>
      <h3>${blook.name}</h3>
      <span class="rarity ${blook.rarity}">${rarityName(blook.rarity)}</span>
      <p class="price-tag">🪙 ${listing.price.toLocaleString()}</p>
      <button class="buy-btn" ${tokens < listing.price ? "disabled" : ""}>Buy</button>
    `;

    const buyButton = card.querySelector(".buy-btn");
    buyButton.onclick = () => buyBazaarListing(listing.id);

    bazaarGrid.appendChild(card);
  });
}

function buyBazaarListing(listingId) {
  const listing = bazaarListings.find(item => item.id === listingId);

  if (!listing) return;

  const blook = getBlookByName(listing.blookName);

  if (!blook) return;

  if (tokens < listing.price) {
    alert("Not enough tokens!");
    return;
  }

  tokens -= listing.price;
  addBlook(blook);

  bazaarListings = bazaarListings.filter(item => item.id !== listingId);

  saveGame();
  updateTokens();
  renderBazaar();
  renderInventory();
  renderPacks();
  renderBackgroundShop();

  alert(`You bought ${blook.icon} ${blook.name}!`);
}

document.getElementById("refreshBazaarBtn").onclick = () => {
  const confirmRefresh = confirm("Refresh the Bazaar? Current listings will disappear.");

  if (!confirmRefresh) return;

  generateBazaarListings();
  renderBazaar();
};

function renderBackgroundShop() {
  const backgroundGrid = document.getElementById("backgroundGrid");
  backgroundGrid.innerHTML = "";

  backgrounds.forEach(bg => {
    const owned = ownedBackgrounds.includes(bg.id);
    const equipped = equippedBackground === bg.id;

    const card = document.createElement("div");
    card.className = "background-card";

    card.innerHTML = `
      <div class="background-preview ${bg.preview}"></div>
      <h3>${bg.name}</h3>
      <p class="count">${bg.price === 0 ? "Free" : `${bg.price.toLocaleString()} tokens`}</p>
      <button class="background-btn" ${!owned && tokens < bg.price ? "disabled" : ""}>
        ${equipped ? "Equipped" : owned ? "Equip" : "Buy"}
      </button>
    `;

    const btn = card.querySelector("button");

    btn.onclick = () => {
      if (equipped) return;

      if (owned) {
        equippedBackground = bg.id;
        applyBackground();
        saveGame();
        renderBackgroundShop();
        return;
      }

      if (tokens < bg.price) {
        alert("Not enough tokens!");
        return;
      }

      tokens -= bg.price;
      ownedBackgrounds.push(bg.id);
      equippedBackground = bg.id;
      applyBackground();
      saveGame();
      updateTokens();
      renderBackgroundShop();
      renderPacks();
      renderBazaar();
    };

    backgroundGrid.appendChild(card);
  });
}

function applyBackground() {
  document.body.className = "";
  document.body.classList.add(`bg-${equippedBackground}`);
}

function showUnboxing(wonInput) {
  const wonBlooks = Array.isArray(wonInput) ? wonInput : [wonInput];
  const modal = document.getElementById("unboxModal");
  const packShake = document.getElementById("packShake");
  const unboxName = document.getElementById("unboxName");
  const unboxRarity = document.getElementById("unboxRarity");
  const unboxList = document.getElementById("unboxList");

  modal.classList.remove("hidden");

  packShake.textContent = "🎁";
  packShake.className = "pack-shake";
  unboxName.textContent = "Opening...";
  unboxRarity.textContent = "";
  unboxList.innerHTML = "";

  setTimeout(() => {
    const bestBlook = [...wonBlooks].sort((a, b) => rarityValue(b.rarity) - rarityValue(a.rarity))[0];

    packShake.textContent = bestBlook.icon;
    packShake.className = "pack-shake reveal";

    if (wonBlooks.length === 1) {
      unboxName.textContent = bestBlook.name;
      unboxRarity.textContent = rarityName(bestBlook.rarity);
      unboxRarity.className = bestBlook.rarity;
      unboxList.innerHTML = "";
    } else {
      const counts = {};

      wonBlooks.forEach(blook => {
        if (!counts[blook.name]) {
          counts[blook.name] = {
            blook,
            count: 0
          };
        }

        counts[blook.name].count++;
      });

      const results = Object.values(counts).sort((a, b) => rarityValue(b.blook.rarity) - rarityValue(a.blook.rarity));

      unboxName.textContent = `Opened ${wonBlooks.length} Packs`;
      unboxRarity.textContent = `Best Pull: ${bestBlook.icon} ${bestBlook.name}`;
      unboxRarity.className = bestBlook.rarity;

      unboxList.innerHTML = results.map(item => `
        <div class="unbox-list-item">
          ${item.blook.icon} ${item.blook.name} ×${item.count}
        </div>
      `).join("");
    }
  }, 700);
}

document.getElementById("closeModalBtn").onclick = () => {
  document.getElementById("unboxModal").classList.add("hidden");
  renderInventory();
};

function getTradeableInventoryItems() {
  return Object.values(inventory).filter(blook => blook.tradable !== false);
}

function getTradeableBlookPool() {
  return blooks.filter(blook => blook.tradable !== false && !blook.limited);
}

function updateTradeDropdown() {
  const tradeSelect = document.getElementById("tradeYourBlook");
  if (!tradeSelect) return;

  tradeSelect.innerHTML = "";

  const tradableOwnedBlooks = getTradeableInventoryItems();

  if (tradableOwnedBlooks.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No tradable blooks owned";
    option.value = "";
    tradeSelect.appendChild(option);
    return;
  }

  tradableOwnedBlooks.forEach(blook => {
    const option = document.createElement("option");
    option.value = blook.name;
    option.textContent = `${blook.icon} ${blook.name} x${blook.count} - ${rarityName(blook.rarity)}`;
    tradeSelect.appendChild(option);
  });
}

document.getElementById("makeTradeBtn").onclick = () => {
  const yourBlookName = document.getElementById("tradeYourBlook").value;

  if (!yourBlookName || !inventory[yourBlookName]) {
    alert("You need a tradable blook to trade.");
    return;
  }

  const yourBlook = inventory[yourBlookName];

  if (yourBlook.tradable === false) {
    alert("That blook cannot be traded.");
    return;
  }

  const botOffer = getBotOffer(yourBlook);

  if (!botOffer || botOffer.length === 0) {
    alert("The bot could not make a trade offer.");
    return;
  }

  currentTrade = {
    yourBlookName: yourBlook.name,
    botBlooks: botOffer
  };

  showTradeOffer(yourBlook, botOffer);
};

function getBotOffer(yourBlook) {
  const tradeablePool = getTradeableBlookPool();

  const sameRarityOptions = tradeablePool.filter(
    b => b.rarity === yourBlook.rarity && b.name !== yourBlook.name
  );

  const lower = lowerRarity(yourBlook.rarity);
  const lowerRarityOptions = lower
    ? tradeablePool.filter(b => b.rarity === lower)
    : [];

  const useSameRarity = Math.random() < 0.55 || lowerRarityOptions.length === 0;

  if (useSameRarity && sameRarityOptions.length > 0) {
    return [randomFromArray(sameRarityOptions)];
  }

  if (lowerRarityOptions.length > 0) {
    return pickTwoBlooks(lowerRarityOptions);
  }

  if (sameRarityOptions.length > 0) {
    return [randomFromArray(sameRarityOptions)];
  }

  return [];
}

function pickTwoBlooks(array) {
  if (array.length === 1) {
    return [array[0], array[0]];
  }

  const first = randomFromArray(array);
  let second = randomFromArray(array);

  while (second.name === first.name && array.length > 1) {
    second = randomFromArray(array);
  }

  return [first, second];
}

function showTradeOffer(yourBlook, botBlooks) {
  const tradeOffer = document.getElementById("tradeOffer");
  tradeOffer.classList.remove("hidden");

  const botCards = botBlooks.map(blook => `
    <div class="trade-mini-card">
      <p>Bot Gives</p>
      <div class="icon">${blook.icon}</div>
      <h3>${blook.name}</h3>
      <span class="rarity ${blook.rarity}">${rarityName(blook.rarity)}</span>
    </div>
  `).join("");

  tradeOffer.innerHTML = `
    <div class="trade-columns">
      <div class="trade-mini-card">
        <p>You Give</p>
        <div class="icon">${yourBlook.icon}</div>
        <h3>${yourBlook.name}</h3>
        <span class="rarity ${yourBlook.rarity}">${rarityName(yourBlook.rarity)}</span>
      </div>
      <div>${botCards}</div>
    </div>
    <div class="trade-buttons">
      <button class="accept" onclick="acceptTrade()">Accept Trade</button>
      <button class="decline" onclick="declineTrade()">Decline</button>
    </div>
  `;
}

function acceptTrade() {
  if (!currentTrade) return;

  const yourBlookName = currentTrade.yourBlookName;
  const botBlooks = currentTrade.botBlooks;

  if (!inventory[yourBlookName]) {
    alert("You do not have that blook anymore.");
    return;
  }

  if (inventory[yourBlookName].tradable === false) {
    alert("That blook cannot be traded.");
    return;
  }

  removeBlook(yourBlookName);

  botBlooks.forEach(blook => addBlook(blook));

  currentTrade = null;

  saveGame();
  renderInventory();
  updateTradeDropdown();

  const receivedNames = botBlooks
    .map(blook => `${blook.icon} ${blook.name}`)
    .join(" and ");

  document.getElementById("tradeOffer").innerHTML = `
    <h3>Trade accepted!</h3>
    <p>You got <strong>${receivedNames}</strong>.</p>
  `;
}

function declineTrade() {
  currentTrade = null;

  document.getElementById("tradeOffer").innerHTML = `
    <h3>Trade declined.</h3>
    <p>The bot left. Make another offer whenever you want.</p>
  `;
}

function setupAdminPanel() {
  const select = document.getElementById("adminBlookSelect");
  select.innerHTML = "";

  blooks.forEach(blook => {
    const option = document.createElement("option");
    option.value = blook.name;
    option.textContent = `${blook.icon} ${blook.name} - ${rarityName(blook.rarity)}`;
    select.appendChild(option);
  });
}

document.getElementById("giveTokensBtn").onclick = () => {
  const amount = Number(document.getElementById("adminTokens").value);

  if (!amount || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  tokens += amount;

  saveGame();
  updateTokens();
  renderPacks();
  renderBazaar();
  renderBackgroundShop();

  alert(`You added ${amount.toLocaleString()} tokens.`);
};

document.getElementById("setTokensBtn").onclick = () => {
  const amount = Number(document.getElementById("adminTokens").value);

  if (amount < 0 || Number.isNaN(amount)) {
    alert("Enter a valid amount.");
    return;
  }

  tokens = amount;

  saveGame();
  updateTokens();
  renderPacks();
  renderBazaar();
  renderBackgroundShop();

  alert(`Your tokens are now set to ${amount.toLocaleString()}.`);
};

document.getElementById("giveBlookBtn").onclick = () => {
  const selectedName = document.getElementById("adminBlookSelect").value;
  const blook = blooks.find(item => item.name === selectedName);

  if (!blook) return;

  addBlook(blook);

  saveGame();
  renderInventory();
  updateTradeDropdown();

  alert(`You gave yourself ${blook.name}.`);
};

document.getElementById("unlockAllBtn").onclick = () => {
  blooks.forEach(blook => addBlook(blook));

  saveGame();
  renderInventory();
  updateTradeDropdown();

  alert("All blooks unlocked!");
};

document.getElementById("resetBtn").onclick = () => {
  const confirmReset = confirm("Are you sure you want to reset everything?");

  if (!confirmReset) return;

  tokens = 0;
  inventory = {};
  bazaarListings = [];
  currentTrade = null;
  inventoryView = "normal";
  bazaarSortMode = "default";
  inventorySortMode = "rarityHigh";
  ownedBackgrounds = ["default"];
  equippedBackground = "default";
  limitedChromaStartDate = new Date().toISOString().slice(0, 10);
  limitedChromaDailyRates = {};

  saveGame();
  applyBackground();

  updateTokens();

  document.getElementById("normalInventoryBtn").classList.add("active");
  document.getElementById("limitedInventoryBtn").classList.remove("active");
  document.getElementById("bazaarSort").value = "default";
  document.getElementById("inventorySort").value = "rarityHigh";

  renderPacks();
  renderInventory();
  generateBazaarListings();
  renderBazaar();
  renderBackgroundShop();
  updateTradeDropdown();

  const tradeOffer = document.getElementById("tradeOffer");
  if (tradeOffer) {
    tradeOffer.classList.add("hidden");
    tradeOffer.innerHTML = "";
  }

  alert("Save reset.");
};

const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    tab.classList.add("active");

    const pageId = tab.dataset.tab;
    document.getElementById(pageId).classList.add("active");

    if (pageId === "packs") renderPacks();
    if (pageId === "inventory") renderInventory();
    if (pageId === "trading") updateTradeDropdown();
    if (pageId === "bazaar") renderBazaar();
    if (pageId === "backgrounds") renderBackgroundShop();
  };
});

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray(array) {
  const index = randomNumber(0, array.length - 1);
  return array[index];
}

normalizeInventory();

if (bazaarListings.length === 0) {
  generateBazaarListings();
}

document.getElementById("bazaarSort").value = bazaarSortMode;
document.getElementById("inventorySort").value = inventorySortMode;

applyBackground();
updateTokens();
loadQuestion();
renderPacks();
renderInventory();
renderBazaar();
renderBackgroundShop();
setupAdminPanel();
updateTradeDropdown();