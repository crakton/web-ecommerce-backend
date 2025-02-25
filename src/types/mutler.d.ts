// This file is needed to extend the Express Request interface with Multer's file property

import { Express } from "express-serve-static-core";

declare global {
	namespace Express {
		interface Request {
			file?: Multer.File;
			files?:
				| {
						[fieldname: string]: Multer.File[];
				  }
				| Multer.File[];
		}
	}
}
