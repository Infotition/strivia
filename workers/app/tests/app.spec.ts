import runCode from '../src/app';
import Output from '../src/models/Output';

test('should run the given code and return the correct output', () => {
  runCode(
    {
      lang: 'py3',
      code: `name = input()\nprint("Hello %s!" % name)\n`,
      stdin: 'Strivia',
      args: []
    },
    (result: Output) => {
      expect(result.output).toBe('Hello Strivia!\r\n');
    }
  );

  runCode(
    {
      lang: 'java',
      code: `
      import java.util.Scanner;
      class Main {
        public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          System.out.println("Hello " + scanner.next() + "!");
        }
      }`,
      stdin: 'Strivia',
      args: []
    },
    (result: Output) => {
      expect(result.output).toBe('Hello Strivia!\r\n');
    }
  );
});
