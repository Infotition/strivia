import Language from './models/Language';
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
function createDirectory(
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
function runCode(data: RunnableCode): void {
  checkInput(data);
  const language = languageNameFromAlias(data.lang);
  if (!language) throw new Error('Supply a language field.');

  // Create a directory for the submission where the code can be compiled and runned
  createDirectory(data, language, () => {
    // Prepare the command for the python executer program (with console args)
    const args = `./temp/${data.uuid}/source.${language.extension} ${language.name} ${language.timeout} ${language.compiled} ${language.compileCmd} ${language.runCmd} ${language.runFile} ${language.outputFile}`;
    const command = `python execute.py ${args}`;

    // Execute the python script, which compiles/runs the code
    exec(command, (err: Error, stdout: string, stderr: string) => {
      if (err) throw err;

      // Read the output, the program generated and save it
      fs.readFile(
        `./temp/${data.uuid}/output.txt`,
        'utf8',
        (readError: Error, content: string) => {
          if (readError) throw readError;
          const result = {
            output: content,
            stderr,
            status: stdout,
            submission_id: data.uuid
          };
          console.log(result);
        }
      );

      // Save delete the temp directory for the submission
      rimraf(`./temp/${data.uuid}`, (deleteErr: Error) => {
        if (deleteErr) throw deleteErr;
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

export default runCode;
