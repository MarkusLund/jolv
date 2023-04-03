const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const rollButton = document.getElementById("roll");
const sumButton = document.getElementById("sum");
const chooseButtons = document.getElementById("chooseButtons");
const diceButton = document.getElementById("dice");
const numbersContainer = document.getElementById("numbers-container");
let dice1roll = 1;
let dice2roll = 1;
const numbersToAcchieve = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
let achievedNumbers = [];
function checkIfSetAndListIsIdentical(a, b) {
    return a.size === b.length && [...a].every((value) => b.includes(value));
}
function checkWin() {
    if (checkIfSetAndListIsIdentical(numbersToAcchieve, achievedNumbers)) {
        alert("Gratulerer, du vant!");
        // achievedNumbers.clear();
        dice1.innerText = "";
        dice2.innerText = "";
        const numberElements = numbersContainer.children;
        for (let i = numberElements.length - 1; i >= 0; i--) {
            const numberElement = numberElements[i];
            numberElement.classList.add("missing");
        }
    }
}
function checkLoss() {
    if (new Set(achievedNumbers).size !== achievedNumbers.length ||
        Math.max(...achievedNumbers) > Math.max(...numbersToAcchieve)) {
        alert("Auda, prøv igjen! 😄");
        resetGame();
    }
}
function resetGame() {
    dice1.innerText = "⚅";
    dice2.innerText = "⚅";
    const numberElements = numbersContainer.children;
    for (let i = numberElements.length - 1; i >= 0; i--) {
        const numberElement = numberElements[i];
        numberElement.classList.add("missing");
    }
    achievedNumbers = [];
}
function updateNumbersContainer() {
    const numberElements = numbersContainer.children;
    for (let i = 0; i < numberElements.length; i++) {
        const numberElement = numberElements[i];
        if (achievedNumbers.includes(Number(numberElement.innerText))) {
            numberElement.classList.remove("missing");
        }
        else {
            numberElement.classList.add("missing");
        }
    }
}
function addEachToAcchievedNumbers(numbers) {
    numbers.forEach((number) => {
        achievedNumbers.push(number);
    });
    updateNumbersContainer();
    checkLoss();
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
    dice1.innerText = numberToDiceImage(dice1roll);
    dice2.innerText = numberToDiceImage(dice2roll);
    // Display choosebuttons
    chooseButtons.classList.remove("hidden");
    rollButton.classList.add("hidden");
});
function numberToDiceImage(number) {
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
