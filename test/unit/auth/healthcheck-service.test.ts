import 'reflect-metadata';
import { createMockRepositories } from '../../__mocks__/repositories.mock';
import { mockHealthCheck } from '../../__mocks__/userData.mock';
import HealthCheckService from '../../../src/application/services/healthCheckService';

describe('HealthCheckService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HealthCheck', () => {
    it('Should return application status', async () => {
      const { healthCheckRepository } = createMockRepositories();
      const healthCheckService = new HealthCheckService(healthCheckRepository);
      healthCheckRepository.findStatus.mockResolvedValue(mockHealthCheck());

      const result = await healthCheckService.checkStatusAPI();

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Project base',
          status: 'OK',
          checks: [{ name: 'Database', status: 'OK' }],
        })
      );
    });

    it('Should return error when return is error on database', async () => {
      const { healthCheckRepository } = createMockRepositories();
      const healthCheckService = new HealthCheckService(healthCheckRepository);
      healthCheckRepository.findStatus.mockResolvedValue('ERROR');

      const result = await healthCheckService.checkStatusAPI();

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Project base',
          status: 'ERROR',
          checks: [{ name: 'Database', status: 'ERROR' }],
        })
      );
    });
  });
});