import z from "zod";

//back-end validation
interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof IContact, string>>;
}

export const validateContact = (contact: IContact): ValidationResult => {
    const errors: Partial<Record<keyof IContact, string>> = {};

    // Civility check
    if (!['M.', 'Mme.'].includes(contact.civility)) {
        errors.civility = "La civilité doit être soit M. soit Mme.";
    }

    // Name and firstname: letters, accented characters, and optional hyphens
    const nameRegex = /^[A-Za-zÀ-ÿ\-'\s]+$/;
    if (!nameRegex.test(contact.name)) {
        errors.name = "Le nom contient un caractère invalide";
    }
    if (!nameRegex.test(contact.firstName)) {
        errors.firstName = "Le prénom contient un caractère invalide";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
        errors.email = "Le format de l'email est incorrect";
    }

    // Phone number: accept various formats, but digits only and length 10–15
    const phoneRegex = /^\+?[0-9\s\-().]{10,20}$/;
    if (!phoneRegex.test(contact.phoneNumber)) {
        errors.phoneNumber = "Le format du numéro de téléphone est incorrect";
    }

    // Nationality: allow letters, spaces, and accented characters
    const nationalityRegex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    if (!nationalityRegex.test(contact.nationality)) {
        errors.nationality = "La nationalité contient un caractère invalide";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

//front-end validation
export const contactSchema = z.object({
    id: z.string().optional(),
    civility: z.enum(["M.","Mme."]),
    name: z.string().min(1, { message: "Le nom est requis." }).trim().regex(/^[A-Za-zÀ-ÿ\-'\s]+$/,{ message: "Le nom contient un caractère invalide"}),
    firstName: z.string().min(1, { message: "Le prénom est requis." }).trim().regex(/^[A-Za-zÀ-ÿ\-'\s]+$/,{ message: "Le prénom contient un caractère invalide"}),
    email: z.string().min(1, { message: "Le mail est requis." }).trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,{ message: "Le format de numéro de téléphone est invalide"}),
    phoneNumber: z.string().min(1, { message: "Le numéro de téléphone est requis." }).trim().regex(/^\+?[0-9\s\-().]{10,20}$/,{ message: "Le format de numéro de téléphone est invalide"}),
    nationality: z.string().min(1, { message: "La nationalité est obligatoire"}).trim().regex(/^[A-Za-zÀ-ÿ\s\-']+$/)
});

export type IContact = z.infer<typeof contactSchema>;