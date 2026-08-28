const readline = require("readline"); //readline module to read input from the console
const rl = readline.createInterface({
    //create readline interface to read input from the console
    input: process.stdin,
    output: process.stdout,
});

let score = 0; //score variable to keep track of the player's score
let maxNumber,
    chips,
    totalAttempts,
    currentAttempt = 1; //variables to store the maximum number, chips, total attempts, and current attempt

function getPositiveInteger(value, defaultValue, settingName) {
    //function to validate and return a positive integer or default value
    const parsedValue = Number.parseInt(value, 10); //parse the input value to an integer

    if (Number.isInteger(parsedValue) && parsedValue > 0) {
        //check if the parsed value is a positive integer
        return parsedValue; //return the parsed value if valid
    }

    console.log(`Invalid ${settingName}. Using default of ${defaultValue}.`); //display a message indicating that the default value will be used
    return defaultValue; //return the default value if the input is invalid
}

function initializeGame() {
    //function to initialize the game settings
    rl.question(
        "Enter the maximum number (default 100): ",
        (inputMaxNumber) => {
            //prompt the user to enter the maximum number
            maxNumber = getPositiveInteger(
                inputMaxNumber,
                100,
                "maximum number",
            ); //validate and set the maximum number

            rl.question(
                "Enter the starting chips (default 100): ",
                (inputChips) => {
                    //prompt the user to enter the starting chips
                    chips = getPositiveInteger(
                        inputChips,
                        100,
                        "starting chips",
                    ); //validate and set the starting chips

                    rl.question(
                        "Enter the total attempts (default 10): ",
                        (inputTotalAttempts) => {
                            //prompt the user to enter the total attempts
                            totalAttempts = getPositiveInteger(
                                inputTotalAttempts,
                                10,
                                "total attempts",
                            ); //validate and set the total attempts
                            startGame(); //start the game after collecting all settings
                        },
                    );
                },
            );
        },
    );
}

function getRandomNumber() {
    //function to generate a random number between 1 and maxNumber
    return Math.floor(Math.random() * maxNumber) + 1; //return a random integer between 1 and maxNumber
}

// Start the game with an initial number
function startGame() {
    //function to start the game
    const currentNumber = getRandomNumber(); //generate the initial random number
    console.log(`\nThe initial number is: ${currentNumber}`); //initial number
    playRound(currentNumber); //start the first round with the initial number
}

function playRound(randomNumber) {
    //function to play a round of the game
    // Check if the game is over due to attempts
    if (currentAttempt > totalAttempts) {
        //check if the current attempt exceeds total attempts
        console.log(
            `\nGame Over! You completed all attempts. Final score: ${score}`,
        ); //game over, all attempts made
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

            let nextNumber;
            do {
                nextNumber = getRandomNumber(); //generate the next random number
            } while (nextNumber === randomNumber); //repeat until next number is different from current random number
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
                console.log(`Correct! Score: ${score}. Chips: ${chips}`); //correct answer
            } else {
                chips -= bidAmount; //decrease chips by the bid amount if the guess is incorrect
                console.log(`Wrong! Score: ${score}. Chips: ${chips}`); //wrong answer
            }

            // Check if user ran out of chips
            if (chips <= 0) {
                //check if the user has run out of chips
                console.log("\nYou ran out of chips! Game Over."); //game over, no chips left
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
initializeGame(); //collect the game settings before starting the game
