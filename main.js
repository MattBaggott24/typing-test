const quoteApiUrl = "https://api.quotable.io/random?minLength=100&maxLength=140";

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
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }

    // cannot use .filter??????
    // remove blank chars
    // let tempCount = 0;
    // userInput.forEach(element => {
    //     if (element == " ") {
    //         console.log("empty");
    //         tempCount++;
    //     }
    // });

    // console.log(quoteChars);
    // console.log(quoteChars.length);

    // console.log(userInputChars);
    // console.log(userInput.value

    let userInputNoSpace = (userInput.value).replace(/\s/g, '');
    // console.log(userInputNoSpace);
    // console.log("temp: " + temp);

    // userInput = userInput.filter(function (el) {
    //     return el != null;
    // });

    let tempCount = 0;

    for (let vals in userInput.value) {
        if (userInput.value[vals] == " ") {
            tempCount++;
        }
    }

    console.log("amount of words: " + tempCount);
    console.log((userInputNoSpace.length / 5 / timeTaken).toFixed(2) + " wpm")
    console.log((userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm")
    console.log("tempcount/timeTaken" + tempCount / timeTaken);
    console.log((tempCount / timeTaken).toFixed(2));
    document.getElementById("wpm").innerText = (userInputNoSpace.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// Start test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}