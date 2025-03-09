# API Endpoint Documentation

This document outlines all available API endpoints for the backend application.

## Authentication (`/auth`)

### `POST /auth/register`

*   **Description:** Registers a new user.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires user data (e.g., username, email, password). (Specific structure not defined in provided code, but will need to be present)
*   **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not required.

### `POST /auth/login`

*   **Description:** Logs in an existing user.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires user credentials (e.g., email, password).
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not required.

### `PUT /auth/update/:userId`

*   **Description:** Updates a user's information.
*   **Method:** `PUT`
*   **Path Parameters:**
    *   `userId`: The ID of the user to update.
*   **Request Body:**
    *   Requires the user's updated data.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /auth/change-password/:userId`

*   **Description:** Changes a user's password.
*   **Method:** `PUT`
*   **Path Parameters:**
    *   `userId`: The ID of the user changing their password.
*   **Request Body:**
    *   Requires the user's current password and new password.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /auth/profile/:userId`

*   **Description:** Retrieves a user's profile information.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose profile is requested.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /auth/update-status/:userId`

*   **Description:** Updates a user's account status (e.g., active/inactive).
*   **Method:** `PUT`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose status is being updated.
*   **Request Body:**
    *   Requires the new account status.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Cart (`/carts`)

### `POST /carts/add`

*   **Description:** Adds an item to the cart.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires product ID and quantity.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /carts/items`

*   **Description:** Gets all items from the cart.
*   **Method:** `GET`
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /carts/update-qty`

*   **Description:** Updates the quantity of an item in the cart.
*   **Method:** `PUT`
*   **Request Body:**
    *   Requires product ID and new quantity.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `DELETE /carts/remove/:userId/:productId`

*   **Description:** Removes a specific item from the cart.
*   **Method:** `DELETE`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose cart is being modified.
    *   `productId`: The ID of the product to remove.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /carts/:userId`

*   **Description:** Gets the entire cart for a specific user.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose cart is requested.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `DELETE /carts/clear/:userId`

*   **Description:** Clears the cart for a specific user.
*   **Method:** `DELETE`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose cart is being cleared.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Complaints (`/complaints`)

### `POST /complaints/post-complaints`

*   **Description:** Creates a new complaint.
*   **Method:** `POST`
*   **Request Body:**
    * Requires complaint data. (Specific structure not defined in provided code, but will need to be present)
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /complaints/get-complaints`

*   **Description:** Gets all complaints.
*   **Method:** `GET`
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /complaints/update-complaint-status`

*   **Description:** Updates the status of a complaint.
*   **Method:** `PUT`
*   **Request Body:**
    * Requires `complaintId` and `status`.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Coupons (`/coupons`)

### `GET /coupons/get-coupons`

*   **Description:** Gets all coupons.
*   **Method:** `GET`
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `POST /coupons/save-coupons`

*   **Description:** Creates a new coupon.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires coupon data.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `DELETE /coupons/delete-coupons`

*   **Description:** Deletes a coupon.
*   **Method:** `DELETE`
* **Request Body:**
     * Requires `couponId` to delete specific coupon.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /coupons/update-status`

*   **Description:** Updates the status of a coupon (e.g., active/inactive).
*   **Method:** `PUT`
*   **Request Body:**
    *   Requires `couponId` and `status`
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `POST /coupons/verify-coupons`

*   **Description:** Verifies if a coupon is valid.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires coupon code and possibly other relevant data.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Images (`/platforms`)

### `POST /platforms/image-upload`

*   **Description:** Uploads an image.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires an `image` file to be uploaded.
*   **Form Data:**
    *   `image`: The image file.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Orders (`/orders`)

### `POST /orders/new`

*   **Description:** Creates a new order.
*   **Method:** `POST`
*   **Request Body:**
    * Requires order data.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /orders/:orderId`

*   **Description:** Gets a specific order by its ID.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `orderId`: The ID of the order to retrieve.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /orders/users/:userId/orders`

*   **Description:** Gets all orders for a specific user.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose orders are being retrieved.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /orders/:orderId/status`

*   **Description:** Updates the status of an order.
*   **Method:** `PUT`
*   **Path Parameters:**
    *   `orderId`: The ID of the order to update.
*   **Request Body:**
    * Requires the new order status.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Products (`/products`)

### `POST /products/new`

*   **Description:** Creates a new product.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires product data (e.g., name, description, price).
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /products`

*   **Description:** Gets all products.
*   **Method:** `GET`
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /products/:productId`

*   **Description:** Gets a specific product by its ID.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `productId`: The ID of the product to retrieve.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /products/:productId`

*   **Description:** Updates a specific product.
*   **Method:** `PUT`
*   **Path Parameters:**
    *   `productId`: The ID of the product to update.
*   **Request Body:**
    *   Requires updated product data.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `DELETE /products/:productId`

*   **Description:** Deletes a specific product.
*   **Method:** `DELETE`
*   **Path Parameters:**
    *   `productId`: The ID of the product to delete.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PATCH /products/:productId/stock`

*   **Description:** Updates the stock of a specific product.
*   **Method:** `PATCH`
*   **Path Parameters:**
    *   `productId`: The ID of the product to update.
*   **Request Body:**
    *   Requires the new stock quantity.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PATCH /products/:productId/visibility`

*   **Description:** Updates the visibility of a specific product.
*   **Method:** `PATCH`
*   **Path Parameters:**
    *   `productId`: The ID of the product to update.
*   **Request Body:**
    *   Requires the new visibility status.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /products/search`

*   **Description:** Searches for products based on search criteria.
*   **Method:** `GET`
* **Query parameters:**
    *   Requires search criteria to be present.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Reviews (`/reviews`)

### `POST /reviews/new`

*   **Description:** Creates a new review.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires review data (e.g., product ID, user ID, rating, comment).
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /reviews/product/:productId`

*   **Description:** Gets all reviews for a specific product.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `productId`: The ID of the product whose reviews are requested.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `GET /reviews/user/:userId`

*   **Description:** Gets all reviews written by a specific user.
*   **Method:** `GET`
*   **Path Parameters:**
    *   `userId`: The ID of the user whose reviews are requested.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `PUT /reviews/:reviewId`

*   **Description:** Updates a specific review.
*   **Method:** `PUT`
*   **Path Parameters:**
    *   `reviewId`: The ID of the review to update.
*   **Request Body:**
    *   Requires updated review data.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

### `DELETE /reviews/:reviewId`

*   **Description:** Deletes a specific review.
*   **Method:** `DELETE`
*   **Path Parameters:**
    *   `reviewId`: The ID of the review to delete.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not defined in provided code but most likely required.

## Sellers (`/sellers`)

### `POST /sellers/register`

*   **Description:** Registers a new seller.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires seller data (e.g., name, email, password).
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not required.

### `POST /sellers/login`

*   **Description:** Logs in an existing seller.
*   **Method:** `POST`
*   **Request Body:**
    *   Requires seller credentials (e.g., email, password).
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not required.

### `POST /sellers/verify-otp`

*   **Description:** Verifies OTP for seller.
*   **Method:** `POST`
*   **Request Body:**
    * Requires `OTP` and other fields that might be relevant.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not required.
### `POST /sellers/resend-otp`

*   **Description:** Resends OTP for seller.
*   **Method:** `POST`
*   **Request Body:**
    * Requires `email` or other relevant fields.
* **Response Body:**
    * will return `success` and `message` fields.
*   **Authentication:** Not required.

### `GET /sellers/profile`

*   **Description:** Gets the seller's profile.
*   **Method:** `GET`
* **Response Body:**
    * will return `success` and `message` fields.
 **Authentication:** Not defined in provided code but most likely required.

### `PUT /sellers/update-profile`

*   **Description:** Updates the seller's profile.
*   **Method:** `PUT`
*   **Request Body:**
    *   Requires updated seller data.
* **Response Body:**
    * will return `success` and `message` `data`
    * fields.
*   **Authentication:** Not defined in provided code but most likely required.