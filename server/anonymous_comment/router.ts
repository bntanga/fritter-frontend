import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from '../comments/collection';
import * as userValidator from '../user/middleware';
import * as commentValidator from '../comments/middleware';
import {isFreetExists} from '../freet/middleware';
import * as util from '../comments/util';

const router = express.Router();
const anonymous_author = "634e079774932ffeb998aeed";
router.post(
    '/:freetId?',
    [
        userValidator.isUserLoggedIn,
        isFreetExists,
        commentValidator.isValidCommentContent,
    ],
    async (req: Request, res: Response) => {
        console.log("this is new author: ", anonymous_author as string)
        const userId = anonymous_author; // Will not be an empty string since its validated in isUserLoggedIn
        const parentId = req.params.freetId;
        const comment = await CommentCollection.addOne(userId, parentId, req.body.content);
        comment.populate('parentId');
        res.status(201).json({
            message: 'Your comment was created successfully.',
            comment: util.constructCommentResponse(comment)
        });
    }
);

export {router as anonymousCommentRouter};