
import { NextFunction, Response, Request } from "express";

export default function loggerMiddleware(req: Request, _: Response, next: NextFunction) {
    console.log(`${new Date} : ${req.url} ${req.method}`);
    next();
}
