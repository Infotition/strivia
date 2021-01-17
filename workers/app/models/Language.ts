/**
 * Defines the structure of an supported Language.
 *
 * @export
 * @interface Language
 */
export default interface Language {
  name: string;
  aliases: Array<string>;
  timeout: number;
  compiled: boolean;
  compileCmd: string;
  runCmd: string;
  version?: string;
}
