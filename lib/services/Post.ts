import type { IPost } from '../DB/Models/Post';
import PostModel from '../DB/Models/Post';
import type mongoose from 'mongoose';

class PostService {

  static async createPostWithGivenPostId(post: IPost, postId: mongoose.Types.ObjectId) {
    try {
      const existingPost = await this.findById(postId);
      if (existingPost) throw new Error('Post With Given Id already exists');

      const newPost = new PostModel({ ...post });
      return newPost.save();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string | mongoose.Types.ObjectId) {
    return PostModel.findById(id);
  }

  private static async _update(id: string | mongoose.Types.ObjectId, updatePostDto: any) {
    return PostModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  static async updatePost(updatedPost: IPost, postId: mongoose.Types.ObjectId) {
    return this._update(postId, updatedPost);
  }

  static async deletePost(postId: string | mongoose.Types.ObjectId) {
    return PostModel.findByIdAndDelete(postId);
  }

}

export {
  PostService
};
