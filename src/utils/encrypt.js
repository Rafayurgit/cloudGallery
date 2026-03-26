const crypto = require("crypto");
const env = require("../config/env");

const getKey = () => {
  if (!env.encryptionKey || env.encryptionKey.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be a 32-byte string");
  }
  return Buffer.from(env.encryptionKey, "utf8");
};

const encryptText = (plainText) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decryptText = (encryptedValue) => {
  const [ivHex, dataHex] = encryptedValue.split(":");
  if (!ivHex || !dataHex) throw new Error("Invalid encrypted payload");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    getKey(),
    Buffer.from(ivHex, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
};

module.exports = { encryptText, decryptText };
