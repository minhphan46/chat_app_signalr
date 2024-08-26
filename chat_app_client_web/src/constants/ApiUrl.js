const SERVER_URL =
  "https://app-chat-dev-001-czg2hthmanhxeycs.eastus-01.azurewebsites.net";
// "http://localhost:5260";

const CHAT_ENDPOINT = "/chat";

const GET_MESSAGES_ENDPOINT =
  "/api/messages?sortBy=create_date&isAscending=false&pageNumber=1&pageSize=20";

export const API_CHAT_URL = SERVER_URL + CHAT_ENDPOINT;

export const API_GET_MESSAGES_URL = SERVER_URL + GET_MESSAGES_ENDPOINT;
