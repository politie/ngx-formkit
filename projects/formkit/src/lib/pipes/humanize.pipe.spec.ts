import { HumanizePipe } from './humanize.pipe';

describe('Humanize Pipe', () => {
  const pipe = new HumanizePipe();

  it('Should handle multiple uppercase', () => {
    expect(pipe.transform('ImageURL')).toEqual('Image URL');
  });

  it('should handle titlecase', () => {
    expect(pipe.transform('TestDescription')).toEqual('Test Description');
  });

  it('Should handle other cases', () => {
    expect(pipe.transform('this is a test')).toEqual('This is a test');
  });
});
