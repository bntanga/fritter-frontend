import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../likes/collection';




/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const like= await LikeCollection.findOne(req.session.userId, req.params.freetId);
  if (like === null){
    res.status(400).json({
      error: "Freet was not liked by user"
    });
    return;
  }
  next();
};

/**
 * Checks if the current user does not like current Freet
 */
const isLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const like= await LikeCollection.findOne(req.session.userId, req.params.freetId);
  if (like !== null){
    res.status(400).json({
      error: "Freet was already liked by user"
    });
    return;
  }
  next();
};

export {
  isLikeExists,
  isLikeNotExists
};
