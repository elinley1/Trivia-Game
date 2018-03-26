var GameState = {
    questions: [{
        qNumber: "1",
        q: "'Teep trong' in English refers to: ",
        answers: ["A straight foot-thrust.", "A slapping foot-thrust.", "A straight kick.", "A roundhouse kick."]
        correctAns: 0,
    },{
        qNumber: "2",
        q: "A 'jab' in Thai is called: ",
        answers: ["'Mat na'", "'Mat trong'", "'Mat wiang san'", "'Krodot chok'"]
        correctAns: 0,
    }, {
        qNumber: "3",
        q: "A clinch, or 'chap-kho', variant, the Swan-neck involves: "
        answers: ["Putting both controlling arms passed under the defender's arms.", "A defender's soft parries to change the direction of a strike so that it misses the target.", "One hand around the rear of the neck to briefly clinch an opponent before a strike.", "Swimming the arm underneath and inside the oponenet's clinch."]
        correctAns: 2,
    }, {
        qNumber: "4",
        q: "'Wai Kru' is: ",
        answers: ["A horizontal knee strike.", "A defender's hard blocks to stop a strike in its path and prevent it from reaching the target.", "A traditional pre-fight dance to pay respects to teachers, ancestors, and the spectators."]
        correctAns: 3,
    }, {
        qNumber: "5",
        q: "'Sok ti' in English is known as: ",
        answers: ["Spinning elbow", "Elbow slash", "Uppercut", "Roundhouse kick" ]
        correctAns: 1, 
    }, {
        qNumber: "6",
        q: "A jumping knee strike in Thai is known as: "
        answers: ["'Khayoep teh'", "'Khao dot'", "'Teh tat'", "'Sok tat'", "'Sok klap'" ]
        correctAns: 1,
    },{
        qNumber: "7",
        q: "The Thai king who codified the modern rules for Muay Thai was: ",
        answers: ["King Chulalongkorn", "King Naresuan", "King Rama", "King Mangra"]
        correctAns: 2,
    },{
        qNumber: "8",
        q: "Muay Thai is often known as: ",
        answers: ["The way of kicking and jumping, and the fist and hand", "The way of harmonious spirit", "The way of coordinating power", "The art of eight-limbs"],
        correctAns: 3,
    },{
        qNumber: "9",
        q: "'Mat wiang klap' in English is a: ",
        answers: ["Spinning backfist", "Spinning elbow", "Double elow chop", "Superman punch"],
        correctAns: 0
    }, {

    }],
    timer: 30,
    correctCount: 0,
    wrongCount: 0,
    userAns: null,
};

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
        $('.start-game').on('click', function(e) {
            //GameLogic.<some handler>()
        });

        //initialize timer
        gameState.timerInterval = Timer.startTimer(GameLogic.timerTick);
    }
};

var GameLogic = {
    timerTick() {
        gameState.timer--;
    }
};

var DisplayUpdate = {
    render(gs) {
        //update the DOM using jQuery based off gameState
        $('.timer-display').innerHTML(gameState.timer);
    }
};



$(document).ready(function(){ 
    EventDispatch.wireEvents();
    DisplayUpdate.render();
    function start() {
        var button = $("<button>");
        button.addClass("start");
        $(".start").on("click", function initialState() {
            tCount = setInterval(timeCount, 1000);
            triviaPlay();
        });
        
        function timeCount() {
            timer--;
            if (timer <= 0) {
                clearInterval(tCount);
                return;
            };
        };

        $(".clock").html("Count Down: " + "00 " + timer + "sec.");

        function triviaPlay() {
            $("#question").html(questions[qNumber].q);
            qNumber++;
            
            var answerArray = questions[qNumber].choices;
            var choicesArray = [];

            for (i = 0, i < choicesArray.length, i++) {
                var button = $("<button>");
                button.text(choicesArray[i]);
                button.attr("data-id", i);
                $(".buttonChoices").append(button);
            };

            $(".buttonChoices").on("click", "button", function() {
                userChoice = $(this).data("id");
                var correctChoice = questions[qNumber].correctAns;
                if (userChoice === correctChoice && timer > 0) {
                    $(".buttonChoices").html("Wah! You got the answer correct!");
                    correctCount ++;
                }
                else if (userChoice != questions[qNumber] || timer <=0) {
                    $("buttonChoices").html("Ba! That's not right, the answer is " + q[correctAns] + ".")
                    wrongCount ++;
                }; 
            })
        }
    })    
})