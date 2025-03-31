import type { MockUser, MockUserRole, MockRole, MockUserAttributes } from './repositories.mock';

export const createMockUser = (overrides = {}): MockUser => ({
  _id: '123',
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test User',
  organizationId: 'org123',
  createdAt: new Date(),
  ...overrides
});

export const createMockUserRole = (overrides = {}): MockUserRole => ({
  userId: '123',
  roleId: 'role123',
  ...overrides
});

export const createMockRole = (overrides = {}): MockRole => ({
  _id: 'role123',
  name: 'Admin',
  ...overrides
});

export const createMockUserAttributes = (overrides = {}): MockUserAttributes => ({
  userId: '123',
  phone: '1234567890',
  photo: 'photo-url.jpg',
  ...overrides
});