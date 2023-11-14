import data from "./data.json" assert { type: "json" };
import { parseQuestionHistory, getVerifiedQuestionHistory } from "./website.js";
const { transcript, apikey, openAIURL } = data;

// #region PromptGenerators

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
  const verified = getVerifiedQuestionHistory();
  const history = parseQuestionHistory(verified);

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
  const verified = getVerifiedQuestionHistory();
  const history = parseQuestionHistory(verified);

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
  const verified = getVerifiedQuestionHistory();
  const history = parseQuestionHistory(verified);

  const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${transcript}. \n\nYou also have answered some students' questions: \n${history}`;
  const content = `You want to test whether students understand what you have taught. You will come up with a quiz question based on what you have presented in the lecture and what student have asked. The quiz question you come up with is: "${question}". \n\nWhat is the answer to this quiz question?`;

  const prompt = generatePrompt(context, content);
  return prompt;
}

// #endregion

// #region GPT utils

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
 * Send request to GPT
 * @param {PromptObject} prompt the prompt for GPT
 * @returns the response promise from GPT
 */
async function sendRequest(prompt) {
  let openAIRequest = {
    url: openAIURL,
    method: "POST",
    data: JSON.stringify(prompt),
    headers: {
      "Content-Type": "application/json",
      "api-key": apikey,
      "Cache-Control": "no-cache",
    },
  };

  // use proxy to avoid CORS issue
  let proxyRequest = {
    method: "POST",
    url: "https://cors-proxy1.p.rapidapi.com/v1",
    headers: {
      "content-type": "application/json",
      "x-rapidapi-host": "cors-proxy1.p.rapidapi.com",
      "x-rapidapi-key": "6b365f6db2mshf7c7b122917d7d8p104b18jsn706a31e92355",
    },
    data: openAIRequest,
  };

  const response = await axios.request(proxyRequest);

  return response;
}

/**
 * Parse response from GPT
 * @param {Promose} response the response from GPT
 * @returns the answer from GPT
 */
function parseResponse(response) {
  response = JSON.parse(response.data.text);
  const ans = response.choices[0].message.content;
  return ans;
}

/**
 * Send prompt to GPT and return the answer
 * @param {String} msg the question asked by the user
 * @param {function} promptGenerator function that generates prompt for GPT
 * @returns {Promise<String>} the answer from GPT
 */
async function sendPrompt(msg, promptGenerator) {
  const prompt = promptGenerator(msg);
  console.log(prompt);

  let response = await sendRequest(prompt);

  return parseResponse(response);
}
// #endregion

export { sendPrompt, PGAskQuestion, PGQuizQuestion, PGQuizAnswer };
