import express from "express";

const catchAsync = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;