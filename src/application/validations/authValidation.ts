import { body } from 'express-validator';

export const signupValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),

  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
    .withMessage('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one special character.')
    .notEmpty()
    .withMessage('Password is required'),
];

export const signinValidation = [
  body('email')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
