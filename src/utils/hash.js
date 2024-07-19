import bcrypt from 'bcrypt';

export const hashValue = (value) => bcrypt.hash(value, 10);

export const compareHash = (hash, value) => bcrypt.compare(value, hash);
