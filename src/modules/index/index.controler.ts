import { NextFunction, Request, Response } from "express";

/**
 * This IndexController 
 * @param req Express.Request
 * @param res Express.Response
 * @param next Express.NextFunction
 */
function IndexController(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).send("API is running....");
    } catch (error) {
        next(error)
    }
}

export default IndexController;