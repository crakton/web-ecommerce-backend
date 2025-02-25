import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import { IUser } from "../types/interfaces";
import UserModel from "../models/user.model";

dotenv.config();

export class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_SERVER,
			port: parseInt(process.env.EMAIL_PORT || "465"),
			secure: process.env.EMAIL_SECURE === "true" || false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
	}

	public async sendEmailToAllUsers(
		subject: string,
		message: string
	): Promise<void> {
		try {
			// Fetch all user emails from MongoDB
			const users: IUser[] = await UserModel.find({}, "email");
			const emailAddresses: string[] = users.map((user) => user.email);

			if (emailAddresses.length === 0) {
				console.log("No email addresses found.");
				return;
			}

			await this.transporter.sendMail({
				from: "Mera Bestie",
				to: emailAddresses.join(","),
				subject: subject,
				text: message,
			});

			console.log(
				`Emails successfully sent to ${emailAddresses.length} users.`
			);
		} catch (error) {
			console.error("Error sending emails:", error);
		}
	}

	public async sendComplaintConfirmationEmail(
		email: string,
		complaintNumber: string,
		message: string
	): Promise<any> {
		try {
			const mailOptions = {
				from: '"Mera Bestie" <pecommerce8@gmail.com>',
				to: email,
				subject: "Complaint Registration Confirmation",
				html: `
          <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #ffffff;">
            <!-- Stylish Header -->
            <div style="background-color: #ffb6c1; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="font-family: 'Brush Script MT', cursive; color: #ffffff; font-size: 36px; margin: 0;">Mera Bestie</h1>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 20px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Complaint Registration Confirmation</h2>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Complaint ID:</strong> ${complaintNumber}</p>
                <p style="margin: 10px 0;"><strong>Issue Description:</strong></p>
                <p style="margin: 10px 0; font-style: italic; color: #555;">${message}</p>
              </div>
              <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                Thank you for reaching out to us! Our experienced specialists are already working on resolving your issue. You can expect a detailed reply to your query within 24 hours. We appreciate your patience and understanding.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #95a5a6; font-size: 12px; line-height: 1.4;">
                This is an automated email. Please do not reply to this message.<br>
                If you have any additional questions, feel free to contact our support team.
              </p>
            </div>
          </div>
        `,
				text: `
          Mera Bestie

          Complaint Registration Confirmation

          Complaint ID: ${complaintNumber}

          Issue Description:
          ${message}

          Thank you for reaching out to us! Our experienced specialists are already working on resolving your issue. You can expect a detailed reply to your query within 24 hours. We appreciate your patience and understanding.

          This is an automated email. Please do not reply to this message.
          If you have any additional questions, feel free to contact our support team.
        `,
			};

			const info = await this.transporter.sendMail(mailOptions);
			console.log("Confirmation email sent successfully:", info.response);
			return info;
		} catch (error) {
			console.error("Error sending confirmation email:", error);
			throw error;
		}
	}
}
