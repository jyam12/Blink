import { GPTManger, PromptGenerator } from "/js/lib/gpt.js";
import { HistoryDatabase } from "/js/lib/history.js";
import { QuizDatabase } from "/js/lib/quiz.js";

// #region Chat Popup

const chatPopupElem = document.getElementById("chat-popup");

const questionElem = document.getElementById("question-textarea");
const answerElem = document.getElementById("answer-textarea");
const askBtn = document.getElementById("ask-btn");

const historyDatabase = new HistoryDatabase();
const promptGenerator = new PromptGenerator();
const gptManger = new GPTManger();
promptGenerator.setup(historyDatabase);
gptManger.setup(promptGenerator.askQuestion.bind(promptGenerator));

// Event for ask-btn, ask question, display answer and update history
askBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const question = questionElem.value;

  const answer = await gptManger.send(question);

  answerElem.innerText = "Unverified AI answer: " + answer;
  answerElem.style.height = "auto";
  answerElem.style.height =
    answerElem.scrollHeight > 300 ? "300px" : answerElem.scrollHeight + "px";
  historyDatabase.addEntry(question, answer);
});

questionElem.addEventListener("input", () => {
  questionElem.style.height = "auto";
  questionElem.style.height = questionElem.scrollHeight + "px";
});

questionElem.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    askBtn.click();
  }
});

document
  .getElementById("open-chat-btn")
  .addEventListener("click", () => (chatPopupElem.style.display = "block"));

document
  .getElementById("close-chat-btn")
  .addEventListener("click", () => (chatPopupElem.style.display = "none"));

// #endregion

// #region quiz popup

class QuizPopupManager {
  constructor(videoElem, queElem, ansElem, quizPopupElem) {
    this.videoElem = videoElem;
    this.queElem = queElem;
    this.ansElem = ansElem;
    this.quizPopupElem = quizPopupElem;
    this.status = new Map();
  }

  setup(quizDatabase) {
    quizDatabase.quiz.forEach((entry) => this.register(entry));
  }

  parse(timeStamp) {
    const time = timeStamp.split(":");
    return parseInt(time[0]) * 60 + parseInt(time[1]);
  }

  register(entry) {
    const eventHandler = () => {
      const dist = this.videoElem.currentTime - this.parse(entry.timeStamp);
      if (0 <= dist && dist <= 2) {
        this.openQuizPopup(entry);
        console.log("deregistering ", entry);
        this.dereigster(entry);
      }
    };

    console.log("registering ", entry);
    this.videoElem.addEventListener("timeupdate", eventHandler);
    this.status.set(entry, eventHandler);
  }

  dereigster(entry) {
    this.videoElem.removeEventListener("timeupdate", this.status.get(entry));
    this.status.delete(entry);
  }

  openQuizPopup(entry) {
    this.queElem.value = entry.question;
    this.ansElem.value = entry.answer;

    this.queElem.style.height = "150px";
    // this.queElem.style.height = this.queElem.scrollHeight + "px";
    this.ansElem.style.height = "auto";
    this.ansElem.style.height = this.ansElem.scrollHeight + "px";

    this.ansElem.style.display = "none";
    this.quizPopupElem.style.display = "block";
    this.videoElem.pause();
  }
}

const quizPopupElem = document.getElementById("quiz-popup");
const quizQueElem = document.getElementById("quiz-question");
const quizAnsElem = document.getElementById("quiz-answer");
const videoElem = document.getElementById("video");

const quizDatabase = new QuizDatabase();

const quizPopupManager = new QuizPopupManager(
  videoElem,
  quizQueElem,
  quizAnsElem,
  quizPopupElem
);
quizPopupManager.setup(quizDatabase);

/* events */

document.getElementById("open-quiz-btn").addEventListener("click", () => {
  console.log("open-quiz-btn clicked");
  quizPopupElem.style.display = "block";
});

document.getElementById("close-quiz-btn").addEventListener("click", () => {
  quizPopupElem.style.display = "none";
});

document.getElementById("show-ans-btn").addEventListener("click", () => {
  let style = quizAnsElem.style;
  style.display = style.display === "none" ? "block" : "none";
  style.width = "300px";
  style.height = "auto";
  style.height =
    quizAnsElem.scrollHeight > 300 ? "300px" : quizAnsElem.scrollHeight + "px";
});

// #endregion
