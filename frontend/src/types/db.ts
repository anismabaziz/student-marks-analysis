export interface Mapping {
  id: string;
  table_id: string;
  db_name: string;
  name: string;
}
export interface Table {
  id: string;
  db_name: string;
  name: string;
  valid: boolean;
}
