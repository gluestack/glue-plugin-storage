const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "./.env") });

let host = `${process.env.MINIO_ADMIN_END_POINT}`;
if (process.env.MINIO_PORT !== "443") {
  host = `${host}:${process.env.MINIO_PORT}`
}

module.exports = () => [
  {
    "path": "/backend/services/upload",
    "size_in_mb": process.env.MAX_UPLOAD_SIZE || 100,
    "proxy": {
      "instance": "services:9000",
      "path": "/upload",
    },
  },
  {
    "path": "/backend/services/file/(.*)",
    "host_scheme": process.env.MINIO_PORT === "443" ? "https" : "http",
    "host": host,
    "proxy": {
      "instance": host,
      "path": "/$1",
    },
  },
];
