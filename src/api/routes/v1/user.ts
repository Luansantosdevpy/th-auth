import { Router } from 'express';
import { container } from 'tsyringe';

import { validationMiddleware } from '../../../application/middlewares/validateRequest';
import * as validations from '../../../application/validations/userValidation'
import UserController from '../../controllers/userController';

export default async (): Promise<Router> => {
  const router = Router();
  const userController = container.resolve(UserController);

  router.post('/assign/attributes', validations.userAttributesValidation, validationMiddleware, userController.assignAttributesToUser);

  return router;
};
