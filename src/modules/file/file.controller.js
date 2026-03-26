const { sendSuccess } = require("../../utils/apiResponse");
const fileService = require("./file.service");

const upload = async (req, res, next) => {
  try {
    const savedFile = await fileService.uploadFile({
      userId: req.user._id,
      tenantId: req.tenantId,
      file: req.file,
      provider: req.body.provider || "google"
    });
    return sendSuccess(res, savedFile, "File uploaded", 201);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const files = await fileService.getUserFiles(req.user._id, req.tenantId);
    return sendSuccess(res, files, "Files fetched");
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await fileService.deleteFile({
      userId: req.user._id,
      tenantId: req.tenantId,
      fileId: req.params.id
    });
    return sendSuccess(res, {}, "File deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, list, remove };
