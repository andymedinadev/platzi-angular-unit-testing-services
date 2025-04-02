import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService],
    });
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return "my value"', () => {
      expect(service.getValue()).toBe('my value');
    });
  });

  describe('Tests for setValue', () => {
    it('should change the value', () => {
      expect(service.getValue()).toBe('my value');

      service.setValue('changed value');

      expect(service.getValue()).toBe('changed value');
    });
  });

  describe('Tests for getPromiseValue', () => {
    it('should return "promise value" from promise(then)', (doneFn) => {
      service.getPromiseValue().then((value) => {
        expect(value).toBe('promise value');

        doneFn();
      });
    });

    it('should return "promise value" from promise(async/await)', async () => {
      const rta = await service.getPromiseValue();

      expect(rta).toBe('promise value');
    });
  });

  describe('Tests for getObservable', () => {
    it('should return "observable value"', (doneFn) => {
      service.getObservable().subscribe((value) => {
        expect(value).toBe('observable value');

        doneFn();
      });
    });
  });
});
