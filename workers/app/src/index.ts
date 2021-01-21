//* ------------------- DEPENDENCIES ------------------ *\\

//* Function imports
import runCode from './runner/runner';

//* Modules imports
const amqp = require('amqp-connection-manager');
const redis = require('redis');
const { v4 } = require('uuid');

//* ------------------ CONFIGURATION ------------------ *\\

//* Constants
const QUEUE_NAME = 'strivia';
const redisConnection = { host: 'localhost', port: 6379 };
const amqpConnection = { host: 'localhost', port: 5672 };
const pendingMsg = '{"status": "Processing"}';

//* ---------------- SUBMISSION HANDLER --------------- *\\

//* Only start server, if not in testing environment
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'circle') {
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

  //* Create channgel wrapper
  const channelWrapper = connection.createChannel({
    setup(channel: any) {
      return Promise.all([
        channel.assertQueue(QUEUE_NAME, { durable: true }),
        channel.prefetch(1),
        channel.consume(QUEUE_NAME, (data: any) => {
          //* Create unique id and set a pending message in database
          data.uuid = v4();
          dbClient.setex(data.uuid?.toString(), 600, pendingMsg);

          //* Run the code, save it in database and send ack to amqp server
          runCode(JSON.parse(data.content.toString()), (result: string) => {
            console.log(result);
            dbClient.setex(data.uuid?.toString(), 600, JSON.stringify(result));
            channelWrapper.ack(data);
          });
        })
      ]);
    }
  });

  //* Let the channel wrapper listen for messages
  channelWrapper
    .waitForConnect()
    .then(() => console.log('listening for messages'));
}
