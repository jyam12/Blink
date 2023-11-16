import { getQuestionHistory } from "./lib/history.js";

const history = getQuestionHistory();

// #region Report Popup

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
