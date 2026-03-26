const File = require("./file.model");
const providerService = require("../provider/provider.service");

const uploadFile = async ({ userId, tenantId, file, provider = "google" }) => {
  if (!file) {
    const err = new Error("File is required");
    err.statusCode = 400;
    throw err;
  }

  const adapter = providerService.getProviderAdapter(provider);
  const connection = await providerService.getDecryptedConnection(userId, provider, tenantId);
  const providerFile = await adapter.uploadFileToGoogle(connection, file);

  return File.create({
    userId,
    tenantId,
    fileName: providerFile.name || file.originalname,
    provider,
    providerFileId: providerFile.id,
    size: Number(providerFile.size || file.size || 0),
    mimeType: providerFile.mimeType || file.mimetype
  });
};

const getUserFiles = async (userId, tenantId) => {
  return File.find({ userId, tenantId }).sort({ createdAt: -1 });
};

const deleteFile = async ({ userId, tenantId, fileId }) => {
  const file = await File.findOne({ _id: fileId, userId, tenantId });
  if (!file) {
    const err = new Error("File not found");
    err.statusCode = 404;
    throw err;
  }

  const adapter = providerService.getProviderAdapter(file.provider);
  const connection = await providerService.getDecryptedConnection(userId, file.provider, tenantId);

  if (typeof adapter.deleteRemoteFile === "function") {
    await adapter.deleteRemoteFile(connection, file.providerFileId);
  }

  await File.deleteOne({ _id: file._id });
  return file;
};

module.exports = { uploadFile, getUserFiles, deleteFile };
