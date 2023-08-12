export interface Orderable {

  order: number;
}

export interface TableColumn extends Orderable{
  id: string;
  label: string
}

export interface TableRow extends Orderable{
  id: string;
  label: string
}


export interface TableContext {
  columns: TableColumn[];
  rows: TableRow[];
  cells: {
    [key: string /** combined of row_id+column_id */ ]: string
  }
}

