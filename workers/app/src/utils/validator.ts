import RunnableCode from '../models/RunnableCode';
import { languageNameFromAlias } from './languages';

/**
 * Checks if the give data is valid to compile.
 *
 * @param {RunnableCode} data
 */
function checkInput(data: RunnableCode): void {
  const { lang, code, stdin, args } = data;

  // Check language attribute
  if (!lang) throw new Error('Supply a language field');
  if (typeof lang !== 'string')
    throw new Error('Supplied language is not a string');
  if (!languageNameFromAlias(lang))
    throw new Error('Supplied language is not supported by Strivia');

  // Check code attribute
  if (!code) throw new Error('Supply a code field');
  if (typeof code !== 'string')
    throw new Error('Supplied code is not a string');

  // Check stdin attribute
  if (typeof stdin !== 'string' && stdin)
    throw new Array('Supplied stdin is not a string');

  // Check args attribute
  if (typeof args !== 'object' && args)
    throw new Error('Supplied args is not an array');
}

export default checkInput;
