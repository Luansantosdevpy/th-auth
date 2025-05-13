import { Router } from 'express';
import { container } from 'tsyringe';

import { authenticate } from '../../../application/middlewares/authMiddleware';
import UserRoleController from '../../controllers/userRoleController';

export default async (): Promise<Router> => {
  const router = Router();
  const userRoleController = container.resolve(UserRoleController);

  router.post('/assign/role/user', authenticate, userRoleController.assignRoleToUser);
  router.get('/:userId', authenticate, userRoleController.findRolesByUser);
  router.delete('/delete/role/user',authenticate, userRoleController.deleteRoleToUser);

  return router;
};
