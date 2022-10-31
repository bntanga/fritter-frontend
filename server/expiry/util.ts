import type {HydratedDocument} from 'mongoose';
import {Freet} from "../freet/model";


/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @returns {FreetResponse} - The freet object formatted for the frontend
 * @param Freet
 */
const isFreetExpired = (Freet: HydratedDocument<Freet>): boolean => {
  const curr_date = new Date();
  return Freet.expiryDate <= curr_date;
}

export {
  isFreetExpired
};
