import { customAlphabet } from 'nanoid';

const DEFAULT_SIZE = 6;

const customNanoId = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  DEFAULT_SIZE,
);

export function generateCode() {
  return customNanoId(DEFAULT_SIZE);
}
