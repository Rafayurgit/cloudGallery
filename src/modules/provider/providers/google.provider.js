const { google } = require("googleapis");
const { Readable } = require("stream");
const env = require("../../../config/env");

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    env.googleClientId,
    env.googleClientSecret,
    env.googleRedirectUri
  );
};

const getAuthUrl = (state) => {
  const oauthClient = getOAuthClient();
  return oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly"],
    prompt: "consent",
    state
  });
};

const exchangeCodeForTokens = async (code) => {
  const oauthClient = getOAuthClient();
  const { tokens } = await oauthClient.getToken(code);
  return tokens;
};

const createDriveClient = ({ accessToken, refreshToken, expiryDate }) => {
  const oauthClient = getOAuthClient();
  oauthClient.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate ? new Date(expiryDate).getTime() : undefined
  });
  return google.drive({ version: "v3", auth: oauthClient });
};

const uploadFileToGoogle = async (connection, file) => {
  const drive = createDriveClient(connection);
  const response = await drive.files.create({
    requestBody: { name: file.originalname },
    media: {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer)
    },
    fields: "id,name,mimeType,size,createdTime"
  });
  return response.data;
};

const listGoogleFiles = async (connection) => {
  const drive = createDriveClient(connection);
  const response = await drive.files.list({
    fields: "files(id,name,mimeType,size,createdTime)",
    pageSize: 100
  });
  return response.data.files || [];
};

const deleteRemoteFile = async (connection, providerFileId) => {
  const drive = createDriveClient(connection);
  try {
    await drive.files.delete({ fileId: providerFileId });
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) return;
    const wrapped = new Error(err.message || "Google Drive delete failed");
    wrapped.statusCode = status && status >= 400 && status < 600 ? status : 502;
    wrapped.cause = err;
    throw wrapped;
  }
};

module.exports = {
  getAuthUrl,
  exchangeCodeForTokens,
  uploadFileToGoogle,
  listGoogleFiles,
  deleteRemoteFile
};
