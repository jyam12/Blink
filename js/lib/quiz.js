import defaultQuiz from "/src/default_quiz.json" assert { type: "json" };

/**
 * Get quiz from local storage or set default quiz if not found
 * @returns {QuizEntry[]} a list of quiz entries
 */
function getQuiz() {
  if (localStorage.getItem("quiz") === null) {
    localStorage.setItem("quiz", JSON.stringify(defaultQuiz));
  }
  return JSON.parse(localStorage.getItem("quiz"));
}

/**
 * Store quiz in local storage
 * @param {QuizEntry[]} quiz the quiz to be stored
 */
function storeQuiz(quiz) {
  localStorage.setItem("quiz", JSON.stringify(quiz));
}

/**
 * Add quiz entry to quiz and store quiz in local storage
 * @param {QuizEntry[]} quiz a list of quiz entries
 * @param {String} question the quiz question
 * @param {String} answer the quiz answer
 * @returns {QuizEntry} the added quiz entry
 */
function addQuiz(quiz, question, answer) {
  const entry = {
    id: Date.now(),
    question,
    answer,
  };
  quiz.push(entry);
  storeQuiz(quiz);
  return entry;
}

/**
 * Delete quiz entry by id and store quiz in local storage
 * @param {QuizEntry[]} quiz a list of quiz entries
 * @param {int} id the id of the quiz entry to be deleted
 */
function deleteQuizById(quiz, id) {
  const index = quiz.findIndex((entry) => entry.id === id);

  quiz.splice(index, 1);
  storeQuiz(quiz);
}

/**
 * Update quiz question by id and store quiz in local storage
 * @param {QuizEntry[]} quiz a list of quiz entries
 * @param {int} id the id of the quiz entry to be updated
 * @param {String} question the new question
 */
function updateQuizQuestionById(quiz, id, question) {
  const index = quiz.findIndex((entry) => entry.id === id);

  quiz[index].question = question;
  storeQuiz(quiz);
}

/**
 * Update quiz answer by id and store quiz in local storage
 * @param {QuizEntry[]} quiz a list of quiz entries
 * @param {int} id the id of the quiz entry to be updated
 * @param {String} answer the new answer
 */
function updateQuizAnswerById(quiz, id, answer) {
  const index = quiz.findIndex((entry) => entry.id === id);

  quiz[index].answer = answer;
  storeQuiz(quiz);
}

export {
  getQuiz,
  addQuiz,
  deleteQuizById,
  updateQuizQuestionById,
  updateQuizAnswerById,
};
