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
let tokenMultiplierBought = JSON.parse(localStorage.getItem("tokenMultiplierBought")) || false;

const TOKEN_MULTIPLIER_COST = 5000;

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
  localStorage.setItem("tokenMultiplierBought", JSON.stringify(tokenMultiplierBought));
}

function updateTokens() {
  document.getElementById("tokenCount").textContent = Math.floor(tokens).toLocaleString();
  renderTokenMultiplierUpgrade();
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

    if (tokenMultiplierBought) {
      earned *= 2;
    }

    tokens += earned;

    if (tokenMultiplierBought) {
      resultText.textContent = `Correct! 2x boost active — you earned ${earned} tokens.`;
    } else {
      resultText.textContent = `Correct! You earned ${earned} tokens.`;
    }

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

function renderTokenMultiplierUpgrade() {
  const button = document.getElementById("tokenMultiplierBtn");

  if (!button) return;

  if (tokenMultiplierBought) {
    button.textContent = "2x Tokens Active";
    button.disabled = true;
    return;
  }

  button.textContent = `Buy 2x Tokens — ${TOKEN_MULTIPLIER_COST.toLocaleString()}`;

  if (tokens < TOKEN_MULTIPLIER_COST) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}

document.getElementById("tokenMultiplierBtn").onclick = () => {
  if (tokenMultiplierBought) return;

  if (tokens < TOKEN_MULTIPLIER_COST) {
    alert(`You need ${TOKEN_MULTIPLIER_COST.toLocaleString()} tokens to buy the 2x boost.`);
    return;
  }

  const confirmBuy = confirm(`Buy permanent 2x token intake for ${TOKEN_MULTIPLIER_COST.toLocaleString()} tokens?`);

  if (!confirmBuy) return;

  tokens -= TOKEN_MULTIPLIER_COST;
  tokenMultiplierBought = true;

  saveGame();
  updateTokens();
  renderPacks();
  renderBazaar();
  renderBackgroundShop();

  alert("Permanent 2x token intake unlocked!");
};

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
  { name: "Lovely Bouquet", icon: "💐", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Meadow Pack" },

  { name: "Inferno Mask", icon: "🎭", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Volcano Pack" },
  { name: "Mystical Oasis", icon: "🏝️", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Desert Pack" },
  { name: "Galactic Telescope", icon: "🔭", rarity: "mystical", sell: 8000, tradable: true, exclusivePack: "Space Pack" },

  { name: "Ash Beetle", icon: "🪲", rarity: "common", sell: 16, tradable: true, exclusivePack: "Volcano Pack" },
  { name: "Lava Crab", icon: "🦀", rarity: "uncommon", sell: 38, tradable: true, exclusivePack: "Volcano Pack" },
  { name: "Ember Rex", icon: "🦖", rarity: "rare", sell: 115, tradable: true, exclusivePack: "Volcano Pack" },
  { name: "Obsidian Ape", icon: "🦍", rarity: "epic", sell: 260, tradable: true, exclusivePack: "Volcano Pack" },
  { name: "Magma Comet", icon: "☄️", rarity: "legendary", sell: 900, tradable: true, exclusivePack: "Volcano Pack" },
  { name: "Chroma Ember Eye", icon: "🧿", rarity: "mythic", sell: 3300, tradable: true, exclusivePack: "Volcano Pack" },

  { name: "Dune Camel", icon: "🐫", rarity: "common", sell: 16, tradable: true, exclusivePack: "Desert Pack" },
  { name: "Sand Viper", icon: "🐍", rarity: "uncommon", sell: 38, tradable: true, exclusivePack: "Desert Pack" },
  { name: "Blooming Cactus", icon: "🌵", rarity: "rare", sell: 115, tradable: true, exclusivePack: "Desert Pack" },
  { name: "Mesa Llama", icon: "🦙", rarity: "epic", sell: 260, tradable: true, exclusivePack: "Desert Pack" },
  { name: "Ancient Vase", icon: "🏺", rarity: "legendary", sell: 900, tradable: true, exclusivePack: "Desert Pack" },
  { name: "Chroma Mirage", icon: "🪞", rarity: "mythic", sell: 3300, tradable: true, exclusivePack: "Desert Pack" },

  { name: "Orbit Satellite", icon: "🛰️", rarity: "common", sell: 16, tradable: true, exclusivePack: "Space Pack" },
  { name: "Tiny Alien", icon: "👽", rarity: "uncommon", sell: 38, tradable: true, exclusivePack: "Space Pack" },
  { name: "Cosmic Robot", icon: "🤖", rarity: "rare", sell: 115, tradable: true, exclusivePack: "Space Pack" },
  { name: "Star Explorer", icon: "🧑‍🚀", rarity: "epic", sell: 260, tradable: true, exclusivePack: "Space Pack" },
  { name: "Supernova Burst", icon: "💥", rarity: "legendary", sell: 900, tradable: true, exclusivePack: "Space Pack" },
  { name: "Chroma UFO", icon: "🛸", rarity: "mythic", sell: 3300, tradable: true, exclusivePack: "Space Pack" },

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
    odds: MYSTICAL_ODDS,
    mystical: true,
    description: "A soft meadow pack with lucky blooks, peaceful creatures, chromas, and the ultra-rare Mystical Lovely Bouquet.",
    emojis: ["🦔", "🐸", "🦎", "🦄", "🐺", "🍄", "💐"]
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
    name: "Volcano Pack",
    icon: "🌋",
    price: 250,
    odds: MYSTICAL_ODDS,
    mystical: true,
    description: "A fiery pack with lava creatures, chromas, and the ultra-rare Mystical Inferno Mask.",
    emojis: ["🪲", "🦀", "🦖", "🦍", "☄️", "🧿", "🎭"]
  },
  {
    name: "Desert Pack",
    icon: "🏜️",
    price: 250,
    odds: MYSTICAL_ODDS,
    mystical: true,
    description: "A sandy desert pack with ancient treasures, chromas, and the ultra-rare Mystical Oasis.",
    emojis: ["🐫", "🐍", "🌵", "🦙", "🏺", "🪞", "🏝️"]
  },
  {
    name: "Space Pack",
    icon: "🚀",
    price: 250,
    odds: MYSTICAL_ODDS,
    mystical: true,
    description: "A cosmic pack with space blooks, chromas, and the ultra-rare Galactic Telescope.",
    emojis: ["🛰️", "👽", "🤖", "🧑‍🚀", "💥", "🛸", "🔭"]
  },
  {
    name: "Easter Blossom Pack",
    icon: "🐰",
    price: 350,
    odds: STANDARD_ODDS,
    limited: true,
    archived: true,
    description: "An archived Easter pack with Easter-themed blooks. This pack is no longer purchasable.",
    emojis: ["🐣", "🥚", "🌷", "🌸", "🐝", "🥕", "🧺", "🍬", "🌼", "🦋", "🐑", "🪽", "💐", "🐰"]
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
    return Math.max(45000, sell * randomNumber(12, 20));
  }

  if (blook.rarity === "mythic") {
    return Math.max(18000, sell * randomNumber(7, 12));
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

function getBazaarPool() {
  return blooks.filter(blook => blook.tradable !== false && !blook.limited);
}

function generateBazaarListings() {
  const pool = getBazaarPool();
  bazaarListings = [];

  for (let i = 0; i < 8; i++) {
    const blook = randomFromArray(pool);

    bazaarListings.push({
      id: Date.now() + i + randomNumber(1, 99999),
      blookName: blook.name,
      seller: randomSellerName(),
      price: getBazaarPrice(blook)
    });
  }

  saveGame();
}

document.getElementById("refreshBazaarBtn").onclick = () => {
  const confirmRefresh = confirm("Refresh the Bazaar? Current listings will be replaced.");

  if (!confirmRefresh) return;

  generateBazaarListings();
  renderBazaar();
};

document.getElementById("bazaarSort").onchange = event => {
  bazaarSortMode = event.target.value;
  saveGame();
  renderBazaar();
};

function sortBazaarListings(listings) {
  const sorted = [...listings];

  if (bazaarSortMode === "rarityHigh") {
    sorted.sort((a, b) => rarityValue(getBlookByName(b.blookName).rarity) - rarityValue(getBlookByName(a.blookName).rarity));
  }

  if (bazaarSortMode === "rarityLow") {
    sorted.sort((a, b) => rarityValue(getBlookByName(a.blookName).rarity) - rarityValue(getBlookByName(b.blookName).rarity));
  }

  if (bazaarSortMode === "priceHigh") {
    sorted.sort((a, b) => b.price - a.price);
  }

  if (bazaarSortMode === "priceLow") {
    sorted.sort((a, b) => a.price - b.price);
  }

  return sorted;
}

function renderBazaar() {
  const bazaarGrid = document.getElementById("bazaarGrid");
  bazaarGrid.innerHTML = "";

  document.getElementById("bazaarSort").value = bazaarSortMode;

  if (bazaarListings.length === 0) {
    generateBazaarListings();
  }

  const sortedListings = sortBazaarListings(bazaarListings);

  sortedListings.forEach(listing => {
    const blook = getBlookByName(listing.blookName);
    if (!blook) return;

    let specialClass = "";
    if (blook.rarity === "legendary") specialClass = "legendary-card";
    if (blook.rarity === "mythic") specialClass = "mythic-card";
    if (blook.rarity === "mystical") specialClass = "mystical-card";

    const card = document.createElement("div");
    card.className = `bazaar-card ${specialClass}`;

    card.innerHTML = `
      <div class="bazaar-icon">${blook.icon}</div>
      <h3>${blook.name}</h3>
      <p class="seller-name">Seller: ${listing.seller}</p>
      <span class="rarity ${blook.rarity}">${rarityName(blook.rarity)}</span>
      <p class="price-tag">${listing.price.toLocaleString()} tokens</p>
      <button class="buy-btn" ${tokens < listing.price ? "disabled" : ""}>Buy</button>
    `;

    card.querySelector(".buy-btn").onclick = () => buyBazaarListing(listing.id);

    bazaarGrid.appendChild(card);
  });
}

function buyBazaarListing(listingId) {
  const listing = bazaarListings.find(item => item.id === listingId);

  if (!listing) return;

  if (tokens < listing.price) {
    alert("Not enough tokens!");
    return;
  }

  const blook = getBlookByName(listing.blookName);

  tokens -= listing.price;
  addBlook(blook);

  bazaarListings = bazaarListings.filter(item => item.id !== listingId);

  saveGame();
  updateTokens();
  renderBazaar();
  renderInventory();
  renderPacks();
  renderBackgroundShop();
}

function getBlookByName(name) {
  return blooks.find(blook => blook.name === name);
}

function renderBackgroundShop() {
  const backgroundGrid = document.getElementById("backgroundGrid");
  backgroundGrid.innerHTML = "";

  backgrounds.forEach(background => {
    const owned = ownedBackgrounds.includes(background.id);
    const equipped = equippedBackground === background.id;

    const card = document.createElement("div");
    card.className = "background-card";

    let buttonText = "Buy";
    if (owned) buttonText = "Equip";
    if (equipped) buttonText = "Equipped";

    card.innerHTML = `
      <div class="background-preview ${background.preview}"></div>
      <h3>${background.name}</h3>
      <p class="count">${background.price.toLocaleString()} tokens</p>
      <button class="background-btn" ${equipped || (!owned && tokens < background.price) ? "disabled" : ""}>${buttonText}</button>
    `;

    card.querySelector(".background-btn").onclick = () => buyOrEquipBackground(background.id);

    backgroundGrid.appendChild(card);
  });
}

function buyOrEquipBackground(backgroundId) {
  const background = backgrounds.find(item => item.id === backgroundId);

  if (!background) return;

  if (!ownedBackgrounds.includes(backgroundId)) {
    if (tokens < background.price) {
      alert("Not enough tokens!");
      return;
    }

    tokens -= background.price;
    ownedBackgrounds.push(backgroundId);
  }

  equippedBackground = backgroundId;

  saveGame();
  applyBackground();
  updateTokens();
  renderBackgroundShop();
  renderPacks();
  renderBazaar();
}

function applyBackground() {
  const adminIsOpen = document.getElementById("admin")?.classList.contains("active");

  document.body.className = "";
  document.body.classList.add(`bg-${equippedBackground}`);

  if (adminIsOpen) {
    document.body.classList.add("admin-unlocked");
  }
}

function showUnboxing(wonBlooks) {
  const modal = document.getElementById("unboxModal");
  const unboxName = document.getElementById("unboxName");
  const unboxRarity = document.getElementById("unboxRarity");
  const unboxList = document.getElementById("unboxList");

  modal.classList.remove("hidden");

  if (wonBlooks.length === 1) {
    const blook = wonBlooks[0];
    unboxName.textContent = `${blook.icon} ${blook.name}`;
    unboxRarity.textContent = rarityName(blook.rarity);
  } else {
    unboxName.textContent = `Opened ${wonBlooks.length} Packs!`;
    unboxRarity.textContent = "Here is what you got:";
  }

  unboxList.innerHTML = "";

  wonBlooks.forEach(blook => {
    const item = document.createElement("div");
    item.className = "unbox-item";

    item.innerHTML = `
      <div class="unbox-left">
        <span class="unbox-icon">${blook.icon}</span>
        <div>
          <strong>${blook.name}</strong>
          <p>${rarityName(blook.rarity)}</p>
        </div>
      </div>
      <span class="rarity ${blook.rarity}">${rarityName(blook.rarity)}</span>
    `;

    unboxList.appendChild(item);
  });
}

document.getElementById("closeModalBtn").onclick = () => {
  document.getElementById("unboxModal").classList.add("hidden");
};

function getTradeableBlookPool() {
  return blooks.filter(blook => blook.tradable !== false && !blook.limited);
}

function getTradeableInventoryItems() {
  return Object.values(inventory).filter(blook => blook.tradable !== false && !blook.limited && blook.count > 0);
}

function updateTradeDropdown() {
  const tradeSelect = document.getElementById("tradeYourBlook");
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

  const archivedPackSelect = document.getElementById("adminArchivedPackSelect");
  archivedPackSelect.innerHTML = "";

  packs
    .filter(pack => pack.archived)
    .forEach(pack => {
      const option = document.createElement("option");
      option.value = pack.name;
      option.textContent = `${pack.icon} ${pack.name}`;
      archivedPackSelect.appendChild(option);
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

function openAdminArchivedPack(pack, quantity = 1) {
  const wonBlooks = [];

  for (let i = 0; i < quantity; i++) {
    const wonBlook = getRandomBlookFromPack(pack);
    addBlook(wonBlook);
    wonBlooks.push(wonBlook);
  }

  saveGame();
  renderInventory();
  renderBazaar();
  updateTradeDropdown();
  showUnboxing(wonBlooks);
}

document.getElementById("openAdminArchivedPackBtn").onclick = () => {
  const selectedPackName = document.getElementById("adminArchivedPackSelect").value;
  const pack = packs.find(item => item.name === selectedPackName);
  const quantityInput = document.getElementById("adminArchivedPackQty");
  const quantity = Math.max(1, Math.min(100, Number(quantityInput.value) || 1));

  if (!pack) return;

  quantityInput.value = quantity;
  openAdminArchivedPack(pack, quantity);
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
  tokenMultiplierBought = false;

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

function openPage(pageId) {
  tabs.forEach(t => t.classList.remove("active"));
  pages.forEach(page => page.classList.remove("active"));

  if (pageId !== "admin") {
    document.body.classList.remove("admin-unlocked");
  }

  const matchingTab = document.querySelector(`.tab[data-tab="${pageId}"]`);

  if (matchingTab) {
    matchingTab.classList.add("active");
  }

  document.getElementById(pageId).classList.add("active");

  if (pageId === "packs") renderPacks();
  if (pageId === "inventory") renderInventory();
  if (pageId === "trading") updateTradeDropdown();
  if (pageId === "bazaar") renderBazaar();
  if (pageId === "backgrounds") renderBackgroundShop();
}

tabs.forEach(tab => {
  tab.onclick = () => openPage(tab.dataset.tab);
});

document.addEventListener("keydown", event => {
  if (event.key !== "\\") return;

  event.preventDefault();

  if (document.body.classList.contains("admin-unlocked")) {
    document.body.classList.remove("admin-unlocked");
    openPage("play");
  } else {
    document.body.classList.add("admin-unlocked");
    setupAdminPanel();
    openPage("admin");
  }
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
renderTokenMultiplierUpgrade();
setupAdminPanel();
updateTradeDropdown();
