import { getQuestionHistory } from "./lib/history.js";

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

// #region History

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
