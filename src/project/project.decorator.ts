import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as process from "process";

export const requireProject = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        console.log(process.env.DELIMITER, request.params);
        return request;
    },
);
