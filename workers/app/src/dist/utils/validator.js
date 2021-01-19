"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const languages_1 = require("./languages");
function checkInput(data) {
    const { lang, code, stdin, args } = data;
    if (!lang)
        throw new Error('Supply a language field');
    if (typeof lang !== 'string')
        throw new Error('Supplied language is not a string');
    if (!languages_1.languageNameFromAlias(lang))
        throw new Error('Supplied language is not supported by Strivia');
    if (!code)
        throw new Error('Supply a code field');
    if (typeof code !== 'string')
        throw new Error('Supplied code is not a string');
    if (typeof stdin !== 'string' && stdin)
        throw new Array('Supplied stdin is not a string');
    if (typeof args !== 'object' && args)
        throw new Error('Supplied args is not an array');
}
exports.default = checkInput;
