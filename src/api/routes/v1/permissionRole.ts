import { Router } from 'express';
import { container } from 'tsyringe';

import { authenticate } from '../../../application/middlewares/authMiddleware';
import PermissionRoleController from '../../controllers/permissionRoleController';

export default async (): Promise<Router> => {
  const router = Router();
  const permissionRoleController = container.resolve(PermissionRoleController);

  router.post('/assign/permissions/role', authenticate, permissionRoleController.assignPermissionsToRole);

  return router;
};
