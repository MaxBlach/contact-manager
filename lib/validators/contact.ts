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
    name: z.string().min(1, { message: "Le nom est requis." }).trim().regex(/^[A-Za-zÀ-ÿ\-'\s]+$/,{ message: "Le nom contient un caractère invalide"}),
    firstName: z.string().min(1, { message: "Le prénom est requis." }).trim().regex(/^[A-Za-zÀ-ÿ\-'\s]+$/,{ message: "Le prénom contient un caractère invalide"}),
    email: z.string().min(1, { message: "Le mail est requis." }).trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{ message: "Le mail contient un caractère invalide"}),
    phoneNumber: z.string().min(1, { message: "Le numéro de téléphone est requis." }).trim().regex(/^\+?[0-9\s\-().]{10,20}$/,{ message: "Le format de numéro de téléphone est invalide"}),
    nationality: z.string().min(1, { message: "La nationalité est obligatoire"}).trim().regex(/^[A-Za-zÀ-ÿ\s\-']+$/)
});

export type ContactFormValues = z.infer<typeof contactSchema>;