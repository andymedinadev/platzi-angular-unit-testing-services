import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { FakeValueService } from './value-fake.service';

describe('MasterService tests', () => {
  it('should return "my value" from the real service', () => {
    const valueService = new ValueService();

    const masterService = new MasterService(valueService);

    expect(masterService.getValue()).toBe('my value');
  });

  it('should return "fake value" from a fake service', () => {
    const fakeValueService = new FakeValueService();

    const masterService = new MasterService(
      fakeValueService as unknown as ValueService
    );

    expect(masterService.getValue()).toBe('fake value');
  });

  it('should return "fake from object" from a fake object', () => {
    const fake = { getValue: () => 'fake from object' };

    const masterService = new MasterService(fake as ValueService);

    expect(masterService.getValue()).toBe('fake from object');
  });

  it('should call to getValue from ValueService', () => {
    const valueServiceSpy = jasmine.createSpyObj<ValueService>('ValueService', [
      'getValue',
    ]);

    valueServiceSpy.getValue.and.returnValue('fake from spy');

    const masterService = new MasterService(valueServiceSpy);

    expect(masterService.getValue()).toBe('fake from spy');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
