import { ColumnDef } from "@tanstack/react-table";
import { Mapping } from "@/types/db";

export const generateColumns = (
  mappings: Mapping[]
): ColumnDef<unknown, unknown>[] => {
  return mappings.map((mapping) => ({
    accessorKey: mapping.db_name,
    header: mapping.name,
  }));
};
