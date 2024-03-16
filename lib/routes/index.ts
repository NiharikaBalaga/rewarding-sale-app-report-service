import express from 'express';
import passport from 'passport';
import { isBlocked, tokenBlacklist } from '../middlewares';
import { ReportServiceController } from '../controller';
import { newReport, validateErrors } from './RequestValidations';

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello' });
  });

  // Get Reports
  router.get('', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, ReportServiceController.getReports]);

  // Create Report
  router.post('', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newReport(), validateErrors, ReportServiceController.createReport]);

  return router;
}

export const routes = getRouter();