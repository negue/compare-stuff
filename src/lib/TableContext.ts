export interface TableContext {
  columns: {
    id: string;
    order: number;
    label: string
  }[];
  rows: {
    id: string;
    order: number;
    label: string
  }[];
  cells: {
    [key: string /** combined of row_id+column_id */ ]: string
  }
}

