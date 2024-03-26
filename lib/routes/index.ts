import express from 'express';
import passport from 'passport';
import { isBlocked, tokenBlacklist } from '../middlewares';
import { ReportServiceController } from '../controller';
import { postId, reportPost, validateErrors } from './RequestValidations';

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello' });
  });


  // Get report types
  router.get('/types', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, ReportServiceController.getReportTypes]);

  // Report a Post
  router.get('/:postId/report/:reportType', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, reportPost(), validateErrors, ReportServiceController.reportPost]);

  // Get Post report Count
  router.get('/:postId/counts', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, postId(), validateErrors, ReportServiceController.reportCount]);

  // Get User Post Report
  router.get('/:postId/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, postId(), validateErrors, ReportServiceController.userPostReport]);
  return router;
}

export const routes = getRouter();