import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = (() => {
  //cache the DOM
  const quizEl = document.querySelector(".jabquiz");
  const quizQuestionEl = document.querySelector(".jabquiz__question");
  const trackerEl = document.querySelector(".jabquiz__tracker");
  const taglineEl = document.querySelector(".jabquiz__tagline");
  const choicesEl = document.querySelector(".jabquiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButtonEl = document.querySelector(".next");
  const restartButtonEl = document.querySelector(".restart");

  const q1 = new Question(
    "First President of US?",
    ["Barrack", "Osama", "George", "Monkey"],
    2
  );
  const q2 = new Question(
    "When was Javascript created?",
    ["June 1995", "May 1995", "July 1885", "Sep 1996"],
    1
  );
  const q3 = new Question(
    "What does CSS stand for?",
    [
      "County Sheriff Service",
      "Cascading sexy sheets",
      "cascading style sheets",
      "Craft Cookies Space"
    ],
    2
  );
  const q4 = new Question(
    "The full form of HTML is...?",
    [
      "Hyper Text Markup Language",
      "Hold the Mic Louis",
      "ERROR",
      "Handsome Tall Mail Lady"
    ],
    0
  );
  const q5 = new Question(
    "console.log(typeof []) would return what?",
    ["Array", "Object", "null", "array"],
    1
  );

  const quiz = new Quiz([q1, q2, q3, q4, q5]);

  const listeners = _ => {
      nextButtonEl.addEventListener("click", function () {
          const selectedRadioElement = document.querySelector('input[name="choice"]:checked')
          if (selectedRadioElement) {
              const key = Number(selectedRadioElement.getAttribute("data-order"));
              quiz.guess(key);
              renderAll();
          }
      })

      restartButtonEl.addEventListener("click", function () {
           quiz.reset();
           renderAll();
           nextButtonEl.style.opacity = 1;
           setValue(taglineEl, `Pick an option below!`);
      })
  }

  const setValue = (elem, value) => {
    elem.innerHTML = value;
  };

  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question);
  };

  const renderChoicesElements = _ => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
      <li class="jabquiz__choice">
                            <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
                            <label for="choice${index}" class="jabquiz__label">
                                <i></i>
                                <span>${elem}</span>
                            </label>
                        </li>
      `;
    });

    setValue(choicesEl, markup);
  };

  const renderTracker = _ => {
    const index = quiz.currentIndex;
    setValue(trackerEl, `${index + 1} of ${quiz.questions.length}`);
  };

  const getPercentage = (num1, num2) => {
    return Math.round((num1 / num2) * 100);
  };

  const lauch = (width, maxPercent) => {
    let loadingBar = setInterval(() => {
      if (width > maxPercent) {
        clearInterval(loadingBar);
      } else {
        width++;
        progressInnerEl.style.width = width + "%";
      }
    }, 3);
  };

  const renderProgress = _ => {
    const currentWidth = getPercentage(
      quiz.currentIndex,
      quiz.questions.length
    );
    lauch(0, currentWidth);
  };

  const renderEndScreen = _ => {
      setValue(quizQuestionEl, `Great Job!`);
      setValue(taglineEl, `Complete!`);
      setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
      nextButtonEl.style.opacity = 0;
      renderProgress();
  }

  const renderAll = _ => {
    if (quiz.hasEnded()) {
      //renderEndScreen
      renderEndScreen();
    } else {
      renderQuestion();
      renderChoicesElements();
      renderTracker();
      renderProgress();
    }
  };

  return {
    renderAll: renderAll,
    listeners: listeners
  };
})();

App.renderAll();
App.listeners();