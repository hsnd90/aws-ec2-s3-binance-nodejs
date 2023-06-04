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
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
    });
  }

  return client;
}

module.exports = getClient;
