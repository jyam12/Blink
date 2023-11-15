import { sendPrompt, PGAskQuestion } from "./gpt.js";
import { addQuestionHistory } from "./question_asked.js";

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
  document.getElementById("closeForm").style.display = "none";
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
