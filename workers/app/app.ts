import Language from 'models/Language';
import RunnableCode from './models/RunnableCode';
import checkInput from './utils/validator';
import { languageNameFromAlias } from './utils/languages';

const { v4 } = require('uuid');
const fs = require('fs');
const { exec } = require('child_process');
const rimraf = require('rimraf');

/**
 * Creates a temporary directory for the request with input and code file to run.
 *
 * @param {RunnableCode} data
 * @param {(Language)} lang
 * @param {Function} callback
 */
function createFile(
  data: RunnableCode,
  lang: Language,
  callback: Function
): void {
  const folder = `./temp/${data.uuid}`;

  // Create folder for request
  fs.mkdir(folder, (folderError: Error) => {
    if (folderError) throw folderError;
    // Create file for input
    fs.writeFile(`${folder}/input.txt`, data.stdin, (inputError: Error) => {
      if (inputError) throw inputError;
      // Create file for the code output
      fs.writeFile(`${folder}/output.txt`, '', (outputError: Error) => {
        if (outputError) throw outputError;
        // Create file for code with corresponding extension
        fs.writeFile(
          `${folder}/source.${lang.extension}`,
          data.code,
          (codeError: Error) => {
            if (codeError) throw codeError;
            callback(`${folder}/source.${lang.extension}`);
          }
        );
      });
    });
  });
}

/**
 * Runs the given Code, if the syntax is complete and the language is supported by Strivia.
 *
 * @param {RunnableCode} data
 */
function runCode(data: RunnableCode): void {
  checkInput(data);
  const language = languageNameFromAlias(data.lang);
  if (!language) throw new Error('Supply a language field.');

  createFile(data, language, (source: string) => {
    const args = `${source} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd}`;
    const command = `python run.py ${args}`;

    exec(command, (err: Error, stout: string, sterr: string) => {
      if (err) throw err;
      console.log(stout);
      console.log(sterr);

      rimraf(`./temp/${data.uuid}`, (deleteErr: Error) => {
        if (deleteErr) throw deleteErr;
        else console.log('DELETED TEMP FOLDER');
      });
    });
  });
}

runCode({
  lang: 'py3',
  code: 'print("Hello World")',
  stdin: 'test',
  args: [],
  uuid: v4()
});

export default runCode;
