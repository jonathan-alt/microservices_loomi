import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Client } from "../types/auth.types";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Client => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as Client;
  },
);
