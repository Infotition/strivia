// Function imports
import checkInput from './utils/validator';
import { languageNameFromAlias } from './utils/languages';

// Models imports
import Language from './models/Language';
import RunnableCode from './models/RunnableCode';
import Output from './models/Output';

// Modules imports
const { v4 } = require('uuid');
const { exec } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');

let tempPath = '../temp/';
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') tempPath = './temp/';

/**
 * Creates a temporary directory for the request with input and code file to run.
 *
 * @param {RunnableCode} data
 * @param {(Language)} lang
 * @param {Function} callback
 */
function createDirectory(
  data: RunnableCode,
  lang: Language,
  callback: Function
): void {
  const folder: string = `${tempPath}${data.uuid}`;

  //* Create folder for request
  fs.mkdir(folder, (folderErr: Error) => {
    /* istanbul ignore next */
    if (folderErr) console.log(folderErr);
    //* Create file for input
    fs.writeFile(`${folder}/input.txt`, data.stdin, (inputErr: Error) => {
      /* istanbul ignore next */
      if (inputErr) console.log(inputErr);
      //* Create file for the code output
      fs.writeFile(`${folder}/output.txt`, '', (outputErr: Error) => {
        /* istanbul ignore next */
        if (outputErr) console.log(outputErr);
        //* Create file for code with corresponding extension
        fs.writeFile(
          `${folder}/source.${lang.extension}`,
          data.code,
          (codeErr: Error) => {
            /* istanbul ignore next */
            if (codeErr) console.log(codeErr);
            callback();
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
function runCode(data: RunnableCode, callback: Function): void {
  const errors: Array<String> = checkInput(data);
  /* istanbul ignore next */
  if (errors.length > 0) console.log(errors);
  else {
    //* Assign uuid to the submission
    data.uuid = v4();

    const language: Language | undefined = languageNameFromAlias(data.lang);
    if (language) {
      //* Create a directory for the submission where the code can be compiled and runned
      createDirectory(data, language, () => {
        //* Prepare the command for the python executer program (with console args)
        const args: string = `./temp/${data.uuid}/source.${language.extension} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd} ${language.runFile} ${language.outputFile}`;
        let command: string = `cd ..&&python execute.py ${args}`;

        /* istanbul ignore next */
        if (process.env.NODE_ENV === 'test')
          command = `python execute.py ${args}`;

        //* Execute the python script, which compiles/runs the code
        exec(command, (execErr: Error, stdout: string, stderr: string) => {
          /* istanbul ignore next */
          if (execErr) console.log(execErr);

          //* Read the output, the program generated and save it
          fs.readFile(
            `${tempPath}${data.uuid}/output.txt`,
            'utf8',
            (readErr: Error, content: string) => {
              /* istanbul ignore next */
              if (readErr) console.log(readErr);
              const result: Output = {
                output: content,
                stderr,
                status: stdout,
                submissionID: data.uuid ? data.uuid : 0
              };
              callback(result);
            }
          );

          //* Save delete the temp directory for the submission
          rimraf(`${tempPath}${data.uuid}`, (delErr: Error) => {
            /* istanbul ignore next */
            if (delErr) console.log(delErr);
          });
        });
      });
    }
  }
}

export default runCode;
