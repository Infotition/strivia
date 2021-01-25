"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = __importDefault(require("./runner/runner"));
const amqp = require('amqp-connection-manager');
const redis = require('redis');
const QUEUE_NAME = 'strivia';
const redisConnection = { host: 'redis-server', port: 6379 };
const amqpConnection = { host: 'rabbitmq', port: 5672 };
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
                channel.consume(QUEUE_NAME, (data) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const code = JSON.parse(data.content.toString());
                    dbClient.setex((_a = code.uuid) === null || _a === void 0 ? void 0 : _a.toString(), 600, pendingMsg);
                    runner_1.default(code, (result) => {
                        var _a;
                        console.log(result);
                        dbClient.setex((_a = code.uuid) === null || _a === void 0 ? void 0 : _a.toString(), 600, JSON.stringify(result));
                        channelWrapper.ack(data);
                    });
                }))
            ]);
        }
    });
    channelWrapper
        .waitForConnect()
        .then(() => console.log('listening for messages'));
}
