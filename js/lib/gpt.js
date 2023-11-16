import gptInfo from "/src/gpt.json" assert { type: "json" };
const { openAIURL, apikey } = gptInfo;

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

export { sendPrompt };
