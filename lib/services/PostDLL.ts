import type { IPostDLL } from '../DB/Models/Post-DLL';
import PostDLLModel from '../DB/Models/Post-DLL';
import type mongoose from 'mongoose';

class PostDLLService {

  static async newNode(PostDLL: IPostDLL, postDLLId: mongoose.Types.ObjectId) {
    try {
      const existingPostDLL = await this.findById(postDLLId);
      if (existingPostDLL) throw new Error('PostDLL With Given Id already exists');

      const node = new PostDLLModel({
        ...PostDLL
      });
      return node.save();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string | mongoose.Types.ObjectId) {
    return PostDLLModel.findById(id);
  }

  private static async _update(id: string | mongoose.Types.ObjectId, updateNodeDto: any) {
    return PostDLLModel
      .findByIdAndUpdate(id, updateNodeDto, { new: true })
      .exec();
  }

  static async updateNode(PostDLL: IPostDLL, postDLLId: mongoose.Types.ObjectId) {
    return this._update(postDLLId, PostDLL);
  }

  static async deleteNode(nodeId: string | mongoose.Types.ObjectId) {
    return PostDLLModel.findByIdAndDelete(nodeId);
  }

}

export {
  PostDLLService
};
