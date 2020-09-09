import mongoose from "mongoose";
import { v4 as uuidV4 } from "uuid";

const { Schema } = mongoose;

type Opts = {
  mongoose: mongoose.Mongoose;
  expMins: number;
};

export type EmailToken = {
  token: string;
  userId: string;
  expireAt: string;
};

type EmailTokenModelType = mongoose.Document &
  EmailToken & {
    createAt: Date;
    updateAt: Date;
  };

function getExpireEpochMins(mins: number): number {
  return Date.now() + mins * 60 * 1000;
}

export class EmailTokenModel {
  public Model: mongoose.Model<EmailTokenModelType>;

  constructor({ mongoose: mInstance, expMins }: Opts) {
    const EmailTokenSchema = new Schema(
      {
        token: { type: String, default: uuidV4 },
        userId: { type: Schema.Types.ObjectId },
        expireAt: {
          type: Date,
          default: () => new Date(getExpireEpochMins(expMins)),
          index: { expires: `${expMins}m` },
        },

        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now },
      },
      {
        timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
        id: true,
      }
    );

    EmailTokenSchema.index({ token: 1 });

    this.Model = mInstance.model("email_tokens", EmailTokenSchema);
  }

  public async newAndSave(userId: string): Promise<EmailToken> {
    return new this.Model({ userId }).save();
  }

  public async findOneAndDelete(token: string): Promise<EmailToken | null> {
    return this.Model.findOneAndDelete({ token });
  }

  public async findOne(token: string): Promise<EmailToken | null> {
    return this.Model.findOne({ token });
  }
}
