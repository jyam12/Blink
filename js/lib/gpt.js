import gptInfo from "/src/gpt.json" assert { type: "json" };

class Prompt {
  constructor(context, content) {
    this.model = "gpt-35-turbo";
    this.messages = [
      {
        role: "system",
        content: context,
      },
      { role: "user", content: content },
    ];
  }
}

class PromptGenerator {
  constructor() {
    this.transcript = gptInfo.transcript;
  }

  setup(historyDatabase) {
    this.historyDatabase = historyDatabase;
  }

  /**
   * Prompt generator for asking question from students. This function will not use the question history.
   * @param {String} question
   * @returns {PromptObject}the prompt for GPT
   */
  askQuestionWithoutQuestionHistory(question) {
    const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: "${transcript}"`;
    const content = `A student in the lecture asked: "${question}". How do you respond?`;
    const prompt = new Prompt(context, content);
    return prompt;
  }

  /**
   * Prompt generator for asking question from students. This function will use the question history.
   * @param {String} question the question asked by the student
   * @returns {PromptObject} the prompt for GPT
   */
  askQuestion(question) {
    console.log(this.historyDatabase);

    const history = this.historyDatabase.parseToString(
      this.historyDatabase.verified
    );

    const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${this.transcript}. \n\nYou also have answered some students' questions before: \n${history}`;
    const content = `A student in the lecture asked: "${question}". \n\nBased on what you haved presented and what you have answered in the lecture, how do you respond to this student?`;
    const prompt = new Prompt(context, content);
    return prompt;
  }

  /**
   * Prompt generator for quiz question.
   * @param {String} _ placeholder, not used
   * @returns {PromptObject} the prompt for GPT
   */
  quizQuestion(_) {
    const history = this.historyDatabase.parseToString(
      this.historyDatabase.verified
    );

    const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${this.transcript}. \n\nYou also have answered some students' questions: \n${history}`;
    const content = `You want to test whether students understand what you have taught. You will come up with a quiz question based on what you have presented in the lecture and what student have asked. If many students asked questions on some concepts, then maybe many students don't understand these concept, and it may be better to have a quiz question related to these concepts. \n\nWhat is the quiz question you will come up with?`;
    const prompt = generatePrompt(context, content);
    return prompt;
  }

  /**
   * Prompt generator for quiz answer given a quiz question.
   * @param {String} question the quiz question
   * @returns {PromptObject} the prompt for GPT
   */
  quizAnswer(question) {
    const history = this.historyDatabase.parseToString(
      this.historyDatabase.verified
    );

    const context = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: \n${this.transcript}. \n\nYou also have answered some students' questions: \n${history}`;
    const content = `You want to test whether students understand what you have taught. You will come up with a quiz question based on what you have presented in the lecture and what student have asked. The quiz question you come up with is: "${question}". \n\nWhat is the answer to this quiz question?`;

    const prompt = generatePrompt(context, content);
    return prompt;
  }

  report(_) {
    const questions = this.historyDatabase.history.map(
      (entry) => entry.question
    );
    const questionStr = questions.join("\n");

    const context = `You are an professional question summarizer working for a university course on software engineering. You are tasked to summarize the questions asked by students in the lecture such that the instructor of the course can understand better of what students don't understand. You have access to the following questions asked by students: \n${questionStr} `;

    const content = `Craft a summary of the questions asked by students. Please follow the folloing guidlines: 
    1. Incorporate main ideas and essential information, eliminating extraneous language and focusing on critical aspects.
    2. Rely strictly on the provided questions asked by students, without including external information.
    3. Format the summary in paragraph form for easy understanding.
    4. Ignore content that are not related to the lecture, such as greeting.
    5. Do not include the responses from the instructor.`;

    return new Prompt(context, content);
  }
}

class GPTManger {
  constructor() {}

  setup(generatePrompt) {
    this.generatePrompt = generatePrompt;
  }

  /**
   * Send request to GPT
   * @param {PromptObject} prompt the prompt for GPT
   * @returns the response promise from GPT
   */
  async sendRequest(prompt) {
    const request = {
      method: "POST",
      url: "https://gptproxy.timho1047.workers.dev/",
      data: JSON.stringify(prompt),
    };

    const response = await axios.request(request);

    return response;
  }

  /**
   * Parse response from GPT
   * @param {Promise} response the response from GPT
   * @returns the answer from GPT
   */
  parseResponse(response) {
    return response.data.choices[0].message.content;
  }

  /**
   * Send prompt to GPT and return the answer
   * @param {String} msg the question asked by the user
   * @param {function} promptGenerator function that generates prompt for GPT
   * @returns {Promise<String>} the answer from GPT
   */
  async send(msg) {
    const prompt = this.generatePrompt(msg);
    console.log(prompt);

    let response = await this.sendRequest(prompt);

    return this.parseResponse(response);
  }
}

export { GPTManger, PromptGenerator, Prompt };
