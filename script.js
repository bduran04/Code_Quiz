
var questionIndex = 0;
var score = 0;
var timeLeft = 30;
var timer;
//this hold all of the final scores; 
var finalScores = {data: []}
var startPage = document.querySelector(".startPage");
var startButton = document.querySelector(".startButton");
var questionsPage = document.querySelector(".questionsPage");
questionsPage.setAttribute("style", "display: none");
var endGamePage = document.querySelector(".endGamePage");
endGamePage.setAttribute("style", "display: none");
var timerEl = document.querySelector(".timer");
var questions = [
    {
        title: "Which of the following type of variable takes precedence over other if names are same?", 
        choices: ["Global variable", "Local variable", "Both of the above", "None of the above"],
        answer: "Local variable"
    }, 
    {
        title: "Which built-in method returns the string representation of the number's value?", 
        choices: ["toValue()", "toNUmber()", "toString()", "None of the above"],
        answer: "toString()"
    },
    {
        title: "Which of the following function of String object returns the index within the calling String object of the first occurrence of the specified value??", 
        choices: ["substr()", "search()", "lastIndexOf()", "indexOf()"],
        answer: "indexOf()"
    },
    {
        title: "Which of the following function of String object creates an HTML anchor that is used as a hypertext target?", 
        choices: ["anchor()", "link()", "blink()", "big()"],
        answer: "anchor()"
    }, 
    {
        title: "Which of the following function of String object causes a string to be italic, as if it were in an <i> tag?", 
        choices: ["fixed()", "fontcolor()", "fontsize()", "italics()"],
        answer: "italics()"
    }
]

function startQuiz() {
    timerEl.textContent="Time left: " + timeLeft; 
    timer = setInterval(function() {
        timeLeft--;
        timerEl.textContent="Time left: " + timeLeft; 
        if (timeLeft === 0) {
            endGame();
        }
    },1000)
    startPage.setAttribute("style", "display:none");
    questionsPage.setAttribute("style", "display:block");
    questionsPage.removeAttribute("style");
    displayNextQuestion();
    //if it doesnt equal null then assign in finalscores 
    if (JSON.parse(localStorage.getItem("finalScores")) !== null) {
        finalScores = JSON.parse(localStorage.getItem("finalScores"))
    }
}

function displayNextQuestion() {
    var questionsTitle = document.querySelector(".questionsTitle");
    var questionsChoices = document.querySelector(".questionsChoices");
    //grab questions from array & enables user to answer before moving on 
    questionsTitle.textContent=questions[questionIndex].title; 
    questionsChoices.innerHTML="";
    questions[questionIndex].choices.forEach(function(choice) {
        var inputEl = document.createElement("input")
        inputEl.type = "radio";
        var labelEl = document.createElement("label")
        var breakEl = document.createElement("br")
        labelEl.textContent = choice;
        inputEl.value = choice;
        inputEl.addEventListener('click', checkAnswer);
        questionsChoices.appendChild(inputEl); 
        questionsChoices.appendChild(labelEl);
        questionsChoices.appendChild(breakEl);
    })
    
}

function checkAnswer(event) {
    if (event.target.value === questions[questionIndex].answer) {
        score++;
        questionIndex++;
        if (questionIndex === questions.length) {
            endGame();
        }
        else {
            displayNextQuestion();
        }
    }
    else {
        displayErrorMessage();
        questionIndex++;
        //if the timer is 10 or less, it deducts the remaining time left else it deducts 10 
        if (timeLeft < 10) {
            // timeLeft = timeLeft - timeLeft
            timeLeft = 0;
            endGame();
            }
            else {
                timeLeft-=10; 
            }
        }
        timerEl.textContent="Time left: " + timeLeft;
        //display message incorrcet
    }
    function displayErrorMessage() {
        document.querySelector(".errorMessage").textContent="Incorrect Answer!";
        setTimeout(function () {
            document.querySelector(".errorMessage").textContent="";
            displayNextQuestion()
        }, 1000);
        // setTimeout(function() {...}, time in ms)
    }
    //calls the display the next question function
function endGame() {
    questionsPage.setAttribute("style", "display:none");
    endGamePage.setAttribute("style", "display:block");
    clearInterval(timer);
    var initials = prompt("What are your initials? ");
    var finalScore = {
        initials,
        score
    }
    finalScores.data.push(finalScore);
    createTable()
    localStorage.setItem("finalScores", JSON.stringify(finalScores));
//responsible for end of the game 
//populate the scoreboard & initially 
}
function createTable() {

    // create table
    var tableEl = document.createElement("table");
    var tableRowEl = document.createElement("tr");

    // create table headers
    var firstTableHeaderEl = document.createElement("th");
    firstTableHeaderEl.textContent = "Player";
    var secondTableHeaderEl = document.createElement("th");
    secondTableHeaderEl.textContent = "Score";
    
    // add table header to table element
    tableRowEl.appendChild(firstTableHeaderEl);
    tableRowEl.appendChild(secondTableHeaderEl);
    tableEl.appendChild(tableRowEl);

    // generic sort by value
    finalScores.data.sort(function (a, b) {
        return b.score - a.score;
      });

    // loop over data to create table rows
    for (record of finalScores.data) {
        // create table row with player and score info
        var trEl = document.createElement("tr");
        var td_player = document.createElement("td");
        td_player.textContent = record.initials;
        var td_score = document.createElement("td");
        td_score.textContent = record.score;
        trEl.appendChild(td_player);
        trEl.appendChild(td_score);
        // put new table row in table
        tableEl.appendChild(trEl)
    }
    endGamePage.appendChild(tableEl);
}
//save initials into a local storage and display all the high scores on the page 
//handle the endgame fucntion, what jhappens when reahc end of questions array 