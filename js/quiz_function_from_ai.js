import { QuizDatabase } from "/js/lib/quiz.js";
import { GPTManger, PromptGenerator } from "/js/lib/gpt.js";

class QuizEntryComponent {
  constructor(quizEntry, videoElem, questionGpt, answerGpt) {
    this.quizEntry = quizEntry;
    this.video = videoElem;
    this.questionGpt = questionGpt;
    this.answerGpt = answerGpt;

    // this.elem = this.setup();
  }

  setup() {
    setupOperationsComponent();
    // setupQuestion();
    // setupEntry();
  }

  setupOperationsComponent() {}
}

/**
 * Get thevideo pause time
 * @returns {String} the video pause time in string format
 */
function getVideoPauseTime() {
  const video = document.getElementById("video");
  const time = video.currentTime;

  const m = Math.floor(time / 60);
  const s = Math.floor(time - m * 60);

  const timeString = `${m}:${s}`;
  return timeString;
}

async function generateAndDisplayQuizQuestion() {
  // #todo
}

async function generateAndDisplayQuizAnswer() {
  // #todo
}

function displayQuizQuestion() {
  // #todo
}

// #endregion

// quiz
var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
