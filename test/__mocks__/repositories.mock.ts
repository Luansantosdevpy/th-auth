export interface MockUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  organizationId: string;
  createdAt: Date;
}

export interface MockUserRole {
  userId: string;
  roleId: string;
}

export interface MockRole {
  _id: string;
  name: string;
}

export interface MockUserAttributes {
  userId: string;
  phone?: string;
  photo?: string;
}

export interface MockHealthCheck {
  name: string,
  status: string,
  uptime: number,
  timestamp: number,
  checks: [
    {
      name: string,
      status: string,
    },
  ],
}

export const createMockRepositories = () => {
  const userRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findUserAttributes: jest.fn(),
    assignAttributesToUser: jest.fn(),
    findUserById: jest.fn()
  };

  const userRoleRepository = {
    findRolesByUser: jest.fn(),
    assignRoleToUser: jest.fn()
  };

  const roleRepository = {
    findRoleById: jest.fn(),
    createRole: jest.fn(),
    findAllRoles: jest.fn(),
    findRoleByName: jest.fn()
  };

  const healthCheckRepository = {
    findStatus: jest.fn()
  }

  return {
    userRepository,
    userRoleRepository,
    roleRepository,
    healthCheckRepository
  };
};