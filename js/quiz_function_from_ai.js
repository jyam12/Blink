import { QuizDatabase, QuizEntry } from "/js/lib/quiz.js";
import { GPTManger, PromptGenerator } from "/js/lib/gpt.js";
import { HistoryDatabase, HistoryEntry } from "/js/lib/history.js";

const defaultQuizEntry = new QuizEntry(
  0,
  "Please wait...",
  "Please wait...",
  "0:00"
);

class QuizEntryComponent {
  constructor(entry, quizManager) {
    this.quizManager = quizManager;

    if (entry) this.entry = entry;
    else this.entry = defaultQuizEntry;

    this.setup();

    if (!entry) {
      console.log("defaultQuizEntry");
      this.quizManager.generateEntry().then((newEntry) => {
        this.update(newEntry);
        QuizManager.resizeAllQuestions();
      });
    }
  }

  //#region setup

  setup() {
    this.basicElems = this.constructBasicElems(this.entry.id);
    this.operationElem = this.constructOperationElem(this.basicElems);
    this.elem = this.constructElem(
      this.basicElems,
      this.operationElem,
      this.entry.id
    );
    this.addEventListeners();
  }

  constructBasicElems(id) {
    const queElem = document.createElement("textarea");
    queElem.classList.add("quiz-question");
    // Johnny: collapsible->collapsibleforquestion
    queElem.classList.add("collapsibleforquestion");
    queElem.value = this.entry.question;

    const ansElem = document.createElement("textarea");
    ansElem.classList.add("quiz-answer");
    ansElem.value = this.entry.answer;

    const labelElem = document.createElement("label");
    labelElem.innerText = "Timestamp: ";
    labelElem.setAttribute("for", "timestamp");

    const timeStampElem = document.createElement("input");
    timeStampElem.setAttribute("type", "text");
    timeStampElem.setAttribute("name", "timestamp-" + id);
    timeStampElem.setAttribute("placeholder", "0:00");
    timeStampElem.classList.add("timestamp");
    timeStampElem.value = this.entry.timeStamp;

    const correctRateElem = document.createElement("span");
    correctRateElem.classList.add("correct-rate");
    correctRateElem.style.paddingLeft = "10px";
    correctRateElem.innerText = "Correct Rate: 60%";

    const regenerateQnABtnElem = document.createElement("button");
    regenerateQnABtnElem.innerText = "Regenerate Q&A";
    regenerateQnABtnElem.classList.add("regenerate-qna");

    const regenerateAnsBtnElem = document.createElement("button");
    regenerateAnsBtnElem.innerText = "Regenerate Answer";
    regenerateAnsBtnElem.classList.add("regenerate-ans");

    const saveBtnElem = document.createElement("button");
    saveBtnElem.innerText = "Save";
    saveBtnElem.classList.add("save");

    const deleteBtnElem = document.createElement("button");
    deleteBtnElem.innerText = "Delete";
    deleteBtnElem.classList.add("delete-quiz");
    // Johnny: I Have reversed the order of button
    return {
      queElem,
      ansElem,
      labelElem,
      timeStampElem,
      correctRateElem,
      deleteBtnElem,
      saveBtnElem,
      regenerateAnsBtnElem,
      regenerateQnABtnElem,
    };
  }

  addEventListeners() {
    this.basicElems.queElem.addEventListener("keyup", (e) => {
      e.target.style.height = e.target.scrollHeight + "px";
    });

    this.basicElems.queElem.addEventListener("click", (e) => {
      const contentStyle = this.operationElem.style;
      contentStyle.display = contentStyle.display === "none" ? "block" : "none";
    });

    this.basicElems.ansElem.addEventListener("focus", (e) => {
      e.target.style.height = "1px";
      e.target.style.height = 25 + e.target.scrollHeight + "px";
    });
    this.basicElems.ansElem.addEventListener(
      "focusout",
      (e) => (e.target.style.height = 100 + "%")
    );

    this.basicElems.regenerateQnABtnElem.addEventListener("click", () =>
      this.regenerateQnA()
    );

    this.basicElems.regenerateAnsBtnElem.addEventListener("click", () =>
      this.regenerateAns()
    );

    this.basicElems.saveBtnElem.addEventListener("click", () => {
      this.save();
      window.alert("Change saved!");
    });

    this.basicElems.deleteBtnElem.addEventListener("click", () => {
      this.delelete();
      window.alert("Quiz Question deleted!");
    });
  }

  constructOperationElem(basicElements) {
    const operationElem = document.createElement("div");
    operationElem.classList.add("operations");
    // Johnny: content->operationcontent
    operationElem.classList.add("operationcontent");
    for (const key in basicElements)
      if (key != "queElem") operationElem.appendChild(basicElements[key]);

    operationElem.style.display = "none";

    return operationElem;
  }

  constructElem(basicElements, operationElem, id) {
    const elem = document.createElement("div");
    elem.classList.add("quiz-entry");
    elem.appendChild(basicElements.queElem);
    elem.appendChild(operationElem);
    elem.setAttribute("id", id);
    return elem;
  }

  //#endregion

  //#region operations

  update(entry) {
    this.entry = entry;
    this.basicElems.ansElem.value = entry.answer;
    this.basicElems.queElem.value = entry.question;
    this.basicElems.timeStampElem.value = entry.timeStamp;
    this.basicElems.labelElem.setAttribute("for", "timestamp-" + entry.id);
    this.elem.setAttribute("id", entry.id);
  }

  delelete() {
    this.quizManager.deleteEntry(this.entry);
    this.elem.remove();
  }

  save() {
    this.entry.question = this.basicElems.queElem.value;
    this.entry.answer = this.basicElems.ansElem.value;
    this.entry.timeStamp = this.basicElems.timeStampElem.value;
    this.quizManager.updateEntry(this.entry);
  }

  async regenerateQnA() {
    this.basicElems.queElem.value = "Please wait...";
    this.basicElems.ansElem.value = "Please wait...";

    this.save();
    this.entry.question = await this.quizManager.generateQuestion();
    this.entry.answer = await this.quizManager.generateAnswer(
      this.entry.question
    );

    this.quizManager.updateEntry(this.entry);
    this.update(this.entry);
    QuizManager.resizeAllQuestions();
  }

  async regenerateAns() {
    this.basicElems.ansElem.value = "Please wait...";

    this.save();
    this.entry.answer = await this.quizManager.generateAnswer(
      this.entry.question
    );

    this.quizManager.updateEntry(this.entry);
    this.update(this.entry);
  }

  //#endregion
}

class QuizManager {
  constructor(quizListElem) {
    this.quizListElem = quizListElem;
  }

  //#region setup
  setup(quizDatabase, queGpt, ansGpt) {
    this.quizDatabase = quizDatabase;
    this.queGpt = queGpt;
    this.ansGpt = ansGpt;
    this.setupEntryComponents();
    this.newQuizBtnElem = this.setupNewQuizBtnElem();
  }

  setupEntryComponents() {
    this.quizListElem.innerHTML = "";
    const entries = this.quizDatabase.quiz;

    entries.forEach((quizEntry) => {
      const component = new QuizEntryComponent(quizEntry, this);
      this.quizListElem.appendChild(component.elem);
    });
  }

  setupNewQuizBtnElem() {
    const newQuizBtnElem = document.createElement("button");
    newQuizBtnElem.innerText = "New Quiz";
    newQuizBtnElem.classList.add("new_quiz");

    newQuizBtnElem.addEventListener("click", () => {
      let num = window.prompt(
        "How many new quiz entries do you want to generate?",
        1
      );
      num = parseInt(num);
      if (isNaN(num)) return;
      this.addNewEntryComponents(num);
    });

    this.quizListElem.appendChild(newQuizBtnElem);
    return newQuizBtnElem;
  }

  static resizeAllQuestions() {
    const queElem = document.getElementsByClassName("quiz-question");
    Array.from(queElem).forEach((question) => {
      question.style.height = question.scrollHeight + "px";
    });
  }

  static addCollapsibleEventListenersToAllVideos() {
    // add collapsible to video and quiz list
    const collBtns = document.getElementsByClassName("collapsible_for_Video");
    Array.from(collBtns).forEach((btn) => {
      let contentStyle = btn.nextElementSibling.style;
      contentStyle.display = "none";

      btn.addEventListener("click", (e) => {
        btn.classList.toggle("active");
        contentStyle.display =
          contentStyle.display === "none" ? "block" : "none";
        QuizManager.resizeAllQuestions();
      });
    });
  }

  //#endregion

  //#oerations

  addNewEntryComponents(num) {
    for (let i = 0; i < num; i++) {
      const newEntryComponent = new QuizEntryComponent(null, this);
      this.quizListElem.insertBefore(
        newEntryComponent.elem,
        this.newQuizBtnElem
      );
    }
  }

  deleteEntry(entry) {
    this.quizDatabase.deleteById(entry.id);
  }

  updateEntry(entry) {
    this.quizDatabase.updateQuestionById(entry.id, entry.question);
    this.quizDatabase.updateAnswerById(entry.id, entry.answer);
    this.quizDatabase.updateTimeStampById(entry.id, entry.timeStamp);
  }

  addEntry(entry) {
    return this.quizDatabase.addEntry(entry.question, entry.answer);
  }

  async generateQuestion() {
    return await this.queGpt.send(null);
  }

  async generateAnswer(question) {
    return await this.ansGpt.send(question);
  }

  async generateEntry() {
    const question = await this.generateQuestion();
    const answer = await this.generateAnswer(question);
    const entry = this.quizDatabase.addEntry(question, answer);
    return entry;
  }
}

// #endregion

// #region main
const quizDatabase = new QuizDatabase();
const historyDatabase = new HistoryDatabase();

const pg = new PromptGenerator();
pg.setup(historyDatabase);

const queGpt = new GPTManger();
queGpt.setup(pg.quizQuestion.bind(pg));

const ansGpt = new GPTManger();
ansGpt.setup(pg.quizAnswer.bind(pg));

const quizListElem = document.getElementById("quiz-list");
const quizManager = new QuizManager(quizListElem);
quizManager.setup(quizDatabase, queGpt, ansGpt);
QuizManager.addCollapsibleEventListenersToAllVideos();

// #endregion
