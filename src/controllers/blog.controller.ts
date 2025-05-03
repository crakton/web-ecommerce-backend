import { stat } from "fs";
import Blog, { Comment } from "../models/blog.model";
import { Request, Response } from "express";

class BlogManager {
	constructor() {
		// Initialize any properties or dependencies here
	}

	// Method to create a new blog post
	public async createPost(req: Request, res: Response) {
		try {
			// Logic to create a new blog post
			const DTOs = req.body;
			// Create a new blog post
			await Blog.create(DTOs);
			res
				.status(201)
				.json({ message: "Post created successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error creating post", error, status: false });
		}
	}

	// Method to fetch all blog posts
	public async getAllPosts(req: Request, res: Response) {
		// Logic to fetch all blog posts
		try {
			const post = await Blog.find();
			res
				.status(200)
				.json({ post, message: "Posts fetched successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching posts", error, status: false });
		}
	}

	// Method to update a blog post
	public async updatePost(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const newUpdates = req.body;

			// Update the blog post
			await Blog.findByIdAndUpdate(id, { ...newUpdates });
			res
				.status(200)
				.json({ message: "Post updated successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error updating post", error, status: false });
		}
	}

	// Method to delete a blog post
	public async deletePost(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Delete the blog post
			await Blog.findByIdAndDelete(id);
			res
				.status(200)
				.json({ message: "Post deleted successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error deleting post", error, status: false });
		}
	}

	// Method to get a single blog post
	public async getSinglePost(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch the blog post by ID
			const post = await Blog.findById(id);
			if (!post) {
				res.status(404).json({ message: "Post not found", status: false });
				return;
			}

			res
				.status(200)
				.json({ post, message: "Post fetched successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching post", error, status: false });
		}
	}

	// Comment on a blog post
	public async commentOnPost(req: Request, res: Response) {
		try {
			const { postId } = req.params;
			const { content } = req.body;

			// Create a new comment
			const comment = await Comment.create({ content });
			await Blog.findByIdAndUpdate(postId, {
				$push: { comments: comment._id },
			});

			res
				.status(201)
				.json({ message: "Comment added successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error adding comment", error, status: false });
		}
	}

	// Method to update views count
	public async updateViews(req: Request, res: Response) {
		try {
			const { postId } = req.params;

			// Increment the views count
			const post = await Blog.findOne({ id: postId });
			if (!post) {
				res.status(404).json({ message: "Post not found", status: false });
				return;
			}
			post.views += 1;
			await post.save();

			res
				.status(200)
				.json({ message: "Views updated successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error updating views", error, status: false });
		}
	}

	// Method to like a blog post
	public async likePost(req: Request, res: Response) {
		try {
			const { postId } = req.params;
			// Increment the likes count
			await Blog.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

			res
				.status(200)
				.json({ message: "Post liked successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error liking post", error, status: false });
		}
	}
	// Method to dislike a blog post
	public async dislikePost(req: Request, res: Response) {
		try {
			const { postId } = req.params;

			// Assuming you have a Blog model to interact with your database
			// Increment the dislikes count
			await Blog.findByIdAndUpdate(postId, { $inc: { dislikes: 1 } });

			res
				.status(200)
				.json({ message: "Post disliked successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error disliking post", error, status: false });
		}
	}

	// Method to get all comments on a blog post
	public async getComments(req: Request, res: Response) {
		try {
			const { postId } = req.params;

			// Assuming you have a Blog model to interact with your database
			// Fetch the blog post by ID and populate the comments
			const post = await Blog.findById(postId).populate("comments");

			if (!post) {
				res.status(404).json({ message: "Post not found", status: false });
				return;
			}

			res.status(200).json({
				comments: post.comments,
				status: true,
				message: "Comments fetched successfully",
			});
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching comments", error, status: false });
		}
	}
	// Method to delete a comment
	public async deleteComment(req: Request, res: Response) {
		try {
			const { postId, commentId } = req.params;

			// Delete the comment
			await Comment.findByIdAndDelete(commentId);
			await Blog.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

			res
				.status(200)
				.json({ message: "Comment deleted successfully", status: true });
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error deleting comment", error, status: false });
		}
	}
}

export default BlogManager;
