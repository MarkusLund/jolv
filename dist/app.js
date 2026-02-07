const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const rollButton = document.getElementById("rollButton");
const sumButton = document.getElementById("sumButton");
const diceButton = document.getElementById("diceButton");
const resetButton = document.getElementById("resetButton");
const chooseButtons = document.getElementById("chooseButtons");
const numbersContainer = document.getElementById("numbers-container");
const winModalTitle = document.getElementById("modalTitle");
const winModalText = document.getElementById("modalText");
const winOverlay = document.getElementById("overlay");
const rollCounterValue = document.getElementById("rollCounterValue");
let dice1roll = 1;
let dice2roll = 1;
let numRolls = 0;
const numbersToAcchieve = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
let achievedNumbers = [];
function checkIfSetAndListIsIdentical(a, b) {
    return a.size === b.length && [...a].every((value) => b.includes(value));
}
function checkWin() {
    if (checkIfSetAndListIsIdentical(numbersToAcchieve, achievedNumbers)) {
        openPopup("Gratulerer!", `Jolven gikk opp og du brukte ${numRolls} kast!`);
        resetGame();
    }
}
function isLoss(current, goal) {
    return (new Set(current).size !== current.length ||
        Math.max(...current) > Math.max(...goal));
}
function updateRollCounter() {
    rollCounterValue.textContent = String(numRolls);
    rollCounterValue.classList.remove("bump");
    // Force reflow to restart animation
    void rollCounterValue.offsetWidth;
    rollCounterValue.classList.add("bump");
}
function resetGame() {
    dice1.dataset.value = "6";
    dice1.innerText = "";
    dice2.dataset.value = "6";
    dice2.innerText = "";
    numRolls = 0;
    updateRollCounter();
    const numberElements = numbersContainer.children;
    for (let i = numberElements.length - 1; i >= 0; i--) {
        const numberElement = numberElements[i];
        numberElement.classList.add("missing");
        numberElement.classList.remove("just-achieved");
    }
    achievedNumbers = [];
    chooseButtons.classList.add("hidden");
    rollButton.classList.remove("hidden");
    resetButton.classList.add("hidden");
}
function updateNumbersContainer() {
    const numberElements = numbersContainer.children;
    for (let i = 0; i < numberElements.length; i++) {
        const numberElement = numberElements[i];
        const num = Number(numberElement.innerText);
        const wasMissing = numberElement.classList.contains("missing");
        if (achievedNumbers.includes(num)) {
            numberElement.classList.remove("missing");
            // Detect newly achieved tile
            if (wasMissing) {
                numberElement.classList.add("just-achieved");
                setTimeout(() => {
                    numberElement.classList.remove("just-achieved");
                }, 600);
            }
        }
        else {
            numberElement.classList.add("missing");
        }
    }
}
function openPopup(title, text) {
    winModalTitle.textContent = title;
    winModalText.textContent = text;
    winOverlay.style.display = "flex";
}
function closePopup() {
    winOverlay.style.display = "none";
}
function addEachToAcchievedNumbers(numbers) {
    numbers.forEach((number) => {
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
    // Disable button during animation
    rollButton.disabled = true;
    // Start rolling animation
    dice1.classList.add("rolling");
    dice2.classList.add("rolling");
    dice1.dataset.value = "1"; // Hide pips during roll (opacity 0)
    dice2.dataset.value = "1";
    setTimeout(() => {
        dice1roll = Math.floor(Math.random() * 6) + 1;
        dice2roll = Math.floor(Math.random() * 6) + 1;
        numRolls += 1;
        updateRollCounter();
        // Remove rolling, set values, add landed
        dice1.classList.remove("rolling");
        dice2.classList.remove("rolling");
        dice1.dataset.value = String(dice1roll);
        dice1.innerText = "";
        dice2.dataset.value = String(dice2roll);
        dice2.innerText = "";
        dice1.classList.add("landed");
        dice2.classList.add("landed");
        setTimeout(() => {
            dice1.classList.remove("landed");
            dice2.classList.remove("landed");
        }, 300);
        // Display choosebuttons
        chooseButtons.classList.remove("hidden");
        rollButton.classList.add("hidden");
        rollButton.disabled = false;
        const isSumResultLoss = isLoss([...achievedNumbers, dice1roll + dice2roll], numbersToAcchieve);
        const isDiceResultLoss = isLoss([...achievedNumbers, dice1roll, dice2roll], numbersToAcchieve);
        sumButton.disabled = isSumResultLoss;
        diceButton.disabled = isDiceResultLoss;
        if (isSumResultLoss && isDiceResultLoss) {
            resetButton.classList.remove("hidden");
        }
    }, 600);
});
resetButton.addEventListener("click", () => {
    resetGame();
});
