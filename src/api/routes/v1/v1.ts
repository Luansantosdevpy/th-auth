import { Router } from 'express';

import auth from './auth';
import healthcheck from './healthcheck';
import permission from './permission';
import role from './role';
import userRole from './userRole';

export default async (): Promise<Router> => {
  const router = Router();

  router.use('/v1', router);
  router.use('/health-check', await healthcheck());
  router.use('/auth', await auth())
  router.use('/permission', await permission());
  router.use('/role', await role());
  router.use('/user-role', await userRole());
  return router;
};
