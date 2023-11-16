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

// #endregion

// var coll = document.getElementsByClassName("collapsible");
// var i;

// for (i = 0; i < coll.length; i++) {
//   coll[i].addEventListener("click", function () {
//     this.classList.toggle("active");
//     var content = this.nextElementSibling;
//     if (content.style.display === "block") {
//       content.style.display = "none";
//     } else {
//       content.style.display = "block";
//     }
//   });
// }
