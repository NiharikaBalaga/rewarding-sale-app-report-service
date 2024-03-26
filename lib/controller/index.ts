import type { Request, Response } from 'express';
import type { IUser } from '../DB/Models/User';
import { ReportService } from '../services/Report';
import { ReportTypes } from '../DB/Models/report-types.enum';


interface RequestValidatedByPassport extends Request {
  user: {
    userId: string;
    accessToken: string;
    phoneNumber: string,
    iat: number,
    exp: number,
  }
}

interface RequestInterferedByIsBlocked extends RequestValidatedByPassport {
  currentUser: IUser
}

class ReportServiceController {
  public static getReportTypes(req: RequestInterferedByIsBlocked, res: Response) {
    return res.send(Object.values(ReportTypes));
  }

  public static reportPost(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData: { postId, reportType } } = req.body;
    const { currentUser }  = req;

    return ReportService.reportPost(postId, reportType, currentUser, res);
  }

  public static reportCount(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData: { postId } } = req.body;

    return ReportService.getPostReportCounts(postId, res);
  }

  public static userPostReport(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData: { postId } } = req.body;
    const { currentUser }  = req;
    return ReportService.getUserPostReport(postId, currentUser, res);
  }
}

export  {
  ReportServiceController
};