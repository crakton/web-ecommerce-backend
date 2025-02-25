import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/interfaces";
import { model } from "mongoose";

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	userId: { type: String, required: true, unique: true },
	accountStatus: { type: String, default: "open" },
	phone: { type: String, default: "not available" },
});

UserSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
