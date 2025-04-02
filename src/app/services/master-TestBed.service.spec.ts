import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { ValueService } from './value.service';

describe('MasterService TestBed tests', () => {
  let masterService: MasterService;

  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<ValueService>('ValueService', [
      'getValue',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        {
          provide: ValueService,
          useValue: spy,
        },
      ],
    });

    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  it('should call to getValue from ValueService', () => {
    valueServiceSpy.getValue.and.returnValue('fake from spy');

    expect(masterService.getValue()).toBe('fake from spy');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
