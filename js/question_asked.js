import { HistoryDatabase } from "./lib/history.js";

const HistoryDatabase = new HistoryDatabase();

const videoHistoryCountElem = document.getElementById("video-history-count");
const unverifiedCountElem = document.getElementById("unverified-count");
const verifiedCountElem = document.getElementById("verified-count");

const verifiedToggle = document.getElementById("verified-toggle");
const unverifiedToggle = document.getElementById("unverified-toggle");

const verifiedHistoryContainer = document.getElementById("verified-history");
const unverifiedHistoryContainer =
  document.getElementById("unverified-history");

const openReportBtn = document.getElementById("open-report-btn");
const closeReportBtn = document.getElementById("close-report-btn");
const reportPopupElem = document.getElementById("report-popup");

// #region Report

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

function deleteQuestionContainer(questionContainer) {
  const id = questionContainer.id;
  deleteQuestionHistoryById(history, id);
  questionContainer.remove();
}

function updateQuestionContainer(questionContainer) {
  const id = questionContainer.id;
  const answer = questionContainer.querySelector("#history-answer").value;
  updateHistoryAnswerById(history, id, answer);
}

function verifyQuestionContainer(questionContainer) {
  const id = questionContainer.id;
  const entry = verfiyQuestionHistoryById(history, id);
  questionContainer.remove();
  const newQuestionContainer = generateQuestionContainer(
    entry,
    history,
    verifiedHistoryContainer
  );
  verifiedHistoryContainer.appendChild(newQuestionContainer);
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
  deleteBtn.addEventListener("click", (e) =>
    deleteQuestionContainer(questionContainer)
  );

  const saveBtn = document.createElement("button");
  saveBtn.className = "save-history-question";
  saveBtn.innerText = "Save";
  saveBtn.addEventListener("click", (e) =>
    updateQuestionContainer(questionContainer)
  );

  const verifyBtn = document.createElement("button");
  verifyBtn.className = "verify-history-question";
  verifyBtn.innerText = "Verify";
  verifyBtn.addEventListener("click", (e) =>
    verifyQuestionContainer(questionContainer)
  );

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

// #region main
appendQuestionContainers(
  verifiedHistoryContainer,
  generatQuestionContainers(getVerifiedQuestionHistory(history))
);
addCollapsibleEventListeners(verifiedToggle, verifiedHistoryContainer);

console.log(history);
console.log(getUnVerifiedQuestionHistory(history));
appendQuestionContainers(
  unverifiedHistoryContainer,
  generatQuestionContainers(getUnVerifiedQuestionHistory(history))
);
addCollapsibleEventListeners(unverifiedToggle, unverifiedHistoryContainer);

// #endregion
