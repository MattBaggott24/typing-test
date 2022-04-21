const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote");

const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes
const renderNewQuote = async () => {
    // Fetch contents from url
    const response = await fetch(quoteApiUrl);

    // Store response
    let data = await response.json();

    // Access quote
    quote = data.content;

    // Array of characters in the quote
    let arr = quote.split("").map((value) => {
        // wrap the characters in a span tag
        return "<span class='quote-chars'>" + value + "</span>";
    });
    // join array for displaying
    quoteSection.innerHTML += arr.join(""); // TODO: innerHTML meaning

};

// Logic for comparing input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");

    // create an array from recieved span tags
    quoteChars = Array.from(quoteChars);

    // array of user input characters
    let userInputChars = userInput.value.split("");

    // userInputChars.trim();

    // loop through each character in quote
    quoteChars.forEach((char, index) => {
        // check if char(quote charater) = userInputChars[index](input character)
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        // If user hasn't entered anything or backspaced 
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success")
            } else {
                char.classList.remove("fail");
            }
        }

        // If user enters wrong character
        else {
            // Checks if we already have added fail class
            if (!char.classList.contains("fail")) {
                // increment and display mistakes
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        // returns true if all the characters are entered correctly
        let check = quoteChars.every(element => {
            return element.classList.contains("success");
        });

        // End test if all characters are correct
        if (check) {
            displayResult();
        }
    });

});

// Update timer on screen
updateTimer = () => {
    if (time == 0) {
        // End test if time is 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Sets timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// end test
const displayResult = () => {
    // display result
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("new-test").style.display = "block";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }

    let userInputNoSpace = (userInput.value).replace(/\s/g, '');

    let wordCount = 1;

    for (let vals in userInput.value) {
        if (userInput.value[vals] == " ") {
            wordCount++;
        }
    }

    let averageWordLength = userInputNoSpace.length / wordCount;

    console.log(averageWordLength);
    console.log(userInput.value.length / averageWordLength);

    // different ways of calculating wpm

    // console.log("amount of words: " + wordCount);
    // console.log((userInputNoSpace.length / 5 / timeTaken).toFixed(2) + " wpm")
    // console.log((userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm")
    // console.log("wordCount/timeTaken" + wordCount / timeTaken);

    // let temp3 = (wordCount / (timeTaken * 100)) * 60;

    // console.log("temp3 " + temp3);

    // console.log(timeTaken);
    // console.log(wordCount / (timeTaken * 100).toFixed(2));
    document.getElementById("wpm").innerText = ((userInput.value.length / averageWordLength) / (timeTaken * 100) * 60).toFixed(0) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// Start test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("new-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.getElementById("quote-input").focus();
}

const newTest = () => {
    document.location.reload();
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("new-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}