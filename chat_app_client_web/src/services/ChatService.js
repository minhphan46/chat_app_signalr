// chatService.js
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axios from "axios";
import { API_CHAT_URL, GetAPIMessagesUrl } from "../constants/ApiUrl";
import {
  computeSecret,
  encryptMessage,
  decryptMessage,
} from "../services/E2EEService";

export const joinPublicChatRoom = async (
  username,
  setUsername,
  setRoomId,
  setMessages,
  setConnection,
  userId,
  roomId
) => {
  try {
    setUsername(username);
    setRoomId(roomId); // Save the RoomID if provided
    // initiate a connection
    const conn = new HubConnectionBuilder()
      .withUrl(API_CHAT_URL)
      .configureLogging(LogLevel.Information)
      .build();

    // setup connection listeners
    conn.on("ReceiveMessage", (res) => {
      try {
        const {
          userId,
          userName: username,
          messageText: msg,
          createDate: time,
        } = res;
        setMessages((prevMessages) => [
          ...prevMessages,
          { userId, username, msg, time },
        ]);
      } catch (error) {
        console.error("Error parsing message: ", error, res);
      }
    });

    // start the connection
    await conn.start();
    await conn.invoke("JoinUser", username, userId);

    // set the connection state
    setConnection(conn);
  } catch (error) {
    console.error("Connection error: ", error);
  }
};

export const joinPrivateChatRoom = async (
  username,
  roomId,
  setUsername,
  setRoomId,
  setMessages,
  setConnection,
  userId,
  publickey,
  setSecret
) => {
  try {
    setUsername(username);
    setRoomId(roomId);
    const conn = new HubConnectionBuilder()
      .withUrl(API_CHAT_URL)
      .configureLogging(LogLevel.Information)
      .build();

    var secretkey = null;

    conn.on("ReceiveMessageChatRoom", (res) => {
      try {
        var {
          userId,
          userName: username,
          messageText: msg,
          createDate: time,
        } = res;

        if (userId !== 0) {
          msg = decryptMessage(msg, secretkey);
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { userId, username, msg, time },
        ]);
      } catch (error) {
        console.error("Error parsing message: ", error, res);
      }
    });

    conn.on("ReceivePublicKey", async (res) => {
      try {
        const inputPublicKey = res;
        console.log("Received public key: ", res);
        if (publickey && inputPublicKey) {
          secretkey = await computeSecret(inputPublicKey);
          setSecret(secretkey);
          console.log("Secret key: ", secretkey);

          // add a system message to the chat
          const newMessage = {
            userId: 0,
            username: "system",
            msg: "Secret key: " + secretkey,
            time: Date(),
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      } catch (error) {
        console.error("Error parsing message: ", error, res);
      }
    });

    await conn.start();
    await conn.invoke(
      "JoindSpecificChatRoom",
      username,
      userId,
      roomId,
      publickey
    );

    setConnection(conn);
  } catch (error) {
    console.error("Connection error: ", error);
  }
};

export const sendMessage = async (
  connection,
  isPrivate,
  username,
  userId,
  messageText,
  roomId,
  secretKey
) => {
  try {
    if (connection) {
      if (isPrivate) {
        const encryptedMessage = encryptMessage(messageText, secretKey);

        await connection.invoke(
          "SendMessageChatRoom",
          username,
          userId,
          encryptedMessage,
          roomId
        );
        return;
      }
      await connection.invoke("SendUserMessage", username, userId, messageText);
    } else {
      console.error("No connection to server.");
    }
  } catch (error) {
    console.error("Send message error: ", error);
  }
};

export const leaveChatRoom = async (connection, setConnection, setMessages) => {
  try {
    if (connection) {
      await connection.stop();
      setConnection(null);
      setMessages([]);
    }
  } catch (error) {
    console.error("Leave chat room error: ", error);
  }
};

export const fetchOldMessages = async (roomId, setMessages) => {
  try {
    const response = await axios.get(GetAPIMessagesUrl(roomId));
    const oldMessages = response.data;

    oldMessages.forEach((messageObj) => {
      const {
        userId,
        userName: username,
        messageText: msg,
        createDate: time,
      } = messageObj;
      setMessages((prevMessages) => [
        { userId, username, msg, time },
        ...prevMessages,
      ]);
    });
  } catch (error) {
    console.error("Error fetching old messages: ", error);
  }
};
