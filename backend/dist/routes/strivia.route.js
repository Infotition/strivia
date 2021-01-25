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
const express = require('express');
const redis = require('redis');
const amqp = require('amqp-connection-manager');
const router = express.Router();
const { v4 } = require('uuid');
const QUEUE_NAME = 'strivia';
const redisConnection = { host: 'redis-server', port: 6379 };
const amqpConnection = { host: 'rabbitmq', port: 5672 };
const dbClient = redis.createClient(redisConnection);
dbClient.on('error', (err) => console.log(`disconnected from amqp: ${err}`));
dbClient.on('ready', () => console.log('connected to redis'));
const connection = amqp.connect([
    `amqp://${amqpConnection.host}:${amqpConnection.port}`
]);
connection.on('connect', () => console.log('connected to amqp'));
connection.on('disconnect', (err) => console.log('disconnected from amqp', err));
const channelWrapper = connection.createChannel({
    json: true,
    setup(channel) {
        return channel.assertQueue(QUEUE_NAME, { durable: true });
    }
});
function setResponse(res, uuid, tries, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tries >= 6) {
            res.send('timeout');
        }
        else {
            setTimeout(() => {
                dbClient.get(uuid, (err, status) => {
                    if (err)
                        res.status(400).send(err);
                    else if (!status || status === '{"status": "Processing"}') {
                        setResponse(res, uuid, tries + 1, timeout * 2);
                    }
                    else {
                        res.status(200).send(status);
                    }
                });
            }, timeout);
        }
    });
}
router.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        .catch((err) => {
        console.log('Message was rejected:', err.stack);
        channelWrapper.close();
        connection.close();
    });
}));
module.exports = router;
