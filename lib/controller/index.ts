import type { Request, Response } from 'express';
import type { IUser } from '../DB/Models/User';
import { ReportService } from '../services/Report';


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

  public static getReports(req: RequestInterferedByIsBlocked, res: Response) {
    return ReportService.getReports(res);
  }

  public static createReport(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData } = req.body;
    return ReportService.createReport(matchedData, res);
  }

}

export  {
  ReportServiceController
};