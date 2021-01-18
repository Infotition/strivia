/**
 * Defines the structure of an supported Language.
 *
 * @export
 * @interface Language
 */
export default interface Language {
  name: string;
  aliases: Array<string>;
  extension: string;
  timeout: number;
  compiled: boolean;
  compileCmd: string;
  runFile: string;
  outputFile: string;
  runCmd: string;
  version?: string;
}
