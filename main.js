const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let score = 0;
const inputMaxNumber = Number.parseInt(process.argv[2], 10);
let maxNumber = Number.isInteger(inputMaxNumber) && inputMaxNumber > 0 ? inputMaxNumber : 100;
let chips = 100;
const totalAttempts = 5;
let currentAttempt = 1;

function getRandomNumber() {
    return Math.floor(Math.random() * maxNumber) + 1;
}

// Start the game with an initial number
function startGame() {
    const currentNumber = getRandomNumber();
    console.log(`\nThe initial number is: ${currentNumber}`);
    playRound(currentNumber);
}

function playRound(randomNumber) {
    // Check if the game is over due to attempts
    if (currentAttempt > totalAttempts) {
        console.log(`\nGame Over! You completed all attempts. Final score: ${score}`);
        rl.close();
        return;
    }

    console.log(`\n--- Attempt ${currentAttempt}/${totalAttempts} ---`);
    console.log(`Current chips: ${chips}`);

    rl.question('Enter your bid amount: ', (bid) => {
        const bidAmount = parseInt(bid, 10);

        // Validate bid
        if (isNaN(bidAmount) || bidAmount <= 0 || bidAmount > chips) {
            console.log('Invalid bid. Enter a positive number within your chip count.');
            return playRound(randomNumber); // Retry this round without losing an attempt
        }

        rl.question('Is the next number higher or lower? (h/l): ', (answer) => {
            const userGuess = answer.toLowerCase().trim();

            // Validate guess
            if (userGuess !== 'h' && userGuess !== 'l') {
                console.log('Invalid choice. Enter "h" for higher or "l" for lower.');
                return playRound(randomNumber); // Retry this round
            }

            const nextNumber = getRandomNumber();
            console.log(`The next number is: ${nextNumber}`);

            // Evaluate win/loss
            const isHigher = userGuess === 'h' && nextNumber > randomNumber;
            const isLower = userGuess === 'l' && nextNumber < randomNumber;

            if (isHigher || isLower) {
                score += Math.round(bidAmount * (isHigher ? maxNumber / (maxNumber + 1 - randomNumber) : maxNumber / randomNumber));
                chips += bidAmount;
                console.log(`Correct! Score: ${score}. Chips: ${chips}`);
            } else {
                chips -= bidAmount;
                console.log(`Wrong! Score: ${score}. Chips: ${chips}`);
            }

            // Check if user ran out of chips
            if (chips <= 0) {
                console.log('\nYou ran out of chips! Game Over.');
                rl.close();
                return;
            }

            // Move to the next attempt using the new number
            currentAttempt++;
            playRound(nextNumber);
        });
    });
}

// Initialize the game
startGame();