import { GPTManger, PromptGenerator } from "/js/lib/gpt.js";
import { HistoryDatabase } from "/js/lib/history.js";

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

  answerElem.innerText = answer;
  historyDatabase.addEntry(question, answer);
});

// #endregion
