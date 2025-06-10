// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      secretOrKey: 'ssssss$%$#', // your secret key (keep it safe!)
    });
  }

  async validate(payload: any) {
    // This function is called after token is verified
    // Payload contains decoded JWT info, e.g. user id, email
    // Return what you want to attach to request.user
    return { userId: payload.sub, username: payload.name };
  }
}
