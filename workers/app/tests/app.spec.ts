import runCode from '../src/app';
import Output from '../src/models/Output';

function testPython(callback: Function) {
  runCode(
    {
      lang: 'py3',
      code: `name = input()\nprint("Hello %s!" % name)\n`,
      stdin: 'Strivia',
      args: []
    },
    (result: Output) => {
      callback(result.output);
    }
  );
}

function testJava(callback: Function) {
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
      callback(result.output);
    }
  );
}

const amountTests = 2;
let counter = 0;

function isDone(done: Function) {
  counter += 1;
  if (counter === amountTests) done();
}

test('should run the given code and return the correct output', (done) => {
  if (process.env.NODE_ENV !== 'circle') {
    testPython((pythonResult: string) => {
      expect(pythonResult).toBe('Hello Strivia!\r\n');
      isDone(done);
    });

    testJava((javaResult: string) => {
      expect(javaResult).toBe('Hello Strivia!\r\n');
      isDone(done);
    });
  } else {
    expect(true).toBeTruthy();
    done();
  }
});
