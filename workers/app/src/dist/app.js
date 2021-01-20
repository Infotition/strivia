"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("./utils/validator"));
const languages_1 = require("./utils/languages");
const { v4 } = require('uuid');
const fs = require('fs');
const { exec } = require('child_process');
const rimraf = require('rimraf');
function createDirectory(data, lang, callback) {
    const folder = `./temp/${data.uuid}`;
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
function runCode(data) {
    const errors = validator_1.default(data);
    if (errors.length > 0)
        console.log(errors);
    else {
        const language = languages_1.languageNameFromAlias(data.lang);
        if (language) {
            createDirectory(data, language, () => {
                const args = `./temp/${data.uuid}/source.${language.extension} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd} ${language.runFile} ${language.outputFile}`;
                const command = `python execute.py ${args}`;
                exec(command, (execErr, stdout, stderr) => {
                    if (execErr)
                        console.log(execErr);
                    fs.readFile(`./temp/${data.uuid}/output.txt`, 'utf8', (readErr, content) => {
                        if (readErr)
                            console.log(readErr);
                        const result = {
                            output: content,
                            stderr,
                            status: stdout,
                            submission_id: data.uuid
                        };
                        console.log(result);
                    });
                    rimraf(`./temp/${data.uuid}`, (delErr) => {
                        if (delErr)
                            console.log(delErr);
                    });
                });
            });
        }
    }
}
runCode({
    lang: 'py3',
    code: `name = input()\nprint("Hello %s!" % name)\n`,
    stdin: 'Strivia',
    args: [],
    uuid: v4()
});
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
    args: [],
    uuid: v4()
});
exports.default = runCode;
