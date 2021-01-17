import RunnableCode from './models/RunnableCode';
import checkInput from './utils/validator';
import { languageNameFromAlias } from './utils/languages';

const { exec } = require('child_process');

/**
 * Runs the given Code, if the syntax is complete and the language is supported by Strivia.
 *
 * @param {RunnableCode} data
 */
function runCode(data: RunnableCode): void {
  const { lang, code, stdin, args } = data;
  checkInput(data);

  const language = languageNameFromAlias(lang);
  const output = '';
  const command = '';
}

runCode({ lang: 'py3', code: '', stdin: '', args: [] });

export default runCode;
