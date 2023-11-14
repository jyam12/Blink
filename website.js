import questionHistory from "./history.json" assert { type: "json" };
import {
  sendPrompt,
  PGAskQuestion,
  PGQuizQuestion,
  PGQuizAnswer,
} from "./gpt.js";
const quiz = [];

// #region QuestionHistory utils

/**
 * Parse question history into string format
 * @param {Entry[]} history a list of question history entries
 * @returns {String} the parsed question history in string format
 */
function parseQuestionHistory(history) {
  let parsedHistory = "[";
  for (const entry of history) {
    parsedHistory += `{ question: "${entry.question}", answer: "${entry.answer}" }, `;
  }
  parsedHistory += "]";
  return parsedHistory;
}

/**
 * Add question history entry to question history
 * @param {String} question the question asked by the student
 * @param {String} answer the answer given by GPT
 */
function addQuestionHistory(question, answer) {
  const entry = {
    id: Date.now(),
    question,
    answer,
    verified: false,
  };
  questionHistory.history.push(entry);
  console.log(questionHistory);
}

/**
 * Get verified question history
 * @returns {Entry[]} a list of verified question history entries
 */
function getVerifiedQuestionHistory() {
  const verifiedQuestionHistory = questionHistory.history.filter(
    (entry) => entry.verified
  );
  return verifiedQuestionHistory;
}

/**
 * Verify a question history entry
 * @param {int} id the id of the question history entry
 */
function verfiyQuestionHistory(id) {
  const entry = questionHistory.history.find((entry) => entry.id === id);
  entry.verified = true;
}

// #endregion

// #region ChatbotUI Events

const openFormBtn = document.getElementById("openForm");
const closeFormBtn = document.getElementById("closeForm");

/**
 * Event handler for openFormBtn
 */
function openForm(e) {
  document.getElementById("myForm").style.display = "block";
}

/**
 * Event handler for closeFormBtn
 */
function closeForm(e) {
  document.getElementById("myForm").style.display = "none";
}

if (typeof openFormBtn !== "undefined")
  openFormBtn.addEventListener("click", openForm);
if (typeof closeFormBtn !== "undefined")
  closeFormBtn.addEventListener("click", closeForm);

// #endregion

// #region AskQuestion Events

const questionElem = document.getElementById("question");
const answerElem = document.getElementById("answer");
const sendBtn = document.getElementById("send");

/**
 * Event handler for sendBtn, ask question, display answer and update history
 * @param {Event} event
 */
async function askQuestion(event) {
  event.preventDefault();

  const question = questionElem.value;

  // or use PGAskQuestionWithoutQuestionHistory
  const answer = await sendPrompt(question, PGAskQuestion);

  answerElem.innerText = answer;
  addQuestionHistory(question, answer);
}

if (typeof sendBtn !== "undefined")
  sendBtn.addEventListener("click", askQuestion);

// #endregion

// #region Quiz utils

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

  const quizQuestion = await sendPrompt("", PGQuizQuestion);
}

async function generateAndDisplayQuizAnswer() {
  // #todo

  const quizAnswer = await sendPrompt("", PGQuizAnswer);
}

function displayQuizQuestion() {
  // #todo
}

// #endregion

export { parseQuestionHistory, getVerifiedQuestionHistory };
