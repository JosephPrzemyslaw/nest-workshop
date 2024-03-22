import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
class LoggerMiddleware implements NestMiddleware {
    use(req: Request, _: Response, next: NextFunction) {
        console.log(`${new Date} : ${req.url} ${req.method}`);
        next();
    }
};

export default LoggerMiddleware;
