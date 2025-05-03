import { Router } from "express";
import BlogManager from "../controllers/blog.controller";

const blogController = new BlogManager();
const routes = Router();

routes.post("/create", blogController.createPost.bind(blogController));
routes.get("/all", blogController.getAllPosts.bind(blogController));
routes.put("/update/:id", blogController.updatePost.bind(blogController));
routes.delete("/delete/:id", blogController.deletePost.bind(blogController));
routes.get("/:id", blogController.getSinglePost.bind(blogController));
routes.get("/:id/comments", blogController.getComments.bind(blogController));
routes.delete(
	"/:id/comments/:commentId",
	blogController.deleteComment.bind(blogController)
);
routes.post("/:id/comments", blogController.commentOnPost.bind(blogController));
routes.post("/:id/view", blogController.updateViews.bind(blogController));
routes.get("/:id/like", blogController.likePost.bind(blogController));
routes.get("/:id/dislike", blogController.dislikePost.bind(blogController));

export default routes;
