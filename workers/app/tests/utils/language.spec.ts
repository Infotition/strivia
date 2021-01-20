import { languageNameFromAlias } from '../../src/utils/languages';

test('should return the coorect language from an alias', () => {
  expect(languageNameFromAlias('py3')?.name).toBe('python3');
  expect(languageNameFromAlias('java')?.name).toBe('java');
  expect(languageNameFromAlias('language')).toBe(undefined);
});
