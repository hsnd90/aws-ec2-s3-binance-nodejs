const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

let production = process.env.NODE_ENV === 'prod';

function getClient() {
  if (production) {
    client = new S3Client({
      region: process.env.REGION ?? 'eu-north-1',
    });
  } else {
    client = new S3Client({
      region: process.env.REGION ?? 'eu-north-1',
      credentials: {
        secretAccessKey: process.env.ACCESS_SECRET,
        accessKeyId: process.env.ACCESS_KEY,
      },
    });
  }

  return client;
}

module.exports = getClient;
