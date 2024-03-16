import { body, matchedData, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';
import { httpCodes } from '../constants/http-status-code';
import { ReportTypes } from '../DB/Models/report-types.enum';

const newReport = () => {
  return [
    body('userId')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('User ID is required'),
    body('postId')
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .withMessage('Post ID is required'),
    body('type')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Report Type is required')
      .isIn(Object.values(ReportTypes))
      .withMessage('Invalid report type'),
  ];
};

const validateErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const data = matchedData(req);
    req.body['matchedData'] = data;
    return next();
  }
  const extractedErrors: any = [];
  errors.array().map((err: any) => extractedErrors.push({ [err.param || err.path]: err.msg }));
  return res.status(httpCodes.unprocessable_entity).json({
    errors: extractedErrors
  });
};

export { newReport, validateErrors };