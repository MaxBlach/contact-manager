import z from "zod";
import { IContact } from "../types";

//back-end validation
interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof IContact, string>>;
}

export const validateContact = (contact: IContact): ValidationResult => {
    const errors: Partial<Record<keyof IContact, string>> = {};

    // Civility check
    if (!['M.', 'Mme.'].includes(contact.civility)) {
        errors.civility = "Civility must be 'M.' or 'Mme.'";
    }

    // Name and firstname: letters, accented characters, and optional hyphens
    const nameRegex = /^[A-Za-zÀ-ÿ\-'\s]+$/;
    if (!nameRegex.test(contact.name)) {
        errors.name = "Name contains invalid characters";
    }
    if (!nameRegex.test(contact.firstName)) {
        errors.firstName = "Firstname contains invalid characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
        errors.email = "Invalid email format";
    }

    // Phone number: accept various formats, but digits only and length 10–15
    const phoneRegex = /^\+?[0-9\s\-().]{10,20}$/;
    if (!phoneRegex.test(contact.phoneNumber)) {
        errors.phoneNumber = "Invalid phone number format";
    }

    // Nationality: allow letters, spaces, and accented characters
    const nationalityRegex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    if (!nationalityRegex.test(contact.nationality)) {
        errors.nationality = "Nationality contains invalid characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

//front-end validation
export const contactSchema = z.object({
    civility: z.enum(["M.","Mme."]),
    name: z.string().trim().regex(/^[A-Za-zÀ-ÿ\-'\s]+$/),
    firstName: z.string().trim().regex(/^[A-Za-zÀ-ÿ\-'\s]+$/),
    email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    phoneNumber: z.string().trim().regex(/^\+?[0-9\s\-().]{10,20}$/),
    nationality: z.string().trim().regex(/^[A-Za-zÀ-ÿ\s\-']+$/)
});

export type ContactFormValues = z.infer<typeof contactSchema>;