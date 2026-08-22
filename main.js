const readline = require("readline"); //readline module to read input from the console
const rl = readline.createInterface({
    //create readline interface to read input from the console
    input: process.stdin,
    output: process.stdout,
});

let score = 0; //score variable to keep track of the player's score
const inputMaxNumber = Number.parseInt(process.argv[2], 10); //parse the maximum number from command line arguments
let maxNumber =
    Number.isInteger(inputMaxNumber) && inputMaxNumber > 0
        ? inputMaxNumber
        : 100; //set maxNumber to the parsed value if it's a positive integer, otherwise default to 100
let chips = 100; //initialize chips to 100
const totalAttempts = 5; //set total attempts to 5
let currentAttempt = 1; //initialize current attempt to 1

function getRandomNumber() {
    //function to generate a random number between 1 and maxNumber
    return Math.floor(Math.random() * maxNumber) + 1; //return a random integer between 1 and maxNumber
}

// Start the game with an initial number
function startGame() {
    //function to start the game
    const currentNumber = getRandomNumber(); //generate the initial random number
    console.log(`\nThe initial number is: ${currentNumber}`);
    playRound(currentNumber); //start the first round with the initial number
}

function playRound(randomNumber) {
    //function to play a round of the game
    // Check if the game is over due to attempts
    if (currentAttempt > totalAttempts) {
        //check if the current attempt exceeds total attempts
        console.log(
            `\nGame Over! You completed all attempts. Final score: ${score}`,
        );
        rl.close(); //close the readline interface
        return; //return to exit the function
    }

    console.log(`\n--- Attempt ${currentAttempt}/${totalAttempts} ---`);
    console.log(`Current chips: ${chips}`);

    rl.question("Enter your bid amount: ", (bid) => {
        //prompt the user to enter their bid amount
        const bidAmount = parseInt(bid, 10); //parse the bid amount to an integer

        // Validate bid
        if (isNaN(bidAmount) || bidAmount <= 0 || bidAmount > chips) {
            //check if the bid amount is valid
            console.log(
                "Invalid bid. Enter a positive number within your chip count.",
            ); //display an error message for invalid bid
            return playRound(randomNumber); // Retry this round without losing an attempt
        }

        rl.question("Is the next number higher or lower? (h/l): ", (answer) => {
            //prompt the user to guess if the next number is higher or lower
            const userGuess = answer.toLowerCase().trim(); //convert the user's answer to lowercase and trim whitespace

            // Validate guess
            if (userGuess !== "h" && userGuess !== "l") {
                //check if the user's guess is valid
                console.log(
                    'Invalid choice. Enter "h" for higher or "l" for lower.',
                ); //display an error message for invalid guess
                return playRound(randomNumber); // Retry this round
            }

            const nextNumber = getRandomNumber(); //generate the next random number
            console.log(`The next number is: ${nextNumber}`);

            // Evaluate win/loss
            const isHigher = userGuess === "h" && nextNumber > randomNumber; //check if the user's guess is correct for higher
            const isLower = userGuess === "l" && nextNumber < randomNumber; //check if the user's guess is correct for lower

            if (isHigher || isLower) {
                //if the user's guess is correct
                score += Math.round(
                    bidAmount *
                    (isHigher
                        ? maxNumber / (maxNumber + 1 - randomNumber)
                        : maxNumber / randomNumber),
                ); //calculate the score based on the bid amount and the range of possible numbers
                chips += bidAmount; //increase chips by the bid amount if the guess is correct
                console.log(`Correct! Score: ${score}. Chips: ${chips}`);
            } else {
                chips -= bidAmount; //decrease chips by the bid amount if the guess is incorrect
                console.log(`Wrong! Score: ${score}. Chips: ${chips}`);
            }

            // Check if user ran out of chips
            if (chips <= 0) {
                //check if the user has run out of chips
                console.log("\nYou ran out of chips! Game Over.");
                rl.close(); //close the readline interface
                return; //return to exit the function
            }

            // Move to the next attempt using the new number
            currentAttempt++; //increment the current attempt
            playRound(nextNumber); //start the next round with the new random number
        });
    });
}

// Initialize the game
startGame(); //call the startGame function to begin the game
