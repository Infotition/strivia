/**
 * Defines the structure of an Object, which can be compiled by Strivia.
 *
 * @export
 * @interface RunnableCode
 */
export default interface RunnableCode {
  lang: string;
  code: string;
  stdin: string;
  args: Array<string>;
}
