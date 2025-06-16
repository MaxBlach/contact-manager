import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

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
      if(importErrors.length > 0) toast.error(`${importErrors.length} contacts non importés !`);
      if(imported === 0 && importErrors.length === 0) toast.error('Aucun contact importé');
      if(imported > 0) toast.success(`${imported} contacts importés avec succès !`);
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