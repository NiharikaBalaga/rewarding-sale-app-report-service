import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import UserModel from './User';
import PostModel from './Post';
import { ReportTypes } from './report-types.enum';


export interface IReport extends Document {
  userId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
  type: ReportTypes
}

const ReportSchema: mongoose.Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: UserModel, // Connection user collection - useful during popular operations
    required: true,
    index: true,
  },

  postId: {
    type: mongoose.Types.ObjectId,
    ref: PostModel, // Connection user collection - useful during popular operations
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: ReportTypes,
    index: true,
    required: true
  },

}, {
  collection: 'Reports',
  timestamps: true,
  id: true,
});

const ReportModel: Model<IReport> = mongoose.model<IReport>('Report', ReportSchema);

export default ReportModel;