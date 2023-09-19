// Get my HTML elements
const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start-btn");
const counterElement = document.getElementById("counter");

// Define the array of card colors
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// My variables
let shuffledColors = shuffle(COLORS);
let timerInterval;
let gameInProgress = false;
let activeCards = [];
let matches = 0;
let score = 0;
let storedLowestScore;
let scoreTime;
let startTime;

// Function to shuffle an array as descibed in (Fisher-Yates algorithm)
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// Create card divs for the given colors, style the border and append the div to the game container.
function createDivsForColors(colorArray) {
  colorArray.forEach((color) => {
    const newDiv = document.createElement("div");
    newDiv.dataset.color = color;
    newDiv.classList.add("card");
    newDiv.style.borderRadius = "10px";
    gameContainer.append(newDiv);
  });
}

// Handle click on a card
function handleCardClick(event) {
  const card = event.target;

  // Check if the game is in progress, the card is not flipped, and there are fewer than 2 active cards
  if (
    gameInProgress &&
    !card.classList.contains("flipped") &&
    activeCards.length < 2
  ) {
    revealCard(card);
    activeCards.push(card);
    card.classList.add("flipped");

    // Check for a match when two cards are open
    if (activeCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

// Reveal the color of a card
function revealCard(card) {
  card.style.backgroundColor = card.dataset.color;
}

// Check if two open cards match
function checkMatch() {
  const [card1, card2] = activeCards;
  if (card1.dataset.color === card2.dataset.color) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matches++;

    // Increment score and display it
    score = score + 100;
    document.getElementById("score").textContent =
      "Score: " + score + " points!";
  } else {
    // If no match, hide the cards after a short delay
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.style.backgroundColor = "";
    card2.style.backgroundColor = "";
  }

  activeCards = [];

  // Check if all matches are found
  if (matches === COLORS.length / 2) {
    clearInterval(timerInterval);
    gameTime();
    updateLocalScore();
    document.getElementById("score").textContent =
      "Congratulations! - Your Score: " + score + " points!";
    gameInProgress = false;
  }
}

// Handle clicks on the game container (event delegation)
gameContainer.addEventListener("click", function (event) {
  if (gameInProgress) {
    handleCardClick(event);
  }
});

// Start the game when the "Start" button is clicked
startButton.addEventListener("click", startGame);

// Start a new game
function startGame() {
  if (!gameInProgress) {
    resetGame();
    createDivsForColors(shuffle(COLORS));
    startTimer();
    gameInProgress = true;
  }
}

// Reset the game state
function resetGame() {
  gameContainer.innerHTML = "";
  activeCards = [];
  matches = 0;
  score = 0;
  clearInterval(timerInterval);
  counterElement.textContent = "00:00";
}

// Start the game timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (!startTime) {
      startTime = performance.now();
    }
    const elapsedTime = performance.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    counterElement.textContent = formattedTime;
  }, 1000);
}

function updateLocalScore() {
  // Get the lowest score from local storage
  storedLowestScore = localStorage.getItem("recordTime");

  // Check if the current score is lower than the stored lowest score (or if there's no stored score yet)
  if (storedLowestScore === null || scoreTime < parseInt(storedLowestScore)) {
    // Update the lowest score with the current score
    localStorage.setItem("recordTime", scoreTime);
  }
}

// Update the displayed lowest score (record)
function getRecord() {
  storedLowestScore = localStorage.getItem("recordTime");
  console.log(storedLowestScore);
  const formattedTime = convertTime(storedLowestScore);
  const lowestScoreElement = document.getElementById("record");
  lowestScoreElement.textContent = `Beat your record: ${
    formattedTime || "N/A"
  }`;
  return formattedTime;
}

// Calculate the time elapsed in seconds
function gameTime() {
  const elapsedTime = performance.now() - startTime;
  scoreTime = Math.floor(elapsedTime / 1000); // Convert elapsed time to seconds
}

// Convert any time in seconds to a user-friendly format
function convertTime(timeToConvert) {
  const minutes = Math.floor(timeToConvert / 60);
  const seconds = timeToConvert % 60;
  const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  return formattedTime;
}

// set Record Time Display
function setRecordTimeDisplay() {
  const recordElement = document.getElementById("record");
  recordElement.textContent = `Beat your record: ${getRecord}`;
}
// Call getRecord when the page loads
window.addEventListener("load", getRecord);
