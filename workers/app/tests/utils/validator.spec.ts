//* ------------------- DEPENDENCIES ------------------ *\\

//* Function imports
import checkInput from '../../src/utils/validator';

//* -------------------- UNIT TESTS ------------------- *\\

test('should check if the run input is correct', () => {
  //* Everything is correct
  expect(
    checkInput({
      lang: 'java',
      code: 'code',
      stdin: 'stdin',
      args: []
    })
  ).toHaveLength(0);

  //* Language is not supported
  expect(
    checkInput({
      lang: 'language',
      code: 'code',
      stdin: 'stdin',
      args: []
    })
  ).toHaveLength(1);
});
