import { ColumnDef } from "@tanstack/react-table";

export const generateColumns = (
  mappings: { id: string; db_name: string; name: string }[]
): ColumnDef<unknown, unknown>[] => {
  return mappings.map((mapping) => ({
    accessorKey: mapping.db_name,
    header: mapping.name,
  }));
};
