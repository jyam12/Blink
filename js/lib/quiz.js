import defaultQuiz from "/src/default_quiz.json" assert { type: "json" };

class QuizEntry {
  constructor(id, question, answer, timeStamp) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.timeStamp = timeStamp;
  }
}

class QuizDatabase {
  constructor() {
    this.quiz = this.getQuiz();
  }

  // #region Local Storage

  /**
   * Get quiz from local storage or set default quiz if not found
   * @returns {QuizEntry[]} a list of quiz entries
   */
  getQuiz() {
    if (localStorage.getItem("quiz") === null) {
      localStorage.setItem("quiz", JSON.stringify(defaultQuiz));
    }
    return JSON.parse(localStorage.getItem("quiz"));
  }

  /**
   * Store quiz in local storage
   * @param {QuizEntry[]} quiz the quiz to be stored
   */
  storeQuiz() {
    localStorage.setItem("quiz", JSON.stringify(this.quiz));
  }

  // #endregion

  // #region Getters

  getById(id) {
    return this.quiz.find((entry) => entry.id === id);
  }

  // #endregion

  // #region Operations

  /**
   * Add quiz entry to quiz and store quiz in local storage
   * @param {String} question the quiz question
   * @param {String} answer the quiz answer
   * @returns {QuizEntry} the added quiz entry
   */
  addEntry(question, answer) {
    const entry = new QuizEntry(Date.now(), question, answer, "0:00");

    this.quiz.push(entry);
    this.storeQuiz();
    return entry;
  }

  /**
   * Delete quiz entry by id and store quiz in local storage
   * @param {QuizEntry[]} quiz a list of quiz entries
   * @param {int} id the id of the quiz entry to be deleted
   * @returns {QuizEntry} the deleted quiz entry
   */
  deleteById(id) {
    const delEntry = this.getById(id);
    this.quiz = this.quiz.filter((entry) => entry !== delEntry);
    this.storeQuiz();
    return delEntry;
  }

  /**
   * Update quiz question by id and store quiz in local storage
   * @param {int} id the id of the quiz entry to be updated
   * @param {String} question the new question
   * @returns {QuizEntry} the updated quiz entry
   */
  updateQuestionById(id, question) {
    const entry = this.getById(id);
    entry.question = question;
    this.storeQuiz();

    return entry;
  }

  /**
   * Update quiz answer by id and store quiz in local storage
   * @param {int} id the id of the quiz entry to be updated
   * @param {String} answer the new answer
   * @returns {QuizEntry} the updated quiz entry
   */
  updateAnswerById(id, answer) {
    const entry = this.getById(id);

    entry.answer = answer;
    this.storeQuiz();
    return entry;
  }

  updateTimeStampById(id, timeStamp) {
    const entry = this.getById(id);

    entry.timeStamp = timeStamp;
    this.storeQuiz();
    return entry;
  }

  // #endregion
}

export { QuizDatabase, QuizEntry };
