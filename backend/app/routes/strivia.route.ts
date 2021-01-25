//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
const express = require('express');
const redis = require('redis');
const amqp = require('amqp-connection-manager');

const router = express.Router();
const { v4 } = require('uuid');

//* ------------------ CONFIGURATION ------------------ *\\

//* Constants
const QUEUE_NAME = 'strivia';
const redisConnection = { host: 'redis-server', port: 6379 };
const amqpConnection = { host: 'rabbitmq', port: 5672 };

//* Create connection to redis cache
const dbClient = redis.createClient(redisConnection);

//* Redis Events
dbClient.on('error', (err: Error) =>
  console.log(`disconnected from amqp: ${err}`)
);
dbClient.on('ready', () => console.log('connected to redis'));

//* Create connection to message queue server
const connection = amqp.connect([
  `amqp://${amqpConnection.host}:${amqpConnection.port}`
]);

//* AMQP Events
connection.on('connect', () => console.log('connected to amqp'));
connection.on('disconnect', (err: Error) =>
  console.log('disconnected from amqp', err)
);

const channelWrapper = connection.createChannel({
  json: true,
  setup(channel: any) {
    return channel.assertQueue(QUEUE_NAME, { durable: true });
  }
});

//* ---------------- HELPER FUNCTIONS ----------------- *\\

async function setResponse(
  res: any,
  uuid: any,
  tries: number,
  timeout: number
) {
  if (tries >= 6) {
    res.send('timeout');
  } else {
    setTimeout(() => {
      //* Try to get the response from the cache database
      dbClient.get(uuid, (err: Error, status: string) => {
        if (err) res.status(400).send(err);
        //* If status is still processing, try again after view seconds
        else if (!status || status === '{"status": "Processing"}') {
          setResponse(res, uuid, tries + 1, timeout * 2);
        } else {
          res.status(200).send(status);
        }
      });
    }, timeout);
  }
}

//* --------------------- ROUTES ---------------------- *\\
router.post('/submit', async (req: any, res: any) => {
  const uuid = v4();
  channelWrapper
    .sendToQueue(QUEUE_NAME, {
      lang: req.body.lang,
      code: req.body.code,
      stdin: req.body.stdin,
      args: [],
      uuid
    })
    .then(() => {
      setResponse(res, uuid, 0, 50);
    })
    .catch((err: Error) => {
      console.log('Message was rejected:', err.stack);
      channelWrapper.close();
      connection.close();
    });
});

module.exports = router;
