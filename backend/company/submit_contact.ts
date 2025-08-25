import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface SubmitContactRequest {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export interface SubmitContactResponse {
  success: boolean;
  message: string;
}

// Submits a contact form.
export const submitContact = api<SubmitContactRequest, SubmitContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    await companyDB.exec`
      INSERT INTO contact_submissions (name, email, phone, service_type, message)
      VALUES (${req.name}, ${req.email}, ${req.phone}, ${req.serviceType}, ${req.message})
    `;

    return {
      success: true,
      message: "Terima kasih! Pesan Anda telah diterima. Tim kami akan menghubungi Anda segera."
    };
  }
);
