import bcrypt from "bcryptjs";
import crypto from "crypto";

function md5(str: string): string {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("hex");
}

export default {
  md5,
  bhash: (str: string): Promise<string> => bcrypt.hash(str, 10),
  bcompare: (str: string, hash: string): Promise<boolean> =>
    bcrypt.compare(str, hash)
};
