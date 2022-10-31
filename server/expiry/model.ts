import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

// Type definition for Freet on the backend
export type Expiry = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  expiryDate: Date;
  freetId : Types.ObjectId;
};

// export type PopulatedLike = {
//   _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
//   expiryDate: Date;
//   freetId: Freet;
// };

const ExpirySchema = new Schema<Expiry>({
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  expiryDate : {
    type: Date,
    required: true
  }
});

const LikeModel = model<Expiry>('Like', ExpirySchema);
export default LikeModel;
