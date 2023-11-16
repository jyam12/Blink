import { sendPrompt } from "/js/lib/gpt.js";
import { PGAskQuestion } from "/js/lib/prompt_generators.js";
import { addQuestionHistory, getQuestionHistory } from "/js/lib/history.js";

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

const questionElem = document.getElementById("question-textarea");
const answerElem = document.getElementById("answer-textarea");
const askBtn = document.getElementById("ask-btn");
const history = getQuestionHistory();

/**
 * Event for ask-btn, ask question, display answer and update history
 */

askBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const question = questionElem.value;

  // or use PGAskQuestionWithoutQuestionHistory
  const answer = await sendPrompt(question, PGAskQuestion);

  answerElem.innerText = answer;
  addQuestionHistory(history, question, answer);
});

// #endregion
