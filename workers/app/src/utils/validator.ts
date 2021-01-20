import RunnableCode from '../models/RunnableCode';
import { languageNameFromAlias } from './languages';

/**
 * Checks if the give data is valid to compile.
 *
 * @param {RunnableCode} data
 * @return {*}  {Array<String>}
 */
function checkInput(data: RunnableCode): Array<String> {
  const errors: Array<String> = [];
  const { lang, code, stdin, args } = data;

  // Check language attribute
  if (!lang) errors.push('Supply a language field');
  if (typeof lang !== 'string')
    errors.push('Supplied language is not a string');
  if (!languageNameFromAlias(lang))
    errors.push('Supplied language is not supported by Strivia');

  // Check code attribute
  if (!code) errors.push('Supply a code field');
  if (typeof code !== 'string') errors.push('Supplied code is not a string');

  // Check stdin attribute (optional)
  if (typeof stdin !== 'string' && stdin)
    errors.push('Supplied stdin is not a string');

  // Check args attribute (optional)
  if (typeof args !== 'object' && args)
    errors.push('Supplied args is not an array');

  return errors;
}

export default checkInput;
