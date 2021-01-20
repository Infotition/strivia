/**
 * Defines the structure of the submission output.
 *
 * @export
 * @interface Output
 */
export default interface Output {
  output: string;
  stderr: string;
  status: string;
  submissionID: number;
}
