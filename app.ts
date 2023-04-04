const dice1 = document.getElementById("dice1")!;
const dice2 = document.getElementById("dice2")!;
const rollButton = document.getElementById("rollButton")! as HTMLButtonElement;
const sumButton = document.getElementById("sumButton")! as HTMLButtonElement;
const diceButton = document.getElementById("diceButton")! as HTMLButtonElement;
const resetButton = document.getElementById(
  "resetButton"
)! as HTMLButtonElement;
const chooseButtons = document.getElementById("chooseButtons")!;
const numbersContainer = document.getElementById("numbers-container")!;
const winModalTitle = document.getElementById("modalTitle")!;
const winModalText = document.getElementById("modalText")!;
const winOverlay = document.getElementById("overlay")!;

let dice1roll = 1;
let dice2roll = 1;
let numRolls = 0;

const numbersToAcchieve = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
let achievedNumbers: number[] = [];

function checkIfSetAndListIsIdentical(a: Set<number>, b: number[]) {
  return a.size === b.length && [...a].every((value) => b.includes(value));
}

function checkWin() {
  if (checkIfSetAndListIsIdentical(numbersToAcchieve, achievedNumbers)) {
    openPopup("Gratulerer!", `Jolven gikk opp og du brukte ${numRolls} kast!`);
    resetGame();
  }
}

function isLoss(current: number[], goal: Set<number>) {
  return (
    new Set(current).size !== current.length ||
    Math.max(...current) > Math.max(...goal)
  );
}

function resetGame() {
  dice1.innerText = "⚅";
  dice2.innerText = "⚅";
  numRolls = 0;

  const numberElements = numbersContainer.children;

  for (let i = numberElements.length - 1; i >= 0; i--) {
    const numberElement = numberElements[i];
    numberElement.classList.add("missing");
  }
  achievedNumbers = [];
  chooseButtons.classList.add("hidden");
  rollButton.classList.remove("hidden");
  resetButton.classList.add("hidden");
}

function updateNumbersContainer() {
  const numberElements = numbersContainer.children;

  for (let i = 0; i < numberElements.length; i++) {
    const numberElement = numberElements[i] as HTMLElement;

    if (achievedNumbers.includes(Number(numberElement.innerText))) {
      numberElement.classList.remove("missing");
    } else {
      numberElement.classList.add("missing");
    }
  }
}

function openPopup(title: string, text: string) {
  winModalTitle.textContent = title;
  winModalText.textContent = text;
  winOverlay.style.display = "flex";
}

function closePopup() {
  winOverlay.style.display = "none";
}

function addEachToAcchievedNumbers(numbers: number[]) {
  numbers.forEach((number: number) => {
    achievedNumbers.push(number);
  });
  updateNumbersContainer();
  checkWin();
  chooseButtons.classList.add("hidden");
  rollButton.classList.remove("hidden");
}

sumButton.addEventListener("click", () => {
  addEachToAcchievedNumbers([Number(dice1roll) + Number(dice2roll)]);
});

diceButton.addEventListener("click", () => {
  addEachToAcchievedNumbers([Number(dice1roll), Number(dice2roll)]);
});

rollButton.addEventListener("click", () => {
  dice1roll = Math.floor(Math.random() * 6) + 1;
  dice2roll = Math.floor(Math.random() * 6) + 1;
  numRolls += 1;
  dice1.innerText = numberToDiceImage(dice1roll);
  dice2.innerText = numberToDiceImage(dice2roll);
  // Display choosebuttons
  chooseButtons.classList.remove("hidden");
  rollButton.classList.add("hidden");

  const isSumResultLoss = isLoss(
    [...achievedNumbers, dice1roll + dice2roll],
    numbersToAcchieve
  );

  const isDiceResultLoss = isLoss(
    [...achievedNumbers, dice1roll, dice2roll],
    numbersToAcchieve
  );
  sumButton.disabled = isSumResultLoss;
  diceButton.disabled = isDiceResultLoss;

  if (isSumResultLoss && isDiceResultLoss) {
    resetButton.classList.remove("hidden");
  }
});

resetButton.addEventListener("click", () => {
  resetGame();
});

function numberToDiceImage(number: number) {
  switch (number) {
    case 1:
      return "⚀";
    case 2:
      return "⚁";
    case 3:
      return "⚂";
    case 4:
      return "⚃";
    case 5:
      return "⚄";
    case 6:
      return "⚅";
    default:
      return number.toString();
  }
}
