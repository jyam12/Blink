import {
  getQuestionHistory,
  addQuestionHistory,
  getVerifiedQuestionHistory,
  getUnVerifiedQuestionHistory,
  verfiyQuestionHistoryById,
  deleteQuestionHistoryById,
  updateHistoryAnswerById,
} from "./lib/history.js";

const history = getQuestionHistory();

// #region Report

const openReportBtn = document.getElementById("open-report-btn");
const closeReportBtn = document.getElementById("close-report-btn");
const reportPopupElem = document.getElementById("report-popup");

/**
 * Event handler for openFormBtn
 */
openReportBtn.addEventListener(
  "click",
  () => (reportPopupElem.style.display = "block")
);

/**
 * Event handler for closeFormBtn
 */
closeReportBtn.addEventListener(
  "click",
  () => (reportPopupElem.style.display = "none")
);

// #endregion

// #region History Utils

/**
 * Add event listeners to collapsible elements
 * @param {HTMLElement} trigger the HTML element that triggers the collapsible
 * @param  {...HTMLElement} collapsibleContent the HTML elements to be collapsed
 */
function addCollapsibleEventListeners(trigger, ...collapsibleContent) {
  trigger.addEventListener("click", () => {
    collapsibleContent.forEach((content) => {
      content.classList.toggle("active");
      display = content.style.display;
      content.style.display = display === "block" ? "none" : "block";
    });
  });
}

function generateQuestionContainer(entry) {
  const { id, question, answer, verified } = entry;

  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";
  questionContainer.id = `${id}`;

  const questionElem = document.createElement("button");
  questionElem.className = "history-question collapsible";
  questionElem.innerText = question;

  const answerElem = document.createElement("textarea");
  answerElem.className = "history-answer";
  answerElem.value = answer;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-history-question";
  deleteBtn.innerText = "Delete";

  const verifyBtn = document.createElement("button");
  verifyBtn.className = "verify-history-question";
  verifyBtn.innerText = "Verify";

  questionContainer.appendChild(questionElem);
  questionContainer.appendChild(answerElem);
  questionContainer.appendChild(deleteBtn);
  if (!verified) questionContainer.appendChild(verifyBtn);

  return questionContainer;
}

function generatQuestionContainers(history) {
  const questionContainers = [];

  for (const entry of history) {
    const questionContainer = generateQuestionContainer(entry);
    questionContainers.push(questionContainer);
  }

  return questionContainers;
}

function appendQuestionContainers(historyContainer, questionContainers) {
  for (const questionContainer of questionContainers) {
    historyContainer.appendChild(questionContainer);
  }
}

// #endregion

// #region History

const videoHistoryCountElem = document.getElementById("video-history-count");
const unverifiedCountElem = document.getElementById("unverified-count");
const verifiedCountElem = document.getElementById("verified-count");

const unverifiedToggle = document.getElementById("unverified-toggle");
const verifiedToggle = document.getElementById("verified-toggle");

const unverifiedHistoryContainer =
  document.getElementById("unverified-history");
const verifiedHistoryContainer = document.getElementById("verified-history");

appendQuestionContainers(
  unverifiedHistoryContainer,
  generatQuestionContainers(getUnVerifiedQuestionHistory(history))
);
addCollapsibleEventListeners(unverifiedToggle, unverifiedHistoryContainer);

appendQuestionContainers(
  verifiedHistoryContainer,
  generatQuestionContainers(getVerifiedQuestionHistory(history))
);
addCollapsibleEventListeners(verifiedToggle, verifiedHistoryContainer);

// #endregion
