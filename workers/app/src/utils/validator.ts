//* ------------------- DEPENDENCIES ------------------ *\\

//* Function imports
import RunnableCode from '../models/RunnableCode';
import { languageNameFromAlias } from './languages';

//* ---------------- VALIDATION UTILITIES --------------- *\\

/**
 * Checks if the give data is valid to compile.
 *
 * @param {RunnableCode} data
 * @return {*}  {Array<String>}
 */
function checkInput(data: RunnableCode): Array<String> {
  const errors: Array<String> = [];
  const { lang, code, stdin, args } = data;

  //* Most of the checks are not needed because of typescript

  //* Check language attribute
  /* istanbul ignore next */
  if (!lang) errors.push('Supply a language field');
  /* istanbul ignore next */
  if (typeof lang !== 'string')
    errors.push('Supplied language is not a string');
  if (!languageNameFromAlias(data.lang))
    errors.push('Supplied language is not supported by Strivia');

  //* Check code attribute
  /* istanbul ignore next */
  if (!data.code) errors.push('Supply a code field');
  /* istanbul ignore next */
  if (typeof code !== 'string') errors.push('Supplied code is not a string');

  //* Check stdin attribute (optional)
  /* istanbul ignore next */
  if (typeof stdin !== 'string' && stdin)
    errors.push('Supplied stdin is not a string');

  //* Check args attribute (optional)
  /* istanbul ignore next */
  if (typeof args !== 'object' && args)
    errors.push('Supplied args is not an array');

  return errors;
}

export default checkInput;
