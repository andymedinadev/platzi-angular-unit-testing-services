export class FakeValueService {
  value = 'fake value';

  constructor() {}

  getValue() {
    return this.value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getPromiseValue() {
    return Promise.resolve('fake promise value');
  }
}
