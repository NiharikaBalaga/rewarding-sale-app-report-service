import type { PublishCommandInput } from '@aws-sdk/client-sns';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { IReport } from '../DB/Models/Report';
import { Events } from './events.enum';

class SNSService {
  private static readonly SNS: SNSClient = new SNSClient({
    apiVersion: 'version',
    region: process.env.aws_region,
    credentials: {
      accessKeyId: process.env.aws_sns_access_key_id || '',
      secretAccessKey: process.env.aws_sns_secret_access_key || '',
    },
  });

  private static async _publishToReportTopicARN(Message: string, groupId: string) { // groupId should be POST ID of report
    try {
      const messageParams: PublishCommandInput = {
        Message,
        TopicArn: process.env.REPORT_TOPIC_SNS_ARN,
        MessageGroupId: groupId,
      };
      const { MessageId } = await this.SNS.send(
        new PublishCommand(messageParams),
      );
      console.log('_publishToReportTopicARN-success', MessageId);
    } catch (_publishToReportTopicARNError) {
      console.error(
        '_publishToReportTopicARNError',
        _publishToReportTopicARNError,
      );
    }
  }

  static async newReport(report: IReport) {
    const EVENT_TYPE = Events.newReport;
    const snsMessage = Object.assign({ report }, { EVENT_TYPE, reportID: report.id, postId: report.postId });
    console.log(`Publishing ${EVENT_TYPE} to Report Topic`);
    return this._publishToReportTopicARN(JSON.stringify(snsMessage), report.id);
  }
}

export {
  SNSService
};