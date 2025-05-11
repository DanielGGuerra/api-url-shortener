import { hashPassword, comparePasswords } from '../bcrypt';

describe('Bcrypt Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      const result = await comparePasswords(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await hashPassword(password);

      const result = await comparePasswords(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = await hashPassword(password);

      const result = await comparePasswords(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should handle special characters in password', async () => {
      const password = '!@#$%^&*()_+';
      const hashedPassword = await hashPassword(password);

      const result = await comparePasswords(password, hashedPassword);
      expect(result).toBe(true);
    });
  });
});
