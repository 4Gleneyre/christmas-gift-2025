const images = [
  "images/Screenshot_1.png",
  "images/Screenshot_2.png",
  "images/Screenshot_3.png",
  "images/Screenshot_4.png",
  "images/Screenshot_5.png",
  "images/Screenshot_6.png",
  "images/Screenshot_7.png",
  "images/Screenshot_8.png",
];

const board = document.getElementById("board");
const statusText = document.getElementById("statusText");
const resetButton = document.getElementById("resetButton");
const cardSection = document.getElementById("card");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

const PAIRS_TOTAL = images.length;

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const updateStatus = () => {
  const label =
    matches === PAIRS_TOTAL
      ? `${matches} / ${PAIRS_TOTAL} pairs found - card unlocked`
      : `${matches} / ${PAIRS_TOTAL} pairs found`;
  statusText.textContent = label;
};

const resetSelection = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};

const unlockCard = () => {
  cardSection.classList.remove("locked");
  cardSection.classList.add("unlocked");
};

const handleMatch = () => {
  matches += 1;
  updateStatus();
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetSelection();

  if (matches === PAIRS_TOTAL) {
    unlockCard();
  }
};

const handleMismatch = () => {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetSelection();
  }, 850);
};

const handleCardClick = (event) => {
  const card = event.currentTarget;
  if (lockBoard || card.classList.contains("flipped")) {
    return;
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  if (firstCard.dataset.match === secondCard.dataset.match) {
    handleMatch();
  } else {
    handleMismatch();
  }
};

const buildBoard = () => {
  matches = 0;
  updateStatus();
  resetSelection();
  board.innerHTML = "";

  cardSection.classList.remove("unlocked");
  cardSection.classList.add("locked");

  const deck = shuffle([...images, ...images]).map((src, index) => ({
    id: `${src}-${index}`,
    match: src,
    src,
  }));

  deck.forEach((cardData) => {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.dataset.match = cardData.match;
    card.setAttribute("aria-label", "Hidden card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <img src="${cardData.src}" alt="Matching card image" loading="lazy" />
        </div>
      </div>
    `;
    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
  });
};

resetButton.addEventListener("click", buildBoard);
buildBoard();
