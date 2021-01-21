const redis = require('redis');
const amqp = require('amqp-connection-manager');

const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

client.on('error', (err) => {
  console.log(`Error ${err}`);
});

const QUEUE_NAME = 'strivia';

// Create a connetion manager
const connection = amqp.connect(['amqp://localhost:5672']);
connection.on('connect', () => {
  console.log('Connected!');
});
connection.on('disconnect', (err) => {
  console.log('Disconnected.', err.stack);
});

// Create a channel wrapper
const channelWrapper = connection.createChannel({
  json: true,
  setup(channel) {
    // `channel` here is a regular amqplib `ConfirmChannel`.
    return channel.assertQueue(QUEUE_NAME, { durable: true });
  }
});

channelWrapper
  .sendToQueue(QUEUE_NAME, {
    lang: 'java',
    code: `
      import java.util.Scanner;
      class Main {
        public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          System.out.println("Hello " + scanner.next() + "!");
        }
      }`,
    stdin: 'Strivia',
    args: []
  })
  .then(() => console.log('Message sent'))
  .catch((err) => {
    console.log('Message was rejected:', err.stack);
    channelWrapper.close();
    connection.close();
  });
