import defaultHistory from "/src/default_history.json" assert { type: "json" };

class HistoryEntry {
  constructor(id, question, answer, verified) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.verified = verified;
  }
}

class HistoryDatabase {
  constructor() {
    this.history = this.getLocalHistory();
  }

  // #region Getters

  /**
   * Get question history from local storage or set default history if not found
   * @returns {HistoryEntry[]} a list of question history entries
   */
  getLocalHistory() {
    if (localStorage.getItem("questionHistory") === null) {
      localStorage.setItem("questionHistory", JSON.stringify(defaultHistory));
    }
    return JSON.parse(localStorage.getItem("questionHistory"));
  }

  /**
   * Parse question history into string format
   * @param {HistoryEntry[]} history a list of question history entries
   * @returns {String} the parsed question history in string format
   */
  parseToString(history) {
    let parsedHistory = "[";
    for (const entry of history) {
      parsedHistory += `{ question: "${entry.question}", \nanswer: "${entry.answer}" }, \n`;
    }
    parsedHistory += "]";
    return parsedHistory;
  }

  /**
   * Get verified question history
   * @returns {HistoryEntry[]} a list of verified question history entries
   */
  get verified() {
    return this.history.filter((entry) => entry.verified);
  }

  /**
   * Get unverified question history
   * @returns a list of unverified question history entries
   */
  get unverified() {
    return this.history.filter((entry) => !entry.verified);
  }

  /**
   * Get question history entry by id
   * @param {int} id the id of the question history entry
   * @returns the question history entry with the given id
   */
  getById(id) {
    return this.history.find((entry) => entry.id == id);
  }

  // #endregion

  // #region Operations
  /**
   * Store question history in local storage
   */
  storeHistory() {
    localStorage.setItem("questionHistory", JSON.stringify(this.history));
  }

  /**
   * Add question history entry to question history
   * @param {String} question the question asked by the student
   * @param {String} answer the answer given by GPT
   * @returns {HistoryEntry} the added question history entry
   */
  addEntry(question, answer) {
    const entry = new HistoryEntry(Date.now(), question, answer, false);

    this.history.push(entry);
    this.storeHistory();
    return entry;
  }

  /**
   * Verify a question history entry and store question history in local storage
   * @param {int} id the id of the question history entry
   * @returns {HistoryEntry} the verified question history entry
   */
  verifyById(id) {
    const entry = this.getById(id);
    console.log(entry);
    entry.verified = true;
    this.storeHistory();
    return entry;
  }

  /**
   * Delete question history entry by id and store question history in local storage
   * @param {int} id the id of the question history entry
   * @returns {HistoryEntry} the deleted question history entry
   */
  deleteById(id) {
    const delEntry = this.getById(id);
    this.history = this.history.filter((entry) => entry !== delEntry);
    this.storeHistory(history);
    return delEntry;
  }

  /**
   * Update question history answer by id and store question history in local storage
   * @param {int} id the id of the question history entry to be updated
   * @param {String} answer the new answer
   * @returns {HistoryEntry} the updated question history entry
   */
  updateAnswerById(id, answer) {
    const entry = this.getById(id);
    entry.answer = answer;
    this.storeHistory();
    return entry;
  }

  // #endregion
}

export { HistoryEntry, HistoryDatabase };
