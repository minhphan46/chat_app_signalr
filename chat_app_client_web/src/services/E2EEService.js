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
