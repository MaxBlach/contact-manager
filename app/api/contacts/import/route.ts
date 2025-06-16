import { createContact, handleRouteError } from "@/lib/contacts/helpers";
import { IContact } from "@/lib/validators/contact";

type ColumnMapping = {
    [key in keyof IContact]: number;
  };
  
const REQUIRED_COLUMNS = [
"civility",
"name",
"firstName",
"email",
"phoneNumber",
"nationality"
]

const detectColumnOrder = (headerRow: string): ColumnMapping | null => {
    const headers = headerRow.split(',').map(h => h.trim());
    
    // Check if all required columns are present
    const missingColumns = REQUIRED_COLUMNS.filter(
      col => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      throw new Error(`Colonnes manquantes: ${missingColumns.join(', ')}`);
    }

    // Create mapping of column names to their positions
    const mapping: ColumnMapping = headers.reduce((acc, header, index) => {
      acc[header as keyof IContact] = index;
      return acc;
    }, {} as ColumnMapping);


    return mapping;
  };

export async function POST(request: Request) {
    try {
        const { csv } = await request.json();

        const rows = csv.split('\n').filter((row: string) => row.trim()); // Remove empty lines
        
        if (rows.length < 2) {
          throw new Error('Le fichier CSV doit contenir au moins une ligne d\'en-tête et une ligne de données');
        }

        // Detect column order from header
        const columnMapping = detectColumnOrder(rows[0]);
        if (!columnMapping) {
          throw new Error('Format de colonnes invalide');
        }

        // Process data rows
        const contacts: IContact[] = [];
        rows.slice(1).forEach((row: string) => {
          const fields = row.split(',').map((field: string) => field.trim());
          
          const contact: IContact = {
            civility: fields[columnMapping.civility] as "M." | "Mme.",
            name: fields[columnMapping.name],
            firstName: fields[columnMapping.firstName],
            email: fields[columnMapping.email],
            phoneNumber: fields[columnMapping.phoneNumber],
            nationality: fields[columnMapping.nationality].toUpperCase()
          };

            contacts.push(contact);
        });

        if (contacts.length === 0) {
          throw new Error('Aucun contact valide trouvé dans le fichier');
        }

        console.log('Processed contacts:', contacts);
        
        if (!Array.isArray(contacts)) {
            return Response.json(
                { error: "Invalid payload: contacts must be an array" },
                { status: 400 }
            );
        }

        // this works with a real db but since we are using a json file, we need to use a different approach because it can not write at the same time
        // const results = await Promise.allSettled(
        //     contacts.map(contact => createContact(contact))
        // );

        let successful = 0;
        let failed = 0;
        const errors: any[] = [];

        for (const contact of contacts) {
            try {
                await createContact(contact);
                successful++;
            } catch (error) {
                failed++;
                errors.push(error);
            }
        }

        return Response.json({
            success: true,
            imported: successful,
            failed: failed,
            data: contacts,
            errors: errors
        }, { status: 200 });

    } catch (e: unknown) {
        return handleRouteError(e);
    }
} 