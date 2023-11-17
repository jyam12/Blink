import { HistoryDatabase } from "./lib/history.js";
import { GPTManger, PromptGenerator } from "./lib/gpt.js";

// #region Utils

class ReportManager {
  constructor(
    openReportBtn,
    closeReportBtn,
    reportPopupElem,
    reportContentElem
  ) {
    this.openReportBtn = openReportBtn;
    this.closeReportBtn = closeReportBtn;
    this.reportPopupElem = reportPopupElem;
    this.reportContentElem = reportContentElem;
  }

  setup(gptManger) {
    this.gptManger = gptManger;
    this.setupOpen();
    this.setupClose();
  }

  /**
   * Event handler for openFormBtn
   */
  setupOpen() {
    this.openReportBtn.addEventListener("click", async () => {
      this.reportPopupElem.style.display = "block";
      await this.generateReport();
    });
  }

  /**
   * Event handler for closeFormBtn
   */
  setupClose() {
    this.closeReportBtn.addEventListener(
      "click",
      () => (this.reportPopupElem.style.display = "none")
    );
  }

  /**
   * Generate report content and display it
   */
  async generateReport() {
    this.reportContentElem.innerText = "Please wait...";
    const report = await this.gptManger.send(null);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // const report = "this is a report";
    this.reportContentElem.innerText = report;
  }
}

/**
 * Add event listeners to collapsible elements
 * @param {HTMLElement} trigger the HTML element that triggers the collapsible
 * @param  {...HTMLElement} contents the HTML elements to be collapsed
 */
function addCollapsibleEventListeners(trigger, displayProperty, ...contents) {
  contents.forEach((content) => (content.style.display = "none"));
  trigger.addEventListener("click", () => {
    contents.forEach((content) => {
      content.classList.toggle("active");
      let display = content.style.display;
      content.style.display =
        display === displayProperty ? "none" : displayProperty;
    });
  });
}

class ContainerElements {
  constructor(toggle, countElem, historyContainer) {
    this.toggle = toggle;
    this.countElem = countElem;
    this.historyContainer = historyContainer;
  }
}

class HistoryManager {
  constructor(videoHistoryCountElem, unverifiedElements, verifiedElements) {
    this.videoHistoryCountElem = videoHistoryCountElem;

    this.unverifiedToggle = unverifiedElements.toggle;
    this.unverifiedCountElem = unverifiedElements.countElem;
    this.unverifiedHistoryContainer = unverifiedElements.historyContainer;

    this.verifiedToggle = verifiedElements.toggle;
    this.verifiedCountElem = verifiedElements.countElem;
    this.verifiedHistoryContainer = verifiedElements.historyContainer;
  }

  /**
   * Add collapsible event listeners to all video history containers
   */
  static addCollapsibleEventListenersToVideoHistories() {
    const collapsibleBtns = document.querySelectorAll(".collapsible_for_Video");
    for (const btn of collapsibleBtns) {
      addCollapsibleEventListeners(btn, "block", btn.nextElementSibling);
    }
  }

  /**
   * Add collapsible event listeners to all question containers
   */
  static addCollapsibleEventListenersToAllQuestionContainers() {
    const questionContainers = document.querySelectorAll(".question-container");
    for (const questionContainer of questionContainers) {
      const questionElem = questionContainer.querySelector(".history-question");
      const otherElems = questionContainer.querySelectorAll(
        ":not(.history-question)"
      );
      addCollapsibleEventListeners(questionElem, "block", ...otherElems);
    }
  }

  // #region Getters

  getQuestionContainerById(id) {
    return document.getElementById(id);
  }

  // #endregion

  // #region Setup
  setup(historyDatabase) {
    this.historyDatabase = historyDatabase;
    this.setupVerified();
    this.setupUnverified();
    this.setAllCountElems();
  }

  setupVerified() {
    const verifiedQuestionContainers = this.generateQuestionContainers(
      this.historyDatabase.verified
    );
    this.appendQuestionContainers(
      this.verifiedHistoryContainer,
      verifiedQuestionContainers
    );
    addCollapsibleEventListeners(
      this.verifiedToggle,
      "block",
      this.verifiedHistoryContainer
    );
  }

  setupUnverified() {
    const unverifiedQuestionContainers = this.generateQuestionContainers(
      this.historyDatabase.unverified
    );
    this.appendQuestionContainers(
      this.unverifiedHistoryContainer,
      unverifiedQuestionContainers
    );
    addCollapsibleEventListeners(
      this.unverifiedToggle,
      "block",
      this.unverifiedHistoryContainer
    );
  }

  generateQuestionContainer(entry) {
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
    answerElem.addEventListener("focus", (e) => {
      e.target.style.height = "1px";
      e.target.style.height = 25 + e.target.scrollHeight + "px";
    });
    answerElem.addEventListener("focusout", (e) => {
      e.target.style.height = 100 + "%";
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-history-question";
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", (e) => this.delete(questionContainer));

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-history-question";
    saveBtn.innerText = "Save";
    saveBtn.addEventListener("click", (e) => this.update(questionContainer));

    const verifyBtn = document.createElement("button");
    verifyBtn.className = "verify-history-question";
    verifyBtn.innerText = "Verify";
    verifyBtn.addEventListener("click", (e) => this.verify(questionContainer));

    questionContainer.appendChild(questionElem);
    questionContainer.appendChild(answerElem);
    questionContainer.appendChild(saveBtn);
    questionContainer.appendChild(deleteBtn);
    if (!verified) questionContainer.appendChild(verifyBtn);

    addCollapsibleEventListeners(
      questionElem,
      "inline-block",
      answerElem,
      deleteBtn,
      saveBtn,
      verifyBtn
    );

    return questionContainer;
  }

  generateQuestionContainers(history) {
    const questionContainers = [];

    for (const entry of history) {
      const questionContainer = this.generateQuestionContainer(entry);
      questionContainers.push(questionContainer);
    }

    return questionContainers;
  }

  appendQuestionContainers(historyContainer, questionContainers) {
    for (const questionContainer of questionContainers) {
      historyContainer.appendChild(questionContainer);
    }
  }

  setCountElem(countElem, count) {
    countElem.innerText = count;
  }

  setAllCountElems() {
    this.setCountElem(
      this.videoHistoryCountElem,
      this.historyDatabase.history.length
    );
    this.setCountElem(
      this.unverifiedCountElem,
      this.historyDatabase.unverified.length
    );
    this.setCountElem(
      this.verifiedCountElem,
      this.historyDatabase.verified.length
    );
  }

  // #endregion

  // #region Operations

  delete(questionContainer) {
    const id = questionContainer.id;
    this.historyDatabase.deleteById(id);
    questionContainer.remove();
    this.setAllCountElems();
  }

  update(questionContainer) {
    const id = questionContainer.id;
    const answer = questionContainer.querySelector(".history-answer").value;
    this.historyDatabase.updateAnswerById(id, answer);
    this.setAllCountElems();
  }

  verify(questionContainer) {
    const id = questionContainer.id;
    const entry = this.historyDatabase.verifyById(id);
    questionContainer.remove();
    const newQuestionContainer = this.generateQuestionContainer(entry);
    this.verifiedHistoryContainer.appendChild(newQuestionContainer);
    this.setAllCountElems();
  }

  // #endregion
}

// #endregion

// #region main

// localStorage.clear();

const verifiedElements = new ContainerElements(
  document.getElementById("verified-toggle"),
  document.getElementById("verified-count"),
  document.getElementById("verified-history")
);
const unverifiedElements = new ContainerElements(
  document.getElementById("unverified-toggle"),
  document.getElementById("unverified-count"),
  document.getElementById("unverified-history")
);

const historyDatabase = new HistoryDatabase();
const historyManager = new HistoryManager(
  document.getElementById("video-history-count"),
  unverifiedElements,
  verifiedElements
);
const reportManager = new ReportManager(
  document.getElementById("open-report-btn"),
  document.getElementById("close-report-btn"),
  document.getElementById("report-popup"),
  document.getElementById("report-content")
);
const promptGenerator = new PromptGenerator();
const gptManger = new GPTManger();

historyManager.setup(historyDatabase);
HistoryManager.addCollapsibleEventListenersToVideoHistories();

promptGenerator.setup(historyDatabase);
gptManger.setup(promptGenerator.report.bind(promptGenerator));
reportManager.setup(gptManger);

// #endregion
