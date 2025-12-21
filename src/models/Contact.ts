import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  ip?: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    ip: { type: String, required: false },
  },
  { timestamps: { createdAt: "createdAt" } }
);

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
