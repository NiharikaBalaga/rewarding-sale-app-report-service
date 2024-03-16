import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import type { IReport } from '../DB/Models/Report';
import ReportModel from '../DB/Models/Report';
import { ReportStatus } from '../DB/Models/report-status.enum';

class ReportService {

  public static async getReports(res: Response) {
    try {
      // Get reports
      const reports = await ReportModel.find({}).exec();

      // send updated serialised user in response
      if (reports){
        return res.send({
          message: 'Reports Retrieved Successfully',
          status: httpCodes.ok,
          reports: reports
        });
      } else {
        return res.send({
          message: 'Reports Retrieved without success, please check',
          status: httpCodes.notFound,
          reports: null
        });
      }
    } catch (error){
      console.error('getReports-error', error);
      return  res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  public static async createReport(reportObject: Partial<IReport>, res: Response) {
    try {
      // Check if the user has already report the same post
      const existingReport = await ReportModel.findOne({ userId: reportObject.userId, postId: reportObject.postId });
      if (existingReport) {
        return res.status(httpCodes.conflict).send({
          message: 'You can\'t report a post more than once.',
          status: httpCodes.conflict
        });
      }

      // Create new report
      const newReport = new ReportModel(reportObject);
      await newReport.save();

      // send updated serialised report in response
      return res.send({
        message: 'Report created Successfully',
        status: ReportStatus.created,
        newReport: newReport
      });
    } catch (logoutError){
      console.error('createReport-AdminService', logoutError);
      return  res.sendStatus(httpCodes.serverError);
    }
  }

}

export {
  ReportService
};
