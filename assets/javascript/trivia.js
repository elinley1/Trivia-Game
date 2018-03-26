const $ = jQuery;
const timerInit = 5;
function makeInitialGameState() {
    return {
        questions: [{
            qNumber: "1",
            q: "'Teep trong' in English refers to: ",
            answers: ["A straight foot-thrust.", "A slapping foot-thrust.", "A straight kick.", "A roundhouse kick."],
            correctAns: 0,
        }, {
            qNumber: "2",
            q: "A 'jab' in Thai is called: ",
            answers: ["'Mat na'", "'Mat trong'", "'Mat wiang san'", "'Krodot chok'"],
            correctAns: 0,
        }, {
            qNumber: "3",
            q: "A clinch, or 'chap-kho', variant, the Swan-neck involves: ",
            answers: ["Putting both controlling arms passed under the defender's arms.", "A defender's soft parries to change the direction of a strike so that it misses the target.", "One hand around the rear of the neck to briefly clinch an opponent before a strike.", "Swimming the arm underneath and inside the oponenet's clinch."],
            correctAns: 2,
        }, {
            qNumber: "4",
            q: "'Wai Kru' is: ",
            answers: ["A horizontal knee strike.", "A defender's hard blocks to stop a strike in its path and prevent it from reaching the target.", "A traditional pre-fight dance to pay respects to teachers, ancestors, and the spectators."],
            correctAns: 3,
        }, 
        {
            qNumber: "5",
            q: "'Sok ti' in English is known as: ",
            answers: ["Spinning elbow", "Elbow slash", "Uppercut", "Roundhouse kick"],
            correctAns: 1,
        }, {
            qNumber: "6",
            q: "A jumping knee strike in Thai is known as: ",
            answers: ["'Khayoep teh'", "'Khao dot'", "'Teh tat'", "'Sok tat'", "'Sok klap'"],
            correctAns: 1,
        }, {
            qNumber: "7",
            q: "The Thai king who codified the modern rules for Muay Thai was: ",
            answers: ["King Chulalongkorn", "King Naresuan", "King Rama", "King Mangra"],
            correctAns: 2,
        }, {
            qNumber: "8",
            q: "Muay Thai is often known as: ",
            answers: ["The way of kicking and jumping, and the fist and hand", "The way of harmonious spirit", "The way of coordinating power", "The art of eight-limbs"],
            correctAns: 3,
        }, {
            qNumber: "9",
            q: "'Mat wiang klap' in English is a: ",
            answers: ["Spinning backfist", "Spinning elbow", "Double elow chop", "Superman punch"],
            correctAns: 0,
            timerOn: false
        }
        ],
        timer: timerInit,
        correctCount: 0,
        wrongCount: 0,
        userAns: null,
        answerDisplay: "",
        display: "INIT", // INIT / QUESTION / INCORRECT / CORRECT / TIMEUP
        questionIndex: 0
    };
}
var GameState =  makeInitialGameState();

var Timer = {
    startTimer(tickCB) {
        // initializer the interval w/ callback
        return setInterval(tickCB, 1000);
    },
    stopTimer(interval) {
        clearInterval(interval);
    }
};

var EventDispatch = {
    wireEvents() {
        // hook up jQuery event listeners to GameLogic functions
        $('#start-btn').on('click', function (e) {
            $(this).hide();
            EventDispatch.start();
        });

        // register event handlers for answers clicked
        $("#ansChoices").on("click", ".btn-choice", function (e) {
            console.log("Click event from btn-choice", e);
            let id = $(this).data('id');
            console.log("Clicked answer id", id);
            GameLogic.gradeAnswer(id);
        });

        $("#progress-container").on("click", ".next-btn", function(e) {
            console.log("Next Button Clicked");
            GameLogic.displayQuestion();
        });
        $("#progress-container").on("click", ".restart-btn", function(e) {
            console.log("Restart Button Clicked");
            Timer.stopTimer(GameState.timerInterval);
            GameState = makeInitialGameState();
            EventDispatch.start();
            //GameLogic.displayQuestion();
        });
    },
    start() {
        console.log("start");
        GameLogic.displayQuestion();
        GameState.timerOn = true;
        //initialize timer
        GameState.timerInterval = Timer.startTimer(
            function () {
                GameLogic.timerTick();
            });
    }
};

var GameLogic = {
    timerTick() {
        if (GameState.timer > 0 && GameState.timerOn)
            GameState.timer--;
        else if (GameState.timer <= 0) {
            Timer.stopTimer(GameState.timer);
            GameState.timerOn = false;
            GameState.timer = 0;
            GameState.display = "TIMEUP";
        }
        DisplayUpdate.render();
    },
    displayQuestion() {
            // display question
            GameState.timer = timerInit;
            GameState.timerOn = true;
            GameState.display = "QUESTION";
        
    },
    pauseTimer() {
        GameState.timerOn = false;
    },
    updateQuestionIndex() {
        GameState.questionIndex++;
        if(GameState.questionIndex >= GameState.questions.length) {
            // handle questions run out
            console.log("Questions Run Out")
            GameState.questionIndex = 0;
            GameState.display = "FINAL";
            GameLogic.pauseTimer();
        }
    },
    gradeAnswer(id) {
        console.log("Grade answer id", id);
        GameState.questions[0].correctAns;
        if (id === GameState.questions[GameState.questionIndex].correctAns) {
          GameState.display = "CORRECT";
          GameState.correctCount++;
        }
        else if (id != GameState.questions[GameState.questionIndex].correctAns) {
            GameState.display = "INCORRECT";
            GameState.wrongCount++;
        }

        GameLogic.pauseTimer();
        GameLogic.updateQuestionIndex();
        DisplayUpdate.render();
    }

};

var DisplayUpdate = {
    render() {
        let display = GameState.display;
        // INIT / QUESTION / INCORRECT / CORRECT / TIMEUP

        if( display === "INIT"){
            DisplayUpdate.renderToolbar();
        }
        else if (display === "QUESTION") {
            DisplayUpdate.renderToolbar();
            let q = GameState.questions[GameState.questionIndex].q;
            $("#question").text(q);
            DisplayUpdate.renderAnswers();
            DisplayUpdate.eraseNextButton();
            DisplayUpdate.eraseFeedback();
        }
        else if(display === "INCORRECT") {
            DisplayUpdate.renderToolbar();
            DisplayUpdate.eraseAnswers();
            DisplayUpdate.eraseQuestion();
            $("#feedback").text("Incorrect Answer");
            DisplayUpdate.renderNextQuestion();
        }
        else if(display === "CORRECT") {
            DisplayUpdate.renderToolbar();
            DisplayUpdate.eraseAnswers();
            DisplayUpdate.eraseQuestion();
            $("#feedback").text("Correct Answer");
            DisplayUpdate.renderNextQuestion();
        }
        else if(display === "TIMEUP") {
            DisplayUpdate.renderToolbar();
            DisplayUpdate.eraseAnswers();
            DisplayUpdate.eraseQuestion();
            $("#feedback").text("Time to answer the question is up");
            DisplayUpdate.renderNextQuestion();
        }
        else if(display === "FINAL") {
            DisplayUpdate.renderToolbar();
            DisplayUpdate.eraseAnswers();
            DisplayUpdate.eraseQuestion();
            $("#feedback").text("GAME OVER.");
            DisplayUpdate.renderRestart();
        }
    },
    renderToolbar() {
        //update the DOM using jQuery based off GameState
        $('.timer-display').html(GameState.timer);
        $('#correct-count').html("Correct Answers: " + GameState.correctCount);
        $('#wrong-count').html("Wrong Answers: " + GameState.wrongCount);
    },
    renderNextQuestion() {
        if ($("#progress-container .next-btn").length < 1) {
            DisplayUpdate.eraseAnswers();

            var btn = $("<a>").attr({
                type: "button",
                class: "btn btn-primary next-btn"
            });
            btn.text("Next Question >>");
            $("#progress-container").append(btn);
        }
    },
    renderRestart () {
        if ($("#progress-container .restart-btn").length < 1) {
            DisplayUpdate.eraseAnswers();

            var btn = $("<a>").attr({
                type: "button",
                class: "btn btn-primary restart-btn"
            });
            btn.text("Play Again?");
            $("#progress-container").append(btn);
        }
    },
    eraseQuestion() {
        $("#question").html("");
    },
    eraseAnswers() {
        $("#ansChoices").html("");
    },
    eraseNextButton() {
        $("#progress-container").html("");
    },
    eraseFeedback() {
        $("#feedback").html("");
    },
    renderAnswers() {
        if ($("#ansChoices .btn-choice").length < 1) {
            var ansArr = GameState.questions[GameState.questionIndex].answers || [];
            var btnArr = [];
            console.log(ansArr);
            for (i = 0; i < ansArr.length; i++) {
                var btn = $("<a>").attr({
                    type: "button",
                    class: "btn btn-primary btn-choice"
                });
                btn.text(ansArr[i]);
                btn.attr("data-id", i);
                $("#ansChoices").append(btn);
            };
        }
    }
};



$(document).ready(function () {
    EventDispatch.wireEvents();
    DisplayUpdate.render();
    //DisplayUpdate.startPage();
});