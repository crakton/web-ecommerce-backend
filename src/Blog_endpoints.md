# Blog API Documentation

This document outlines the available endpoints for managing blog posts and comments. The base path for all endpoints is `/blogs`.

## Posts

### Create a New Blog Post

- **Method**: `POST`
- **Endpoint**: `/blogs/create`
- **Description**: Creates a new blog post entry in the database.
- **Request Body**:
  ```json
  {
  	"title": "The Future of E-commerce",
  	"content": "Detailed content about the future trends...",
  	"author": "60d21b4667d0d8992e610c8a", // Example Seller ObjectId
  	"category": "Technology",
  	"image": "https://example.com/images/future-ecommerce.jpg",
  	"tags": ["e-commerce", "trends", "future"]
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
  	"post": {
  		/* Created post object */
  	},
  	"message": "Post created successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error creating post",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

### Get All Blog Posts

- **Method**: `GET`
- **Endpoint**: `/blogs/all`
- **Description**: Retrieves a list of all blog posts.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"post": [
  		{
  			"_id": "60d21b4667d0d8992e610c9f",
  			"title": "The Future of E-commerce",
  			"content": "Detailed content about the future trends...",
  			"author": "60d21b4667d0d8992e610c8a",
  			"category": "Technology",
  			"image": "https://example.com/images/future-ecommerce.jpg",
  			"tags": ["e-commerce", "trends", "future"],
  			"views": 150,
  			"likes": 25,
  			"dislikes": 2,
  			"comments": ["60d21b4667d0d8992e610ca0", "60d21b4667d0d8992e610ca1"],
  			"isPublished": true,
  			"publishedAt": "2023-10-27T10:00:00.000Z",
  			"createdAt": "2023-10-27T09:00:00.000Z",
  			"updatedAt": "2023-10-27T11:00:00.000Z"
  		}
  		// ... other posts
  	],
  	"message": "Posts retrieved successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error fetching posts",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

### Get a Single Blog Post

- **Method**: `GET`
- **Endpoint**: `/blogs/:id`
- **Description**: Retrieves a single blog post identified by its ID.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post to retrieve.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"post": {
  		"_id": "60d21b4667d0d8992e610c9f",
  		"title": "The Future of E-commerce"
  		/* other post fields */
  	},
  	"message": "Post fetched successfully",
  	"status": true
  }
  ```
- **Error Responses**:
  - (404 Not Found):
    ```json
    {
    	"message": "Post not found",
    	"status": false
    }
    ```
  - (500 Internal Server Error):
    ```json
    {
    	"message": "Error fetching post",
    	"error": {
    		/* Error details */
    	},
    	"status": false
    }
    ```

### Update a Blog Post

- **Method**: `PUT`
- **Endpoint**: `/blogs/update/:id`
- **Description**: Updates an existing blog post identified by its ID.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post to update.
- **Request Body**:
  ```json
  {
  	"title": "Updated Title for E-commerce Post",
  	"content": "Updated content with new insights.",
  	"isPublished": true
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
  	"message": "Post updated successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error updating post",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

### Delete a Blog Post

- **Method**: `DELETE`
- **Endpoint**: `/blogs/delete/:id`
- **Description**: Deletes a blog post identified by its ID.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post to delete.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"message": "Post deleted successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error deleting post",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

### Increment Post View Count

- **Method**: `POST`
- **Endpoint**: `/blogs/:id/view`
- **Description**: Increments the view count for a specific blog post.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"message": "Views updated successfully",
  	"status": true
  }
  ```
- **Error Responses**:
  - (404 Not Found):
    ```json
    {
    	"message": "Post not found",
    	"status": false
    }
    ```
  - (500 Internal Server Error):
    ```json
    {
    	"message": "Error updating views",
    	"error": {
    		/* Error details */
    	},
    	"status": false
    }
    ```

### Like a Blog Post

- **Method**: `GET` _(Note: Consider using POST instead)_
- **Endpoint**: `/blogs/:id/like`
- **Description**: Increments the like count for a specific blog post.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"message": "Post liked successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error liking post",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

### Dislike a Blog Post

- **Method**: `GET` _(Note: Consider using POST instead)_
- **Endpoint**: `/blogs/:id/dislike`
- **Description**: Increments the dislike count for a specific blog post.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"message": "Post disliked successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error disliking post",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

## Comments

### Add a Comment to a Blog Post

- **Method**: `POST`
- **Endpoint**: `/blogs/:id/comments`
- **Description**: Adds a new comment to a specific blog post.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post to comment on.
- **Request Body**:
  ```json
  {
  	"content": "This is a great article! Very insightful."
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
  	"message": "Comment added successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error adding comment",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```

### Get Comments for a Blog Post

- **Method**: `GET`
- **Endpoint**: `/blogs/:id/comments`
- **Description**: Retrieves all comments associated with a specific blog post.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"comments": [
  		{
  			"_id": "60d21b4667d0d8992e610ca0",
  			"content": "This is a great article! Very insightful.",
  			"likes": 5,
  			"dislikes": 0
  		},
  		{
  			"_id": "60d21b4667d0d8992e610ca1",
  			"content": "I agree with the points made here.",
  			"likes": 2,
  			"dislikes": 1
  		}
  		// ... other comments
  	],
  	"status": true,
  	"message": "Comments fetched successfully"
  }
  ```
- **Error Responses**:
  - (404 Not Found):
    ```json
    {
    	"message": "Post not found",
    	"status": false
    }
    ```
  - (500 Internal Server Error):
    ```json
    {
    	"message": "Error fetching comments",
    	"error": {
    		/* Error details */
    	},
    	"status": false
    }
    ```

### Delete a Comment

- **Method**: `DELETE`
- **Endpoint**: `/blogs/:id/comments/:commentId`
- **Description**: Deletes a specific comment from a blog post.
- **Path Parameters**:
  - `id` (string): The MongoDB ObjectId of the blog post.
  - `commentId` (string): The MongoDB ObjectId of the comment to delete.
- **Request Body**: None
- **Success Response** (200 OK):
  ```json
  {
  	"message": "Comment deleted successfully",
  	"status": true
  }
  ```
- **Error Response** (500 Internal Server Error):
  ```json
  {
  	"message": "Error deleting comment",
  	"error": {
  		/* Error details */
  	},
  	"status": false
  }
  ```
