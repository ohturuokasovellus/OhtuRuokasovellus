const { isValidPassword } = require('../../src/utilities/validators')

describe('validator', () => {
  describe('password', () => {
    test('validation succeeds with a valid password', () => {
      expect(isValidPassword('thisISvalidpas$w0rd')).toBe(true)
    })

    test('validation fails with too short password', () => {
      expect(isValidPassword('Sh0rt!!')).toBe(false)
    })

    test('validation fails with too long password', () => {
      expect(isValidPassword('L0ng!l0ng!l0ng!l0ng!l0ng!l0ng!l0n')).toBe(false)
    })

    test('validation fails with no digits', () => {
      expect(isValidPassword('no-Digits-h€re')).toBe(false)
    })

    test('validation fails with no special character', () => {
      expect(isValidPassword('no-Special-here')).toBe(false)
    })

    test('validation fails with no lowercase character', () => {
      expect(isValidPassword('N0-LOWERCASE-HERE')).toBe(false)
    })

    test('validation fails with no uppercase character', () => {
      expect(isValidPassword('n0-uppercase-here')).toBe(false)
    })
  })
})
