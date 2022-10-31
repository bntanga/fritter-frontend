import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ExpiryCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../likes/middleware';
import * as expiryValidator from "./middleware";
import * as expiry_util from './util';
import * as freet_util from '../freet/util';
import CommentCollection from "../comments/collection";

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */


/**
 * Create a new like
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    expiryValidator.isExpiryNotExists,
    expiryValidator.isValidExpiryDate,
    expiryValidator.isExpiryNotInPast,
  ],
  async (req: Request, res: Response) => {
      console.log("got into expiry funtion ");
    const freet = await ExpiryCollection.changeOne(req.params.freetId, req.body.expiryDate);

    res.status(201).json({
      message: 'Successfully added an expiry date to  Freet.',
        freet: freet_util.constructFreetResponse(freet)

    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      freetValidator.isValidFreetModifier,
      expiryValidator.isExpiryExists,
  ],
    async (req: Request, res: Response) => {
        await ExpiryCollection.deleteOne(req.params.freetId);
        res.status(201).json({
            message: 'Successfully removed freet expiry',
        });
  }
);

router.put(
    '/:freetId',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetExists,
        freetValidator.isValidFreetModifier,
        expiryValidator.isExpiryExists,
        expiryValidator.isValidExpiryDate,
        expiryValidator.isExpiryNotInPast,
    ],
    async (req: Request, res: Response) => {
        const freet = await ExpiryCollection.changeOne(req.params.freetId, req.body.expiryDate);

        const commentsForFreet = await CommentCollection.findCommentsByFreet(req.params.freetId);

        res.status(201).json({
            message: 'Successfully changed Freet expiry date.',
            freet: freet_util.constructFreetResponse(freet)

        });
    }
);

export {router as expiryRouter};
