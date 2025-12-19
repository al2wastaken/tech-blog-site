import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  categoryId: string;
  title: string;
  content: string;
  author: string;
  url: string;
  date: Date;
}

const BlogSchema = new Schema<IBlog>({
  categoryId: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
