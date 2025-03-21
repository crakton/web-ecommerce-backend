# API Endpoints and Payloads

This document outlines the API endpoints, expected request bodies, and parameters for the e-commerce backend.

## Authentication (AUTH)

### 1. Register User

- **Endpoint:** `POST /auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
  	"name": "string", // User's full name
  	"email": "string", // User's email address (must be unique)
  	"password": "string", // User's password (must meet complexity requirements)
  	"phone": "string" // User's phone number
  }
  ```

### 2. Login User

- **Endpoint:** `POST /auth/login`
- **Description:** Logs in an existing user.
- **Request Body:**
  ```json
  {
  	"email": "string", // User's email address
  	"password": "string" // User's password
  }
  ```

### 3. Update User

- **Endpoint:** `PATCH /auth/users/:userId`
- **Description:** Updates an existing user's information.
- **Path Parameter:**
  - `userId`: `string` - The ID of the user to update.
- **Request Body:**
  ```json
  {
  	"name": "string", // (Optional) New user's full name
  	"email": "string", // (Optional) New user's email address
  	"phone": "string" // (Optional) New user's phone number
  	// ... any other user field to update
  }
  ```

### 4. Change User Password

- **Endpoint:** `PATCH /auth/users/:userId/password`
- **Description:** Changes an existing user's password.
- **Path Parameter:**
  - `userId`: `string` - The ID of the user to update.
- **Request Body:**
  ```json
  {
  	"currentPassword": "string", // User's current password
  	"newPassword": "string" // User's new password
  }
  ```

### 5. Update Account Status

- **Endpoint:** `PATCH /auth/users/:userId/status`
- **Description:** Updates the status of a user account (e.g., active, inactive).
- **Path Parameter:**
  - `userId`: `string` - The ID of the user to update.
- **Request Body:**
  ```json
  {
  	"status": "string" // New account status (e.g., "active", "inactive", "blocked")
  }
  ```

## Cart (CART)

### 1. Add to Cart

- **Endpoint:** `POST /cart`
- **Description:** Adds a product to the user's cart.
- **Request Body:**
  ```json
  {
  	"userId": "string", // ID of the user adding to cart
  	"productId": "string", // ID of the product to add
  	"productQty": "number" // Quantity of the product to add
  }
  ```

### 2. Update Cart Quantity

- **Endpoint:** `PATCH /cart`
- **Description:** Updates the quantity of a product in the user's cart.
- **Request Body:**
  ```json
  {
  	"userId": "string", // ID of the user whose cart is being updated
  	"productId": "string", // ID of the product to update
  	"productQty": "number" // New quantity of the product
  }
  ```

### 3. Remove from Cart

- **Endpoint:** `DELETE /cart/:userId/:productId`
- **Description:** Removes a specific product from the user's cart.
- **Path Parameters:**
  - `userId`: `string` - ID of the user.
  - `productId`: `string` - ID of the product to remove.

### 4. Get Cart

- **Endpoint:** `GET /cart/:userId`
- **Description:** Retrieves the contents of a user's cart.
- **Path Parameter:**
  - `userId`: `string` - ID of the user.

### 5. Clear Cart

- **Endpoint:** `DELETE /cart/:userId/clear`
- **Description:** Clears all items from a user's cart.
- **Path Parameter:**
  - `userId`: `string` - ID of the user.

## Complaint (COMPLAINT)

### 1. Post Complaint

- **Endpoint:** `POST /complaints`
- **Description:** Submits a new complaint.
- **Request Body:**
  ```json
  {
  	"name": "string", // Name of the complainant
  	"email": "string", // Email of the complainant
  	"message": "string", // Complaint message
  	"userType": "string" // Type of user (e.g., "customer", "seller")
  }
  ```

### 2. Update Complaint Status

- **Endpoint:** `PATCH /complaints/:complaintId/status`
- **Description:** Updates the status of a complaint.
- **Path Parameter:**
  - `complaintId`: `string` - ID of the complaint to update.
- **Request Body:**
  ```json
  {
  	"status": "string" // New status of the complaint (e.g., "pending", "resolved", "in progress")
  }
  ```

## Coupon (COUPON)

### 1. Save Coupon

- **Endpoint:** `POST /coupons`
- **Description:** Creates a new coupon.
- **Request Body:**
  ```json
  {
  	"code": "string", // Unique coupon code
  	"discountPercentage": "number", // Discount percentage (e.g., 10 for 10%)
  	"name": "string", // Name of the coupon
  	"status": "string" // Status of the coupon (e.g., "active", "inactive")
  }
  ```

### 2. Delete Coupon

- **Endpoint:** `DELETE /coupons/:code`
- **Description:** Deletes a coupon.
- **Path Parameter:**
  - `code`: `string` - The coupon code to delete.

### 3. Update Coupon Status

- **Endpoint:** `PATCH /coupons/:code/status`
- **Description:** Updates the status of a coupon.
- **Path Parameter:**
  - `code`: `string` - The coupon code to update.
- **Request Body:**
  ```json
  {
  	"status": "string" // New status of the coupon (e.g., "active", "inactive")
  }
  ```

### 4. Verify Coupon

- **Endpoint:** `POST /coupons/verify`
- **Description:** Verifies if a coupon is valid.
- **Request Body:**
  ```json
  {
  	"code": "string" // The coupon code to verify
  }
  ```

## Order (ORDER)

### 1. Place New Order

- **Endpoint:** `POST /orders`
- **Description:** Places a new order.
- **Request Body:**
  ```json
  {
  	"userId": "string", // ID of the user placing the order
  	"address": "string", // Shipping address
  	"email": "string", // User's email
  	"name": "string", // User's name
  	"paymentMethod": "string" // Payment method (e.g., "credit card", "paypal")
  }
  ```

### 2. Get Order

- **Endpoint:** `GET /orders/:orderId`
- **Description:** Retrieves a specific order.
- **Path Parameter:**
  - `orderId`: `string` - ID of the order to retrieve.

### 3. Get All User's Orders

- **Endpoint:** `GET /orders/user/:userId`
- **Description:** Retrieves all orders for a specific user.
- **Path Parameter:**
  - `userId`: `string` - ID of the user.

## Product (PRODUCT)

### 1. Create New Product

- **Endpoint:** `POST /products`
- **Description:** Creates a new product.
- **Request Body:**
  ```json
  {
  	// ... all product fields
  	"name": "string",
  	"description": "string",
  	"price": "number",
  	"category": "string",
  	"inStockValue": "number",
  	"images": ["string"],
  	"visibility": "boolean"
  }
  ```

### 2. Get Products

- **Endpoint:** `GET /products`
- **Description:** Retrieves a list of products, with optional filtering and sorting.
- **Query Parameters:**
  - `category`: `string` - Filter by category.
  - `visibility`: `boolean` - Filter by visibility.
  - `minPrice`: `number` - Filter by minimum price.
  - `maxPrice`: `number` - Filter by maximum price.
  - `sort`: `string` - Sort order (e.g., "price-asc", "price-desc", "name-asc").

### 3. Get Product

- **Endpoint:** `GET /products/:productId`
- **Description:** Retrieves a specific product.
- **Path Parameter:**
  - `productId`: `string` - ID of the product to retrieve.

### 4. Update Product

- **Endpoint:** `PATCH /products/:productId`
- **Description:** Updates an existing product.
- **Path Parameter:**
  - `productId`: `string` - ID of the product to update.
- **Request Body:**
  ```json
  {
  	// ... any product field to update
  }
  ```

### 5. Delete Product

- **Endpoint:** `DELETE /products/:productId`
- **Description:** Deletes a product.
- **Path Parameter:**
  - `productId`: `string` - ID of the product to delete.

### 6. Update Product Stock

- **Endpoint:** `PATCH /products/:productId/stock`
- **Description:** Updates the stock quantity of a product.
- **Path Parameter:**
  - `productId`: `string` - ID of the product to update.
- **Request Body:**
  ```json
  {
  	"inStockValue": "number" // New stock quantity
  }
  ```

### 7. Update Product Visibility

- **Endpoint:** `PATCH /products/:productId/visibility`
- **Description:** Updates the visibility of a product.
- **Path Parameter:**
  - `productId`: `string` - ID of the product to update.
- **Request Body:**
  ```json
  {
  	"visibility": "boolean" // New visibility status (true/false)
  }
  ```

## Review (REVIEW)

### 1. Create New Review

- **Endpoint:** `POST /reviews`
- **Description:** Creates a new review for a product.
- **Request Body:**
  ```json
  {
  	"userId": "string", // ID of the user creating the review
  	"productId": "string", // ID of the product being reviewed
  	"review": "string", // Review text
  	"rating": "number" // Rating (e.g., 1-5)
  }
  ```

### 2. Get Product Reviews

- **Endpoint:** `GET /reviews/product/:productId`
- **Description:** Retrieves all reviews for a specific product.
- **Path Parameter:**
  - `productId`: `string` - ID of the product.

### 3. Get User Reviews

- **Endpoint:** `GET /reviews/user/:userId`
- **Description:** Retrieves all reviews created by a specific user.
- **Path Parameter:**
  - `userId`: `string` - ID of the user.

## Seller (SELLER)

### 1. Register New Seller

- **Endpoint:** `POST /sellers/register`
- **Description:** Registers a new seller.
- **Request Body:**
  ```json
  {
  	"name": "string", // Seller's name
  	"email": "string", // Seller's email
  	"password": "string", // Seller's password
  	"phoneNumber": "string", // Seller's phone number
  	"businessName": "string", // Seller's business name
  	"businessAddress": "string", // Seller's business address
  	"businessType": "string" // Seller's business type (e.g., "retail", "wholesale")
  }
  ```

### 2. Login Seller

- **Endpoint:** `POST /sellers/login`
- **Description:** Logs in an existing seller.
- **Request Body:**
  ```json
  {
  	"email": "string", // Seller's email
  	"password": "string" // Seller's password
  }
  ```

### 3. Update Seller

- **Endpoint:** `PATCH /sellers/:id`
- **Description:** Updates an existing seller's information.
- **Path Parameter:**
  - `id`: `string` - The ID of the seller to update.
- **Request Body:**
  ```json
  {
  	// ... any seller field to update
  }
  ```

### 4. Get Seller Profile

- **Endpoint:** `GET /sellers/:id`
- **Description:** Retrieves a seller's profile.
- **Path Parameter:**
  - `id`: `string` - The ID of the seller.

### 5. Change Seller Password

- **Endpoint:** `PATCH /sellers/:id/password`
- **Description:** Changes a seller's password.
- **Path Parameter:**
  - `id`: `string` - The ID of the seller.
- **Request Body:**
  ```json
  {
  	"currentPassword": "string", // Seller's current password
  	"newPassword": "string" // Seller's new password
  }
  ```

### 6. Send Seller OTP

- **Endpoint:** `POST /sellers/otp/resend`
- **Description:** Sends an OTP to the seller's email or phone.
- **Request Body:**
  ```json
  {
  	"email": "string", // Seller's email
  	"type": "string" // Type of verification (e.g., "email", "phone")
  }
  ```

### 7. Verify Seller OTP

- **Endpoint:** `POST /sellers/otp/verify`
- **Description:** Verifies the OTP entered by the seller.
- **Request Body:**
  ```json
  {
  	"email": "string", // Seller's email
  	"otp": "string", // OTP code
  	"type": "string" // Type of verification (e.g., "email", "phone")
  }
  ```

### 8. Delete Seller

- **Endpoint:** `DELETE /sellers/:id`
- **Description:** Deletes a seller account.
- **Path Parameter:**
  - `id`: `string` - The ID of the seller to delete.

## Upload (UPLOAD)

### 1. Upload File

- **Endpoint:** `POST /upload`
- **Description:** Uploads a file (e.g., image).
- **Request:**
  - `file`: `File` - The file to upload (sent as `multipart/form-data`).
- **Note:** This endpoint expects a `multipart/form-data` request, not a JSON body.
