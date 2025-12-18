import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug?: string;
  color: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: false, unique: true },
  color: { type: String, required: true, match: /^#([0-9A-Fa-f]{6})$/ },
});

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
