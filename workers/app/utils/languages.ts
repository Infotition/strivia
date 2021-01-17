import Language from '../models/Language';

const languages: Language[] = [
  {
    name: 'python3',
    aliases: ['py', 'py3', 'python', 'python3'],
    timeout: 3,
    compiled: false,
    compileCmd: '',
    runCmd: 'python3'
  },
  {
    name: 'java',
    aliases: ['java'],
    timeout: 5,
    compiled: true,
    compileCmd: 'javac',
    runCmd: 'java'
  }
];

/**
 * Returns the name of the language found with the given alias.
 *
 * @param {string} alias
 * @return {*}  {(Language | undefined)}
 */
function languageNameFromAlias(alias: string): Language | undefined {
  return languages.find((lang) => lang.aliases.includes(alias.toLowerCase()));
}

export { languages, languageNameFromAlias };
