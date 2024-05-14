const { validatePassword } = require('../services/validator')

describe('validator', () => {
  describe('password', () => {
    test('validation succeeds with a valid password', () => {
      expect(validatePassword('thisISvalidpas$w0rd')).toBe(true)
    })

    test('validation fails with too short password', () => {
      expect(validatePassword('Sh0rt!!')).toBe(false)
    })

    test('validation fails with too long password', () => {
      expect(validatePassword('L0ng!l0ng!l0ng!l0ng!l0ng!l0ng!l0n')).toBe(false)
    })

    test('validation fails with no digits', () => {
      expect(validatePassword('no-Digits-h€re')).toBe(false)
    })

    test('validation fails with no special character', () => {
      expect(validatePassword('no-Special-here')).toBe(false)
    })

    test('validation fails with no lowercase character', () => {
      expect(validatePassword('N0-LOWERCASE-HERE')).toBe(false)
    })

    test('validation fails with no uppercase character', () => {
      expect(validatePassword('n0-uppercase-here')).toBe(false)
    })
  })
})
