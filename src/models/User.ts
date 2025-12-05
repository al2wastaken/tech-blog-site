import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  administrator: boolean;
  comparePassword(candidate: string): boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  administrator: { type: Boolean, default: false },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = crypto.createHash("sha256").update(this.password).digest("hex");
});

UserSchema.methods.comparePassword = function (candidate: string) {
  const hashed = crypto.createHash("sha256").update(candidate).digest("hex");
  return this.password === hashed;
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
