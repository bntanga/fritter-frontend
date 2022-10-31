import type {HydratedDocument} from 'mongoose';
import type {Like, PopulatedLike} from './model';
import {Types} from "mongoose";
import {Freet} from "../freet/model";

// Update this if you add a property to the Freet type!
type LikeResponse = {
  _id: string;
  author: string;
  parentFreet: Freet;
};


/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @returns {FreetResponse} - The freet object formatted for the frontend
 * @param like
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = likeCopy.authorId;
  delete likeCopy.authorId;
  const parent  = likeCopy.freetId;
  delete likeCopy.freetId;

  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    author: username,
    parentFreet: parent,
  };
};

export {
  constructLikeResponse
};
