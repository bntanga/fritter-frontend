import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../likes/middleware';
import * as util from './util';

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
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
    '/:freetId',
    [
        freetValidator.isFreetExists,
    ],
    async (req: Request, res: Response) => {
        const allLikes = await LikeCollection.findAllByFreetId(req.params.freetId);
        const response = allLikes.map(util.constructLikeResponse);
        res.status(200).json(response);
    }
);

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
        likeValidator.isLikeNotExists,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const like = await LikeCollection.addOne(userId, req.params.freetId);
        const allLikes = await LikeCollection.findAllByFreetId(req.params.freetId);
        const response = allLikes.map(util.constructLikeResponse);
        res.status(200).json(response);

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
        likeValidator.isLikeExists,
    ],
    async (req: Request, res: Response) => {
        await LikeCollection.deleteOne(req.session.userId as string, req.params.freetId);

        const allLikes = await LikeCollection.findAllByFreetId(req.params.freetId);
        const response = allLikes.map(util.constructLikeResponse);
        res.status(200).json(response);
    }
);

export {router as likeRouter};
