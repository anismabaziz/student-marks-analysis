import { ColumnDef } from "@tanstack/react-table";

export type StudentData = {
  name: string;
  code: string;
  phy1: number;
  moyenne_a: number;
  credit_a: number;
  algebre1: number;
  analyse1: number;
  moyenne_b: number;
  credit_b: number;
  asd1: number;
  sm1: number;
  moyenne_c: number;
  credit_c: number;
  le1: number;
  est: number;
  moyenne_d: number;
  credit_d: number;
  semestre_credit: number;
  moyenne_semestre: number;
  section: number;
};

export const columns: ColumnDef<StudentData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "moyenne_semestre",
    header: "Moyenne Semestre",
  },
];
