import questionHistory from "./history.json" assert { type: "json" };

// #region QuestionHistory utils

/**
 * Parse question history into string format
 * @param {Entry[]} history a list of question history entries
 * @returns {String} the parsed question history in string format
 */
function parseQuestionHistory(history) {
  let parsedHistory = "[";
  for (const entry of history) {
    parsedHistory += `{ question: "${entry.question}", answer: "${entry.answer}" }, `;
  }
  parsedHistory += "]";
  return parsedHistory;
}

/**
 * Add question history entry to question history
 * @param {String} question the question asked by the student
 * @param {String} answer the answer given by GPT
 */
function addQuestionHistory(question, answer) {
  const entry = {
    id: Date.now(),
    question,
    answer,
    verified: false,
  };
  questionHistory.history.push(entry);
  console.log(questionHistory);
}

/**
 * Get verified question history
 * @returns {Entry[]} a list of verified question history entries
 */
function getVerifiedQuestionHistory() {
  const verifiedQuestionHistory = questionHistory.history.filter(
    (entry) => entry.verified
  );
  return verifiedQuestionHistory;
}

/**
 * Verify a question history entry
 * @param {int} id the id of the question history entry
 */
function verfiyQuestionHistory(id) {
  const entry = questionHistory.history.find((entry) => entry.id === id);
  entry.verified = true;
}

// #endregion

export {
  addQuestionHistory,
  parseQuestionHistory,
  getVerifiedQuestionHistory,
  verfiyQuestionHistory,
};
