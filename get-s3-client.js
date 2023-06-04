const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

let production = process.env.NODE_ENV === 'prod';

function getClient() {
  if (production) {
    client = new S3Client({
      region: process.env.REGION,
    });
  } else {
    client = new S3Client({
      region: process.env.REGION,
      credentials: {
        secretAccessKey: process.env.ACCESS_SECRET,
        accessKeyId: process.env.ACCESS_KEY,
      },
    });
  }

  return client;
}

module.exports = getClient;
