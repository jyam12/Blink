import { sendPrompt, PGAskQuestion } from "./gpt.js";
import { addQuestionHistory } from "./question_asked.js";

// #region Chat Popup

const openChatBtn = document.getElementById("open-chat-btn");
const closeChatBtn = document.getElementById("close-chat-btn");
const chatPopupElem = document.getElementById("chat-popup");

/**
 * Event handler for openFormBtn
 */
openChatBtn.addEventListener(
  "click",
  () => (chatPopupElem.style.display = "block")
);

/**
 * Event handler for closeFormBtn
 */
closeChatBtn.addEventListener(
  "click",
  () => (chatPopupElem.style.display = "none")
);

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
