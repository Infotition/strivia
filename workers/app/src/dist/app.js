

const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("./utils/validator"));
const { v4 } = require('uuid');
const fs = require('fs');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const languages_1 = require("./utils/languages");

function createDirectory(data, lang, callback) {
    const folder = `./temp/${data.uuid}`;
    fs.mkdir(folder, (folderError) => {
        if (folderError)
            throw folderError;
        fs.writeFile(`${folder}/input.txt`, data.stdin, (inputError) => {
            if (inputError)
                throw inputError;
            fs.writeFile(`${folder}/output.txt`, '', (outputError) => {
                if (outputError)
                    throw outputError;
                fs.writeFile(`${folder}/source.${lang.extension}`, data.code, (codeError) => {
                    if (codeError)
                        throw codeError;
                    callback();
                });
            });
        });
    });
}
function runCode(data) {
    validator_1.default(data);
    const language = languages_1.languageNameFromAlias(data.lang);
    if (!language)
        throw new Error('Supply a language field.');
    createDirectory(data, language, () => {
        const args = `./temp/${data.uuid}/source.${language.extension} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd} ${language.runFile} ${language.outputFile}`;
        const command = `python execute.py ${args}`;
        exec(command, (err, stdout, stderr) => {
            if (err)
                throw err;
            fs.readFile(`./temp/${data.uuid}/output.txt`, 'utf8', (readError, content) => {
                if (readError)
                    throw readError;
                const result = {
                    output: content,
                    stderr,
                    status: stdout,
                    submission_id: data.uuid
                };
                console.log(result);
            });
            rimraf(`./temp/${data.uuid}`, (deleteErr) => {
                if (deleteErr)
                    throw deleteErr;
            });
        });
    });
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
