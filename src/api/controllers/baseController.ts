import type { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

export abstract class BaseController {
  protected resolve<T>(token: new (...args: any[]) => T): T {
    return container.resolve<T>(token);
  }

  protected async execute(
    method: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await method(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
