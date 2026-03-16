const axios = require('axios');

const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

const chat = async (message, history = []) => {
  const response = await axios.post(`${AI_AGENT_URL}/chat`, {
    message,
    history,
  });
  return response.data;
};

module.exports = { chat };