import gptInfo from "/src/gpt.json" assert { type: "json" };
import {
  getQuestionHistory,
  getVerifiedQuestionHistory,
  parseQuestionHistory,
} from "/js/lib/history.js";
const { transcript } = gptInfo;

/**
 * Generate prompt for GPT given context and content.
 * @param {String} context the context for GPT
 * @param {String} content the content for GPT
 * @returns {PromptObject} the prompt for GPT
 */
function generatePrompt(context, content) {
  const prompt = {
    model: "gpt-35-turbo",
    messages: [
      {
        role: "system",
        content: context,
      },
      { role: "user", content: content },
    ],
  };

  return prompt;
}

/**
 * Prompt generator for asking question from students. This function will not use the question history.
 * @param {String} question
 * @returns {PromptObject}the prompt for GPT
 */
function PGAskQuestionWithoutQuestionHistory(question) {
  const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: "${transcript}"`;
  const content = `A student in the lecture asked: "${question}". How do you respond?`;
  const prompt = generatePrompt(context, content);
  return prompt;
}

/**
 * Prompt generator for asking question from students. This function will use the question history.
 * @param {String} question the question asked by the student
 * @returns {PromptObject} the prompt for GPT
 */
function PGAskQuestion(question) {
  const history = parseQuestionHistory(
    getVerifiedQuestionHistory(getQuestionHistory())
  );

  const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${transcript}. \n\nYou also have answered some students' questions before: \n${history}`;
  const content = `A student in the lecture asked: "${question}". \n\nBased on what you haved presented and what you have answered in the lecture, how do you respond to this student?`;
  const prompt = generatePrompt(context, content);
  return prompt;
}

/**
 * Prompt generator for quiz question.
 * @param {String} _ placeholder, not used
 * @returns {PromptObject} the prompt for GPT
 */
function PGQuizQuestion(_) {
  const history = parseQuestionHistory(
    getVerifiedQuestionHistory(getQuestionHistory())
  );

  const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${transcript}. \n\nYou also have answered some students' questions: \n${history}`;
  const content = `You want to test whether students understand what you have taught. You will come up with a quiz question based on what you have presented in the lecture and what student have asked. If many students asked questions on some concepts, then maybe many students don't understand these concept, and it may be better to have a quiz question related to these concepts. \n\nWhat is the quiz question you will come up with?`;
  const prompt = generatePrompt(context, content);
  return prompt;
}

/**
 * Prompt generator for quiz answer given a quiz question.
 * @param {String} question the quiz question
 * @returns {PromptObject} the prompt for GPT
 */
function PGQuizAnswer(question) {
  const history = parseQuestionHistory(
    getVerifiedQuestionHistory(getQuestionHistory())
  );

  const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${transcript}. \n\nYou also have answered some students' questions: \n${history}`;
  const content = `You want to test whether students understand what you have taught. You will come up with a quiz question based on what you have presented in the lecture and what student have asked. The quiz question you come up with is: "${question}". \n\nWhat is the answer to this quiz question?`;

  const prompt = generatePrompt(context, content);
  return prompt;
}

export {
  PGAskQuestion,
  PGAskQuestionWithoutQuestionHistory,
  PGQuizQuestion,
  PGQuizAnswer,
};
