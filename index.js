require('dotenv').config();
const Binance = require('node-binance-api');
const binance = new Binance();
const fs = require('fs');
const getClient = require('./get-s3-client');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

let production = process.env.NODE_ENV === 'prod';

let client = getClient();
let currentFileName;
let localPath = production ? 'data/' : 'data/';
let remotePath = production ? 'binance/' : 'binance/';

(async () => {
  binance.futuresAggTradeStream('BTCUSDT', setFuturePrice);
})();

async function setFuturePrice(data) {
  let a = {
    timestamp: setTimestamp(data),
    symbol: setSymbol(data),
    price: setPrice(data),
    quantity: setAmount(data),
    eventDateTime: setEventDateTime(data),
    maker: setMaker(data),
  };

  let result = Object.values(a)
    .map((a) => a.toString().trim())
    .join('        ');

  writeToFile(result, {
    path: localPath,
    fileName: setFileName(data),
  });

  if (currentFileName && currentFileName !== setFileName(data)) {
    await putObject(
      currentFileName + '.tsv',
      localPath + currentFileName + '.tsv',
      remotePath
    );
  }

  currentFileName = setFileName(data);
}

function setSymbol(data) {
  return data.symbol;
}

function setPrice(data) {
  return Number(data.price).toFixed(2);
}

function setTimestamp(data) {
  return data.timestamp;
}

function setEventDateTime(data) {
  return new Date(data.eventTime).toLocaleString('tr-Tr', {
    formatMatcher: 'basic',
  });
}

function setAmount(data) {
  return Number(data.amount).toFixed(2);
}

function setMaker(data) {
  return data.maker ? '1' : '0';
}

function setFileName(data) {
  return Math.floor(data.timestamp / (1000 * 60));
}

async function putObject(fileName, sourceFilePath, remotePath) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: remotePath + fileName,
    Body: fs.readFileSync(sourceFilePath, 'utf-8'),
  });

  await client.send(command);
}

function writeToFile(data, options) {
  if (options.path && !fs.existsSync('./' + options.path)) {
    fs.mkdirSync(options.path);
  } else if (!options.path) {
    options.path = '.';
  }

  fs.appendFile(
    options.path + '/' + options.fileName + '.tsv',
    data + '\r\n',
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}
