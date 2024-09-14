// unordered list of player’s guessed letters 
const guessedLettersElement = document.querySelector(".guessed-letters");
//  submit button for guessed letter
const guessLetterButton = document.querySelector(".guess");
// text input - where the player will guess a letter
const letterInput = document.querySelector(".letter");
// wordInProgress shows the status of the letters guessed
const wordInProgress = document.querySelector(".word-in-progress");
// paragraph where the # of remaining guesses will display
const remainingGuessesElement = document.querySelector(".remaining");
// the text in the <span> portion of the paragraph where the # of remaining guesses will display
const remainingGuessesSpan = document.querySelector(".remaining span");
// empty paragraph for messages to appear when the player guesses a letter
const message = document.querySelector(".message");
// hidden button that will appear at the end, prompting the player to play again 
const playAgainButton = document.querySelector(".play-again");

// these are all variables and will change often - so not consts
let word = "magnolia";
let guessedLetters = [];  // will hold all the letters a player guessed
let remainingGuesses = 8;  // number of remaining guesses. Set to max -> 8. 

// Gets a random word from a text file. The list of words needs to be converted to an array so a 
// random one can be retrieved. 
const getWord = async function () {
  const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
  const words = await response.text();  // specifies using a .text file not .json
  const wordArray = words.split("\n");  // convert fetched data, which is separated by '\n'(newline)) into an arrray
  const randomIndex = Math.floor(Math.random() * wordArray.length); // gets a random index to pull from the arrray
  word = wordArray[randomIndex].trim(); // removes any whitespace from around the word retrieved
  placeholder(word);
};

// Fires off the game 
getWord();

// Determines the correct number of symbols(dots) as placeholders for the word's letters
const placeholder = function (word) {
  const placeholderLetters = [];
  for (const letter of word) {
    // console.log(letter);
    placeholderLetters.push("●"); // pushes a symbol for each letter of the word
  }
  wordInProgress.innerText = placeholderLetters.join(""); // converts the array to a string
};

// Listens for "guess" button to be clicked with an eventListener
guessLetterButton.addEventListener("click", function (e) {
  //To prevent the default preloading behavior of clicking a button, 
  // the form submitting, and then reloading the page, use preventDefault() 
  e.preventDefault();
  // Clear the message paragraph
  message.innerText = "";
  // Grab the input value
  const letter = letterInput.value;
  // Make sure that it is a single letter
  const goodGuess = validateInput(letter);

  // if a single letter was entered...
  if (goodGuess) {
    // check to see if the letter exists in the word
    checkGuess(letter);
  }
  // clear the letter input
  letterInput.value = "";
});

// Validate that the input was a single letter
const validateInput = function (input) {
  // make this = to only valid input values
  const acceptedLetter = /[a-zA-Z]/;  // regular expression
    // check if input was empty
  if (input.length === 0) {
    message.innerText = "Please enter a letter.";
  } else if (input.length > 1) {
    // check if more than one value was entered
    message.innerText = "Please enter a single letter.";
  } else if (!input.match(acceptedLetter)) {
    // check if a number, a special character or some other non letter value was entered - it's invalid
    message.innerText = "Please enter a letter from A to Z.";
  } else {
    // Got a single letter, all good - send it back.
    return input;
  }
};

// Check the letter that was entered to see if it  has already been selected and post a message OR
// if it is in the word  
const checkGuess = function (guess) {
  guess = guess.toUpperCase();
  if (guessedLetters.includes(guess)) {
    // update message to inform player letter was already picked
    message.innerText = "You already guessed that letter, silly. Try again.";
  } else {
    // push the letter onto the stack of guessed letters
    guessedLetters.push(guess);
    // log out the array of guessed letters
    console.log(guessedLetters);
    // update number of guesses remaining
    updateRemainingGuesses(guess);
    // display newly guessed letter with the displayed letters
    showGuessedLetters();
    // update the word being guessed with the new letter
    updateWordInProgress(guessedLetters);
  }
};

// Builds the list of guessed letters
const showGuessedLetters = function () {
  // Clear the list first
  guessedLettersElement.innerHTML = "";
  // recreate the lsit of guessed letters
  for (const letter of guessedLetters) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLettersElement.append(li);
  }
};

// In general, this function updates the word being guessed with the new letter 
// if there is a match. 
// More specifically, this function goes through the retrieved word and checks each 
// letter to see if it is one of the guessed letters. If it is, the letter from 
// the word is pushed into the revealed array which is then displayed on the screen. 
// If the letter in the word is not one of the guessed letters, then a symbol 
// is pushed into the array. After the whole word has been checked, the 
// revealed word is displayed with symbols for letters that have not been guessed yet. 
const updateWordInProgress = function (guessedLetters) {
  // converts the word to uppercase to match the case of the guess
  const wordUpper = word.toUpperCase(); 
  console.log("wordUpper=");
  console.log(wordUpper); //WORKER
   // Splits up the letters of the word into an array of the letters
  const wordArray = wordUpper.split("");
  console.log("wordArray=");
  console.log(wordArray); // ['W', 'O', 'R', 'K', 'E', 'R']
  const revealWord = []; // what will be displayed
  // populates what will be displayed based on the letters that have been guessed
  for (const letter of wordArray) {
    // if the letter in the word matches one of the guessed letters
    if (guessedLetters.includes(letter)) {
      // push the letter in the word
      revealWord.push(letter.toUpperCase());
    } else {
      // otherwise push the symbol
      revealWord.push("●");
    }
  }
  console.log("The revealedWord is: ")
  console.log(revealWord); // an array
  // converts the array of letters back to a string
  wordInProgress.innerText = revealWord.join("");
  // check to see if all the letters have been guessed
  checkIfWin();
};

// Counts and updates the number of remaining guesses
// Find out if the word contains the guess. If it doesn’t include the letter from guess, 
// lets the player know that the word doesn’t contain the letter and subtracts 1 from 
// the remainingGuesses. If it does contain a letter, lets the player know the letter is in the word.
const updateRemainingGuesses = function (guess) {
  const upperWord = word.toUpperCase();
  if (!upperWord.includes(guess)) {
    // womp womp - bad guess, lose a chance
    message.innerText = `Sorry, the word has no ${guess}.`;
    remainingGuesses -= 1;
  } else {
    message.innerText = `Good guess! The word has the letter ${guess}.`;
  }

  // Determine if the player has any guesses left. If zero, diplsay the game over message 
  // set the siplay to the end of game setup(change buttons and messages) 
  if (remainingGuesses === 0) {
    message.innerHTML = `Game over. The word was <span class="highlight">${word}</span>.`;
    gameOver();
  } else if (remainingGuesses === 1) {
    remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
  } else {
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  }
};

 // checks to see if all the letters have been guessed
const checkIfWin = function () {
  if (word.toUpperCase() === wordInProgress.innerText) {
    // Changes the  message that displays when all the letters hhave been guessed
    message.classList.add("win");
    message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
    gameOver();
  }
};

// Set the UI elements to end of game status and shows the "Play Again!" button"
const gameOver = function () {
  guessLetterButton.classList.add("hide");
  remainingGuessesElement.classList.add("hide");
  guessedLettersElement.classList.add("hide");
  playAgainButton.classList.remove("hide");
};

// When the Play Again! button is clicked this resets everything to start up again
playAgainButton.addEventListener("click", function () {
  // reset all original values - grab new word
  message.classList.remove("win");
  guessedLetters = [];
  remainingGuesses = 8;
  remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  guessedLettersElement.innerHTML = "";
  message.innerText = "";
  // Grab a new word
  getWord();

  // reset the  UI elements to start over
  guessLetterButton.classList.remove("hide");
  playAgainButton.classList.add("hide");
  remainingGuessesElement.classList.remove("hide");
  guessedLettersElement.classList.remove("hide");
});
