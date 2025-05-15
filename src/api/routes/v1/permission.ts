import { Router } from 'express';
import { container } from 'tsyringe';

import { authenticate } from '../../../application/middlewares/authMiddleware';
import { checkPermission } from '../../../application/middlewares/checkPermission';
import PermissionController from '../../controllers/permissionController';
import UserController from '../../controllers/userController';

export default async (): Promise<Router> => {
  const router = Router();
  const permissionController = container.resolve(PermissionController);
  const userController = container.resolve(UserController);

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

  router.post(
    '/verify-permission',
    authenticate,
    checkPermission('verify_permission'),
    userController.verifyPermission
  );

  return router;
};
