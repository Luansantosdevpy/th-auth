import { body } from 'express-validator';

export const userAttributesValidation = [
  body('userId')
    .isString()
    .withMessage('UserId must be a string')
    .notEmpty()
    .withMessage('UserId is required'),
];