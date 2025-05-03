import mongoose, { Schema, Document } from "mongoose";

interface IBlog extends Document {
	title: string;
	content: string;
	author: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	isPublished: boolean;
	publishedAt: Date;
	views: number;
	likes: number;
	dislikes: number;
	comments: mongoose.Types.ObjectId[];
	tags: string[];
	category: string;
	image: string;
}

const BlogSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
		isPublished: { type: Boolean, default: false },
		publishedAt: { type: Date },
		views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		dislikes: { type: Number, default: 0 },
		comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
		tags: [{ type: String }],
		category: { type: String, required: true },
		image: { type: String, required: true },
	},
	{ timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;

const CommentSchema: Schema = new Schema({
	content: { type: String, required: true },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
});
export const Comment = mongoose.model("Comment", CommentSchema);
