import type {HydratedDocument, Types} from 'mongoose';
import FreetCollection from "../freet/collection";
import FreetModel, {Freet} from "../freet/model";

class ExpiryCollection {
  /**
   * Add an expiry to freet collection
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   * @param freetId
   * @param date_string
   */
  static async changeOne(freetId: Types.ObjectId | string, date_string: string): Promise<HydratedDocument<Freet>> {
    console.log("this is date string");
    console.log(date_string);
    let date = new Date(date_string);
    const freet = await FreetCollection.findOne(freetId);
    freet.expiryDate = date;
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a like with given author_id an freet_id.
   *
   * @param authorId
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetCollection.findOne(freetId);
    freet.expiryDate = null;
    await freet.save();
    return freet;
  }
}

export default ExpiryCollection;
