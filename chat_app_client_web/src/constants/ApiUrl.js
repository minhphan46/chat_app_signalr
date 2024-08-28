const SERVER_URL =
  //"https://app-chat-dev-001-czg2hthmanhxeycs.eastus-01.azurewebsites.net";
  "http://localhost:5260";

const CHAT_ENDPOINT = "/chat";

export const API_CHAT_URL = SERVER_URL + CHAT_ENDPOINT;

export const GetAPIMessagesUrl = (roomId) => {
  if (roomId.trim()) {
    return `${SERVER_URL}/api/messages?filterOn=room_id&filterQuery=${roomId}&sortBy=create_date&isAscending=false&pageNumber=1&pageSize=20`;
  }
  return `${SERVER_URL}/api/messages?filterOn=room_id&sortBy=create_date&isAscending=false&pageNumber=1&pageSize=20`;
};
