import type {Request, Response, NextFunction} from 'express';
import FreetCollection from "../freet/collection";
import moment from "moment";




/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isExpiryExists = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  if (freet.expiryDate === null){
    res.status(400).json({
      error: "Freet has no expiry date"
    });
    return;
  }
  next();
};

const isExpiryNotExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log("got into checking expiry");
  const freet = await FreetCollection.findOne(req.params.freetId);
  if (freet.expiryDate !== null){
    res.status(400).json({
      error: "Freet already has date"
    });
    return;
  }
  next();
};

const isExpiryNotInPast = async (req: Request, res: Response, next: NextFunction) => {
  let curr_date = new Date(req.body.expiryDate);
  if (curr_date < new Date()){
    res.status(400).json({
      error: "Cannot set expiry date in past"
    });
    return;
  }
  next();
};

const isValidExpiryDate = async (req: Request, res: Response, next: NextFunction) => {
  if (!moment(req.body.expiryDate).isValid()){
    res.status(400).json({
      error: 'Invalid expiry date.'
    });
    return;
  }
  next();
};

export {
  isExpiryExists,
  isExpiryNotExists,
  isExpiryNotInPast,
  isValidExpiryDate
};
