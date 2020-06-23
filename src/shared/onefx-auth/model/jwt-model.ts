import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { promisify } from "util";

const { Schema } = mongoose;

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

type Opts = {
  secret: string;
  mongoose: mongoose.Mongoose;
  expDays: number;
};

type UserId = string;

type AuthJwt = {
  jti: string;
  sub: UserId;
  exp: number;
  iat: number;
};

type AuthJwtModel = mongoose.Document &
  AuthJwt & {
    userId: string;
    expireAt: Date;
    createAt: Date;
    updateAt: Date;
  };

function getExpireEpochDays(days: number): number {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export class JwtModel {
  public secret: string;

  public Model: mongoose.Model<AuthJwtModel>;

  constructor({ secret, mongoose: mInstance, expDays }: Opts) {
    this.secret = secret;

    const JwtSchema = new Schema(
      {
        userId: { type: Schema.Types.ObjectId },
        expireAt: {
          type: Date,
          default: () => new Date(getExpireEpochDays(expDays)),
          index: { expires: `${expDays}d` }
        },

        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now }
      },
      {
        timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
        id: true
      }
    );

    JwtSchema.index({ userId: 1 });

    this.Model = mInstance.model("Jwt", JwtSchema);
  }

  public async create(userId: string): Promise<string> {
    const resp = await new this.Model({ userId }).save();
    return String(
      await sign(
        {
          jti: resp.id,
          sub: userId,
          exp: Math.floor(new Date(resp.expireAt).getTime() / 1000),
          iat: Math.floor(new Date(resp.createAt).getTime() / 1000)
        },
        this.secret
      )
    );
  }

  public async revoke(token: string): Promise<void> {
    let decoded;
    try {
      decoded = (await verify(token, this.secret)) as AuthJwt;
    } catch (e) {
      return;
    }
    await this.Model.deleteOne({ _id: decoded.jti });
  }

  public async verify(token: string): Promise<UserId> {
    let decoded: AuthJwt;
    try {
      decoded = (await verify(token, this.secret)) as AuthJwt;
    } catch (e) {
      return "";
    }

    const found = await this.Model.findOne({
      _id: decoded.jti,
      userId: decoded.sub
    });
    if (!found) {
      return "";
    }

    return found.userId;
  }
}
