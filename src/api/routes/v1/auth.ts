import { Router } from 'express';
import { container } from 'tsyringe';

import { validationMiddleware } from '../../../application/middlewares/validateRequest';
import { signinValidation, signupValidation } from '../../../application/validations/authValidation';
import AuthController from '../../controllers/authController';

export default async (): Promise<Router> => {
  const router = Router();
  const authController = container.resolve(AuthController);

  router.post('/signin', signinValidation, validationMiddleware, authController.signin);
  router.post('/signup', signupValidation, validationMiddleware, authController.signup);

  return router;
};
