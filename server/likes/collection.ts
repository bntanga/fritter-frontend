import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param freetId
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      authorId,
      freetId
    });
    await like.save(); // Saves freet to MongoDB
    await like.populate("freetId");
    return like.populate('authorId');
  }

  /**
   * Find a like with given author_id an freet_id.
   *
   * @param authorId
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async findOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const like = await LikeModel.findOne({authorId: authorId, freetId: freetId});
    if (like === null){
      return null;
    }
    await like.populate("authorId");
    return like.populate("freetId");
  }

  /**
   * Get all the likes by given author
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const author = await UserCollection.findOneByUsername(username);
    return LikeModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the likes by given author
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   * @param freetId
   */
  static async findAllByFreetId(freetId: string): Promise<Array<HydratedDocument<Like>>> {

    return LikeModel.find({freetId: freetId}).populate(['authorId', 'freetId']);
  }


  /**
   * Delete a like with given author_id an freet_id.
   *
   * @param authorId
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await LikeModel.deleteOne({authorId: authorId, freetId: freetId});
    return freet !== null;
  }
}

export default LikeCollection;
