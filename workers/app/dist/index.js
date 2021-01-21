"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = __importDefault(require("./runner/runner"));
const amqp = require('amqp-connection-manager');
const redis = require('redis');
const { v4 } = require('uuid');
const QUEUE_NAME = 'strivia';
const redisConnection = { host: 'localhost', port: 6379 };
const amqpConnection = { host: 'localhost', port: 5672 };
const pendingMsg = '{"status": "Processing"}';
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'circle') {
    const dbClient = redis.createClient(redisConnection);
    dbClient.on('error', (err) => console.log(`disconnected from amqp: ${err}`));
    dbClient.on('ready', () => console.log('connected to redis'));
    const connection = amqp.connect([
        `amqp://${amqpConnection.host}:${amqpConnection.port}`
    ]);
    connection.on('connect', () => console.log('connected to amqp'));
    connection.on('disconnect', (err) => console.log('disconnected from amqp', err));
    const channelWrapper = connection.createChannel({
        setup(channel) {
            return Promise.all([
                channel.assertQueue(QUEUE_NAME, { durable: true }),
                channel.prefetch(1),
                channel.consume(QUEUE_NAME, (data) => {
                    var _a;
                    data.uuid = v4();
                    dbClient.setex((_a = data.uuid) === null || _a === void 0 ? void 0 : _a.toString(), 600, pendingMsg);
                    runner_1.default(JSON.parse(data.content.toString()), (result) => {
                        var _a;
                        console.log(result);
                        dbClient.setex((_a = data.uuid) === null || _a === void 0 ? void 0 : _a.toString(), 600, JSON.stringify(result));
                        channelWrapper.ack(data);
                    });
                })
            ]);
        }
    });
    channelWrapper
        .waitForConnect()
        .then(() => console.log('listening for messages'));
}
