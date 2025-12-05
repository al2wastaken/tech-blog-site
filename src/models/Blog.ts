import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  category: string;
  title: string;
  content: string;
  author: string;
  date: Date;
}

const BlogSchema = new Schema<IBlog>({
  category: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
