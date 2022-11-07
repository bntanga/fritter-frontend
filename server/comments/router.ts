import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as commentValidator from '../comments/middleware';
import {isFreetExists} from '../freet/middleware';
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
    userValidator.isUserLoggedIn,
    isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const parentId = req.params.freetId;
    const commentsForFreet = await CommentCollection.findCommentsByFreet(parentId);
    const response = commentsForFreet.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new comments.
 *
 * @name POST /api/comments
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */

router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    isFreetExists,
    commentValidator.isValidCommentContent,
  ],
  async (req: Request, res: Response) => {
    const parentId = req.params.freetId;
    let userId;
    if (req.body.anonymous as boolean === true){
        userId = "634e079774932ffeb998aeed"; //Anonymous author
    } else{
        userId = (req.session.userId as string) ?? '';
    }
    const comment = await CommentCollection.addOne(userId, parentId, req.body.content);

    await comment.populate('parentId');
    await comment.populate('authorId');
    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

/**
 * Modify a comment
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
      console.log("entering modifying");
    const comment = await CommentCollection.updateOne(req.params.commentId, req.body.content);
    res.status(200).json({
      message: 'Your comment was updated successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

export {router as commentRouter};
