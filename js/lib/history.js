import defaultHistory from "/src/default_history.json" assert { type: "json" };

/**
 * Get question history from local storage or set default history if not found
 * @returns {HistoryEntry[]} a list of question history entries
 */
function getQuestionHistory() {
  if (localStorage.getItem("questionHistory") === null) {
    localStorage.setItem("questionHistory", JSON.stringify(defaultHistory));
  }
  return JSON.parse(localStorage.getItem("questionHistory"));
}

/**
 * Store question history in local storage
 * @param {HistoryEntry[]} history a list of question history entries
 */
function storeQuestionHistory(history) {
  localStorage.setItem("questionHistory", JSON.stringify(history));
}

/**
 * Parse question history into string format
 * @param {HistoryEntry[]} history a list of question history entries
 * @returns {String} the parsed question history in string format
 */
function parseQuestionHistory(history) {
  let parsedHistory = "[";
  for (const entry of history) {
    parsedHistory += `{ question: "${entry.question}", \nanswer: "${entry.answer}" }, \n`;
  }
  parsedHistory += "]";
  return parsedHistory;
}

/**
 * Add question history entry to question history
 * @param {HistoryEntry[]} history a list of question history entries
 * @param {String} question the question asked by the student
 * @param {String} answer the answer given by GPT
 * @returns {HistoryEntry} the added question history entry
 */
function addQuestionHistory(history, question, answer) {
  const entry = {
    id: Date.now(),
    question,
    answer,
    verified: false,
  };
  history.push(entry);
  storeQuestionHistory(history);
  console.log(history);
  return entry;
}

/**
 * Get verified question history
 * @param {HistoryEntry[]} history a list of question history entries
 * @returns {HistoryEntry[]} a list of verified question history entries
 */
function getVerifiedQuestionHistory(history) {
  return history.filter((entry) => entry.verified);
}

/**
 * Get unverified question history
 * @param {HistoryEntry[]} history a list of question history entries
 * @returns a list of unverified question history entries
 */
function getUnVerifiedQuestionHistory(history) {
  return history.filter((entry) => !entry.verified);
}

/**
 * Verify a question history entry and store question history in local storage
 * @param {HistoryEntry[]} history a list of question history entries
 * @param {int} id the id of the question history entry
 * @returns {HistoryEntry} the verified question history entry
 */
function verfiyQuestionHistoryById(history, id) {
  const entry = history.find((entry) => entry.id === id);
  entry.verified = true;
  storeQuestionHistory(history);
  return entry;
}

/**
 * Delete question history entry by id and store question history in local storage
 * @param {HistoryEntry[]} history the question history
 * @param {int} id the id of the question history entry
 */
function deleteQuestionHistoryById(history, id) {
  const index = history.findIndex((entry) => entry.id === id);

  history.splice(index, 1);
  storeQuestionHistory(history);
}

/**
 * Update question history answer by id and store question history in local storage
 * @param {HistoryEntry[]} history the question history
 * @param {int} id the id of the question history entry to be updated
 * @param {String} answer the new answer
 */
function updateHistoryAnswerById(history, id, answer) {
  const index = history.findIndex((entry) => entry.id === id);

  history[index].answer = answer;
  storeQuestionHistory(history);
}

export {
  getQuestionHistory,
  addQuestionHistory,
  parseQuestionHistory,
  getVerifiedQuestionHistory,
  getUnVerifiedQuestionHistory,
  verfiyQuestionHistoryById,
  deleteQuestionHistoryById,
  updateHistoryAnswerById,
};
