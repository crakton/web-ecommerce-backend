import { Request, Response } from "express";
import { Product } from "../models";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export class ProductController {
	public async createProduct(req: Request, res: Response): Promise<void> {
		try {
			const productData = req.body;
			const product = new Product({
				...productData,
				productId: uuidv4(),
				rating: 0,
				soldStockValue: 0,
			});

			await product.save();
			res.status(201).json({
				status: true,
				data: product,
				message: "Product created succesfully",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error creating product", error });
		}
	}

	public async getProducts(req: Request, res: Response): Promise<void> {
		try {
			const { category, visibility, minPrice, maxPrice, sort } = req.query;
			const query: any = {};

			// Apply filters
			if (category) query.category = category;
			if (visibility) query.visibility = visibility;
			if (minPrice || maxPrice) {
				query.price = {};
				if (minPrice) query.price.$gte = Number(minPrice);
				if (maxPrice) query.price.$lte = Number(maxPrice);
			}

			// Build sort options
			let sortOptions: any = {};
			if (sort) {
				switch (sort) {
					case "price_asc":
						sortOptions.price = 1;
						break;
					case "price_desc":
						sortOptions.price = -1;
						break;
					case "rating":
						sortOptions.rating = -1;
						break;
					case "newest":
						sortOptions._id = -1;
						break;
				}
			}
			// const third_party_products = "https://api.merabestie.com/get-product";
			// const response = await axios.get(third_party_products);
			// const thirdPartyData = response.data;

			const products = await Product.find(query).sort(sortOptions);

			res
				.status(200)
				.json({ status: true, data: products, message: "All products" });
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error fetching products", error });
		}
	}

	public async getProduct(req: Request, res: Response): Promise<void> {
		try {
			const { productId } = req.params;
			const product = await Product.findOne({ productId });

			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}

			res.status(200).json(product);
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error fetching product", error });
		}
	}

	public async updateProduct(req: Request, res: Response): Promise<void> {
		try {
			const { productId } = req.params;
			const updateData = req.body;

			// Prevent updating certain fields
			delete updateData.productId;
			delete updateData.rating;
			delete updateData.soldStockValue;

			const product = await Product.findOneAndUpdate(
				{ productId },
				updateData,
				{ new: true }
			);

			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}

			res.status(200).json(product);
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error updating product", error });
		}
	}

	public async deleteProduct(req: Request, res: Response): Promise<void> {
		try {
			const { productId } = req.params;
			const product = await Product.findOneAndDelete({ productId });

			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}

			res
				.status(200)
				.json({ status: false, message: "Product deleted successfully" });
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error deleting product", error });
		}
	}

	public async updateStock(req: Request, res: Response): Promise<void> {
		try {
			const { productId } = req.params;
			const { inStockValue } = req.body;

			const product = await Product.findOneAndUpdate(
				{ productId },
				{ inStockValue },
				{ new: true }
			);

			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}

			res.status(200).json(product);
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error updating stock", error });
		}
	}

	public async updateVisibility(req: Request, res: Response): Promise<void> {
		try {
			const { productId } = req.params;
			const { visibility } = req.body;

			const product = await Product.findOneAndUpdate(
				{ productId },
				{ visibility },
				{ new: true }
			);

			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}

			res.status(200).json(product);
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error updating visibility", error });
		}
	}

	public async searchProducts(req: Request, res: Response): Promise<void> {
		try {
			const { query } = req.query;
			if (!query) {
				res
					.status(400)
					.json({ status: false, message: "Search query is required" });
				return;
			}

			const products = await Product.find({
				$or: [
					{ name: { $regex: query, $options: "i" } },
					{ description: { $regex: query, $options: "i" } },
					{ category: { $regex: query, $options: "i" } },
				],
				visibility: "on",
			});

			res.status(200).json(products);
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error searching products", error });
		}
	}
}
