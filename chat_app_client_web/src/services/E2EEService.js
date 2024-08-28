import crypto from "crypto-browserify";

const curveName = "prime192v1";
// const secretDialogId = "some-random-generated-chat-id";
const keyObject = crypto.createECDH(curveName);

export const generateKeyAsync = async (setPublicKey) => {
  const publicKeyBase64 = keyObject.generateKeys().toString("base64");
  setPublicKey(publicKeyBase64);
};

export const computeSecret = async (otherPublicKey) => {
  console.log("Received public key: ", otherPublicKey);
  const receivedPublicKey = Buffer.from(otherPublicKey, "base64");
  const secretKey = keyObject.computeSecret(receivedPublicKey);
  return secretKey.toString("base64");
};

export const encryptMessage = (message, secret) => {
  // Tạo một IV (Initialization Vector) cho AES
  const iv = crypto.randomBytes(16);

  // Tạo đối tượng Cipher với thuật toán AES-256-CBC
  const cipher = crypto.createCipheriv("aes-256-cbc", secret.slice(0, 32), iv);

  // Mã hóa tin nhắn
  let encryptedMessage = cipher.update(message, "utf8", "hex");
  encryptedMessage += cipher.final("hex");

  // Kết hợp IV với message mã hóa (vì bạn cần IV để giải mã)
  const encryptedPayload = iv.toString("hex") + ":" + encryptedMessage;
  return encryptedPayload;
};

export const decryptMessage = (encrypted, secret) => {
  console.log("Encrypted message: ", encrypted);
  console.log("Secret key: ", secret);
  // Tách IV và phần mã hóa của tin nhắn
  const parts = encrypted.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];

  // Tạo đối tượng Decipher với thuật toán AES-256-CBC
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secret.slice(0, 32),
    iv
  );

  // Giải mã tin nhắn
  let decryptedMessage = decipher.update(encryptedText, "hex", "utf8");
  decryptedMessage += decipher.final("utf8");
  return decryptedMessage;
};
