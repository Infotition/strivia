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
const validator_1 = __importDefault(require("../utils/validator"));
const languages_1 = require("../utils/languages");
const { exec } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
let tempPath = '../temp/';
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'circle')
    tempPath = './temp/';
function createDirectory(data, lang, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const folder = `${tempPath}${data.uuid}`;
        fs.mkdir(folder, (folderErr) => {
            if (folderErr)
                console.log(folderErr);
            fs.writeFile(`${folder}/input.txt`, data.stdin, (inputErr) => {
                if (inputErr)
                    console.log(inputErr);
                fs.writeFile(`${folder}/output.txt`, '', (outputErr) => {
                    if (outputErr)
                        console.log(outputErr);
                    fs.writeFile(`${folder}/source.${lang.extension}`, data.code, (codeErr) => {
                        if (codeErr)
                            console.log(codeErr);
                        callback();
                    });
                });
            });
        });
    });
}
function runCode(data, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = validator_1.default(data);
        if (errors.length > 0)
            console.log(errors);
        else {
            const language = languages_1.languageNameFromAlias(data.lang);
            if (language) {
                createDirectory(data, language, () => {
                    const args = `./temp/${data.uuid}/source.${language.extension} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd} ${language.runFile} ${language.outputFile}`;
                    let command = `cd ..&&python3 execute.py ${args}`;
                    if (process.env.NODE_ENV === 'test')
                        command = `python3 execute.py ${args}`;
                    exec(command, (execErr, stdout, stderr) => {
                        if (execErr)
                            console.log(execErr);
                        fs.readFile(`${tempPath}${data.uuid}/output.txt`, 'utf8', (readErr, content) => {
                            if (readErr)
                                console.log(readErr);
                            const result = {
                                output: content,
                                stderr,
                                status: stdout,
                                submissionID: data.uuid ? data.uuid : 0
                            };
                            callback(result);
                        });
                        rimraf(`${tempPath}${data.uuid}`, (delErr) => {
                            if (delErr)
                                console.log(delErr);
                        });
                    });
                });
            }
        }
    });
}
exports.default = runCode;
