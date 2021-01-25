"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageNameFromAlias = exports.languages = void 0;
const languages = [
    {
        name: 'python3',
        aliases: ['py', 'py3', 'python', 'python3'],
        extension: 'py',
        timeout: 3,
        compiled: false,
        compileCmd: '-',
        runFile: 'source.py',
        runCmd: 'python3',
        outputFile: 'source.py'
    },
    {
        name: 'java',
        aliases: ['java'],
        extension: 'java',
        timeout: 5,
        compiled: true,
        compileCmd: 'javac',
        runFile: 'Main',
        runCmd: 'java',
        outputFile: 'Main.class'
    }
];
exports.languages = languages;
function languageNameFromAlias(alias) {
    return languages.find((lang) => lang.aliases.includes(alias.toLowerCase()));
}
exports.languageNameFromAlias = languageNameFromAlias;
