import { IsNullOrUndefinedPipe } from './is-null-or-undefined.pipe';

describe('IsNullOrUndefinedPipe', () => {
  it('create an instance', () => {
    const pipe: IsNullOrUndefinedPipe = new IsNullOrUndefinedPipe();
    expect(pipe).toBeTruthy();
  });
});
