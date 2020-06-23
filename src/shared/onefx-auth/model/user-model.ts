import mongoose from "mongoose";
import tools from "../utils/tools";

const { Schema } = mongoose;

type TNewUser = {
  password: string;
  email: string;
  ip: string;
};

export type TUser = mongoose.Document &
  TNewUser & {
    avatar: string;

    isBlocked: boolean;

    createAt: Date;
    updateAt: Date;
  };

export class UserModel {
  public Model: mongoose.Model<TUser>;

  constructor({ mongoose: mInstance }: { mongoose: mongoose.Mongoose }) {
    const UserSchema = new Schema(
      {
        password: { type: String },
        email: { type: String },
        ip: { type: String },

        isBlocked: { type: Boolean, default: false },

        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now }
      },
      {
        timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
        id: true
      }
    );

    UserSchema.index({ email: 1 }, { unique: true });

    this.Model = mInstance.model("User", UserSchema);
  }

  public async getById(id: string): Promise<TUser | null> {
    return this.Model.findOne({ _id: id });
  }

  public async getByMail(email: string): Promise<TUser | null> {
    return this.Model.findOne({ email });
  }

  public async newAndSave(user: TNewUser): Promise<TUser> {
    const hashed = {
      ...user,
      password: await tools.bhash(user.password)
    };
    return new this.Model(hashed).save();
  }

  public async updatePassword(
    userId: string,
    password: string
  ): Promise<TUser | null> {
    return this.Model.update(
      { _id: userId },
      { password: await tools.bhash(password) }
    );
  }

  public async verifyPassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    let resp;
    try {
      resp = await this.Model.findOne({ _id: userId }).select("password");
    } catch (err) {
      return false;
    }
    return Boolean(resp && (await tools.bcompare(password, resp.password)));
  }
}
