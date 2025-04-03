import { TestBed } from '@angular/core/testing';
import { FakeValueService } from './value-fake.service';

describe('Tests for FakeValueService', () => {
  let fakeValueService: FakeValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakeValueService],
    });
    fakeValueService = TestBed.inject(FakeValueService);
  });

  it('should be created', () => {
    expect(fakeValueService).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return "fake value"', () => {
      expect(fakeValueService.getValue()).toBe('fake value');
    });
  });

  describe('Tests for setValue', () => {
    it('should change the value', () => {
      expect(fakeValueService.getValue()).toBe('fake value');

      fakeValueService.setValue('changed value');

      expect(fakeValueService.getValue()).toBe('changed value');
    });
  });

  describe('Tests for getPromiseValue', () => {
    it('should return "fake promise value" from promise(then)', (doneFn) => {
      fakeValueService.getPromiseValue().then((value) => {
        expect(value).toBe('fake promise value');

        doneFn();
      });
    });

    it('should return "fake promise value" from promise(async/await)', async () => {
      const rta = await fakeValueService.getPromiseValue();

      expect(rta).toBe('fake promise value');
    });
  });
});
