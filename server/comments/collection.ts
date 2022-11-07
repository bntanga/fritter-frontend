import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class CommentCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the comment
   * @param {string} parentId - The id of the Freet the comment is attached to
   * @param {string} content - The id of the content of the comment
   * @return {Promise<HydratedDocument<Freet>>} - The newly created comment
   */
  static async addOne(authorId: Types.ObjectId | string, parentId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      parentId,
    });
    await comment.save(); // Saves freet to MongoDB
    await comment.populate("parentId");
    return comment.populate('authorId');
  }

  /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: commentId}).populate('authorId').populate('parentId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the Comments
   */
  static async findAll(): Promise<Array<HydratedDocument<Comment>>> {
    // Retrieves freets and sorts them from most to least recent
    return CommentModel.find({}).sort({dateModified: -1}).populate('authorId').populate("parentId");
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the Comments
   */
  static async findCommentsByFreet(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
    // Retrieves freets and sorts them from most to least recent
    return CommentModel.find({parentId: parentId }).sort({dateModified: -1}).populate('authorId').populate("parentId");
  }

  /**
   * Get all the comments in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Comment>>> {
    const author = await UserCollection.findOneByUsername(username);
    return CommentModel.find({authorId: author._id}).populate('authorId').populate('parentId');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} commentId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(commentId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const comment = await CommentModel.findOne({_id: commentId});
    comment.content = content;
    comment.dateModified = new Date();
    await comment.save();
    comment.populate('authorId');
    return comment.populate('parentId');
  }

  /**
   * Delete a comment with given commentId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const freet = await CommentModel.deleteOne({_id: commentId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await CommentModel.deleteMany({authorId});
  }
}

export default CommentCollection;
