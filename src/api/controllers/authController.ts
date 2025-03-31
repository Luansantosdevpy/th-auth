import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import AuthService from '../../application/services/authService';
import type { SigninRequestDTO } from '../../domain/interfaces/input/signinRequest';
import type { SignupRequestDTO } from '../../domain/interfaces/input/signupRequest';
import Logger from '../../infrastructure/log/logger';
import { successResponse } from '../../infrastructure/utils/responseFormatter';
import { BaseController } from '../controllers/baseController';

@injectable()
export default class AuthController extends BaseController {
  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('AuthController - signup - Request Received');

      const { name, email, password, organizationId } = req.body as SignupRequestDTO;

      const authService = this.resolve(AuthService);
      const user = await authService.signup({ name, email, password, organizationId });

      Logger.debug('AuthController - signup - User created successfully');
      return res.status(201).json(successResponse(201, 'User created successfully', user));
    }, req, res, next);
  };

  public signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('AuthController - signin - Request Received');

      const { email, password } = req.body as SigninRequestDTO;

      const authService = this.resolve(AuthService);
      const token = await authService.signin(email, password);

      Logger.debug('AuthController - signin - Signin successful');
      return res.status(200).json(successResponse(200, 'Signin successful', { token }));
    }, req, res, next);
  };
}
