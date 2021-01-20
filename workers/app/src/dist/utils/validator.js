"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const languages_1 = require("./languages");
function checkInput(data) {
    const errors = [];
    const { lang, code, stdin, args } = data;
    if (!lang)
        errors.push('Supply a language field');
    if (typeof lang !== 'string')
        errors.push('Supplied language is not a string');
    if (!languages_1.languageNameFromAlias(lang))
        errors.push('Supplied language is not supported by Strivia');
    if (!code)
        errors.push('Supply a code field');
    if (typeof code !== 'string')
        errors.push('Supplied code is not a string');
    if (typeof stdin !== 'string' && stdin)
        errors.push('Supplied stdin is not a string');
    if (typeof args !== 'object' && args)
        errors.push('Supplied args is not an array');
    return errors;
}
exports.default = checkInput;
