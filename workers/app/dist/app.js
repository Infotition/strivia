"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("./utils/validator"));
const languages_1 = require("./utils/languages");
const { v4 } = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
let tempPath = '../temp/';
if (process.env.NODE_ENV === 'test')
    tempPath = './temp';
function createDirectory(data, lang, callback) {
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
}
function runCode(data, callback) {
    const errors = validator_1.default(data);
    if (errors.length > 0)
        console.log(errors);
    else {
        data.uuid = v4();
        const language = languages_1.languageNameFromAlias(data.lang);
        if (language) {
            createDirectory(data, language, () => {
                const args = `./temp/${data.uuid}/source.${language.extension} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd} ${language.runFile} ${language.outputFile}`;
                let command = `cd ..&&python execute.py ${args}`;
                if (process.env.NODE_ENV === 'test')
                    command = `python execute.py ${args}`;
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
                        console.log(result);
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
}
runCode({
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
}, (data) => {
    console.log(data);
});
exports.default = runCode;
