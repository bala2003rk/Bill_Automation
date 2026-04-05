const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const receiptStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "billtrack/receipts",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    resource_type:   "auto",
  },
});

const qrStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "billtrack/qr-codes",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const memoryStorage = multer.memoryStorage();

const uploadReceipt = multer({
  storage: isCloudinaryConfigured() ? receiptStorage : memoryStorage,
  limits:  { fileSize: 10 * 1024 * 1024 },
});

const uploadQr = multer({
  storage: isCloudinaryConfigured() ? qrStorage : memoryStorage,
  limits:  { fileSize: 5 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadReceipt, uploadQr };