import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  describe('Tests for multiply method', () => {
    it('should return a nine', () => {
      // Arrange
      const calculator = new Calculator();

      // Act
      const rta = calculator.multiply(3, 3);

      // Assert
      expect(rta).toEqual(9);
    });

    it('should return a four', () => {
      // Arrange
      const calculator = new Calculator();

      // Act
      const rta = calculator.multiply(1, 4);

      // Assert
      expect(rta).toEqual(4);
    });
  });

  describe('Tests for divide method', () => {
    it('should return some numbers', () => {
      // Arrange
      const calculator = new Calculator();

      // Act and Assert
      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });

    it('divide for zero', () => {
      const calculator = new Calculator();

      expect(calculator.divide(2, 0)).toBeNull();
      expect(calculator.divide(555245252, 0)).toBeNull();
    });
  });

  it('test matchers', () => {
    let name = 'platzi';
    let name2;

    expect(name).toBeDefined();
    expect(name2).toBeUndefined();

    expect(1 + 3 === 4).toBeTruthy();
    expect(1 + 1 === 3).toBeFalsy();

    expect(5).toBeLessThan(10);
    expect(20).toBeGreaterThan(10);

    expect('123456').toMatch(/123/);
    expect(['apples', 'oranges', 'pears']).toContain('oranges');
  });
});
