import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import type { IUser } from '../DB/Models/User';
import PostModel from '../DB/Models/Post';
import type mongoose from 'mongoose';
import { PostStatus } from '../DB/Models/post-status.enum';
import { LocationService } from './Location';
import ReportModel from '../DB/Models/Report';
import { ReportTypes } from '../DB/Models/report-types.enum';
import { SNSService } from './SNS';


class ReportService {
  public static async reportPost(postId: mongoose.Types.ObjectId, reportType: string, currentUser: IUser, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) {
        return res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }

      // TODO let user to confirm multiple times
      // check user has reported already
      const existingReport = await ReportModel.find({
        postId: existingPost.id,
        userId: currentUser.id
      });

      if (existingReport.length >= 2) {
        return res.status(httpCodes.badRequest).send({
          message: 'User Cannot report more on this post'
        });
      }

      // If report is confirmation - let user to even negative reported already
      if (existingReport.length) {
        if (existingReport[0].type === ReportTypes.confirmation) {
          // another confirmation is not allowed
          if (reportType === ReportTypes.confirmation) {
            return res.status(httpCodes.badRequest).send({
              message: 'User has confirmed the Post already'
            });
          }
        } else {
          // Now user can only confirm the post
          if (reportType !== ReportTypes.confirmation) {
            return res.status(httpCodes.badRequest).send({
              message: 'User Can only Confirm the post now'
            });
          }
        }
      }

      const MAX_STORE_USER_DISTANCE = process.env.MAX_REPORT_DISTANCE || 500;

      // check user location and post location
      const distanceBetweenUserAndPostStore = await LocationService.getDistanceBetweenUserAndStore({
        longitude: currentUser.lastLocation.coordinates[0],
        latitude: currentUser.lastLocation.coordinates[1]
      }, existingPost.storePlaceId);

      if (distanceBetweenUserAndPostStore > parseInt(String(MAX_STORE_USER_DISTANCE), 10)) {
        return res.status(httpCodes.badRequest).send({
          message: 'User must br within the radius of the post store to report a post'
        });
      }

      // create the report for the post
      const newReport = await new ReportModel({
        postId: existingPost.id,
        userId: currentUser.id,
        type: reportType
      }).save();

      // SNS Event
      SNSService.newReport(newReport);

      return res.sendStatus(httpCodes.ok);
    } catch (error) {
      console.error('reportPost-ReportService', error);
      return res.sendStatus(httpCodes.serverError);
    }

  }

  public static async getPostReportCounts(postId: mongoose.Types.ObjectId, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) {
        return res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }

      const reportCountsPromises = Object.values(ReportTypes).map(async reportType => {
        const count = await ReportModel.countDocuments({
          type: reportType
        });

        return { [reportType]: count };
      });

      const reportCounts = await Promise.all(reportCountsPromises);

      return res.status(httpCodes.ok).send(reportCounts);

    } catch (error) {
      console.error('getPostReportCounts-ReportService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

  public static async getUserPostReport(postId: mongoose.Types.ObjectId, currentUser: IUser, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) {
        return res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }


      const userReports = await ReportModel.find({
        postId: existingPost.id,
        userId: currentUser.id
      });

      return res.send({
        userReports: userReports.map(report => report.type)
      });

    } catch (error) {
      console.error('getUserPostReport-ReportService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

}

export {
  ReportService
};
