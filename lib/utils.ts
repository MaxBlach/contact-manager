import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

//setup default message for http code
const errorCodes: Record<number, string[]> = {
  400: ["invalid payload"],
  404: ["not found"]
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const text = e.target?.result as string;
      // Send csv to the API
      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csv:text }),
      });

      if (!response.ok) {
        throw new Error('Failed to import contacts');
      }

      const { imported, errors: importErrors } = await response.json();
      console.log(imported, importErrors);
      //  10 [] but the toast is not showing
      if(imported === 0 && importErrors.length >= 0) {
        toast.error('Aucun contact importé');
      }else if(importErrors.length > 0) {
        toast.error(`${importErrors.length} contacts non importés !`);
      }
      
      if(imported > 0) {
        toast.success(`${imported} contacts importés avec succès !`);
      }

    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'importation des contacts');
    }
  };

  reader.onerror = () => {
    toast.error('Erreur lors de la lecture du fichier');
  };

  reader.readAsText(file);
};

export class ValidationError extends Error {
  public errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

//if a known message is passed with e, return the correspondant status
export const handleRouteError = (e: unknown) => {
  let message = "Internal server error";
  let status = 500;
  let errors: Record<string, string> | undefined;


  if (e instanceof ValidationError) {
    message = e.message;
    errors = e.errors;
    status = 400;
  } else if (e instanceof Error) {
    message = e.message;

    Object.entries(errorCodes).forEach(([errorCode, knownMessages]) => {
      if (knownMessages.some(err => message.includes(err))) {
        status = Number(errorCode);
      }
    });
  }

  return Response.json({ error: message, errors }, { status });
};