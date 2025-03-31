import { Router } from 'express';
import { container } from 'tsyringe';

import { authenticate } from '../../../application/middlewares/authMiddleware';
import { checkPermission } from '../../../application/middlewares/checkPermission';
import RoleController from '../../controllers/roleController';

export default async (): Promise<Router> => {
  const router = Router();
  const roleController = container.resolve(RoleController);

  router.post('/create', authenticate, checkPermission('create_role'), roleController.createRole);
  router.get('/', authenticate, checkPermission('view_roles'), roleController.getAllRoles);
  router.get('/:name', authenticate, checkPermission('view_role_details'), roleController.getRoleByName);

  return router;
};
