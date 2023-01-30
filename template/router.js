module.exports = () => [
  {
    "path": "/backend/services/upload/(.*)",
    "size_in_mb": 100,
    "proxy": {
      "instance": "services:3500",
      "path": "/v1.0/invoke/services/method/upload/$1",
    },
  },
  {
    "path": "/backend/services/file",
    "host": "minio_host:minio_port",
    "proxy": {
      "instance": "minio_host:minio_port",
      "path": "/",
    },
  },
];
