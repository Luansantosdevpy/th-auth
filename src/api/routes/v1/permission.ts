import { Router } from 'express';
import { container } from 'tsyringe';

import { authenticate } from '../../../application/middlewares/authMiddleware';
import { checkPermission } from '../../../application/middlewares/checkPermission';
import PermissionController from '../../controllers/permissionController';

export default async (): Promise<Router> => {
  const router = Router();
  const permissionController = container.resolve(PermissionController);

  router.post(
    '/create', 
    authenticate,
    checkPermission('create_permission'),
    permissionController.createPermission
  );

  router.get(
    '/', 
    authenticate,
    checkPermission('view_permission'),
    permissionController.getAllPermissions
  );

  router.get(
    '/:name', 
    authenticate, 
    checkPermission('view_permission_details'), 
    permissionController.getPermissionByName
  );

  return router;
};
