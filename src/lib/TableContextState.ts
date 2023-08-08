import { type Writable, writable } from "svelte/store";
import type { TableContext } from "./TableContext";
import {maxBy} from 'remeda'
import { nanoid } from "nanoid";

export interface TableContextState extends Writable<TableContext> {
  addColumn: (columnLabel?:string) => void;
  removeColumn: (columnId: string) => void;
  editColumn: (columnId: string, newLabel: string) => void;

  removeRow: (rowId: string) => void;
  addRow: (rowLabel?:string) => void;

  editRow: (rowId: string, newLabel: string) => void;
}

export function createTableContextState(tableContext?: TableContext): TableContextState {
  const { subscribe, set, update } = writable<TableContext>(tableContext ?? {
    columns: [],
    rows: [],
    cells: {}
  });

  return {
    subscribe,
    set,
    update,
    addColumn: (columnLabel?:string) => update(value => {
      const highestOrder = maxBy(value.columns, item => item.order)?.order ?? 0;

      value.columns.push({
        order:highestOrder +1,
        id: nanoid(),
        label: columnLabel?? `Column ${highestOrder+1}`
      })

      return value;
    }),
    editColumn: (columnId: string, newLabel: string) => update(value => {
      const column = value.columns.find(column => column.id === columnId)

      column.label = newLabel;

      return value;
    }),
    removeColumn: (columnId: string) => update(value => {
      const indexOf = value.columns.findIndex(column => column.id === columnId)

      value.columns.splice(indexOf, 1)

      return value;
    }),

    addRow: (rowLabel?:string) => update(value => {
      const highestOrder = maxBy(value.rows, item => item.order)?.order ?? 0;

      value.rows.push({
        order:highestOrder +1,
        id: nanoid(),
        label: rowLabel??`Row ${highestOrder+1}`
      })

      return value;
    }),

    removeRow: (rowId: string) => update(value => {
      const indexOf = value.rows.findIndex(column => column.id === rowId)

      value.rows.splice(indexOf, 1)

      return value;
    }),

    editRow: (rowId: string, newLabel: string) => update(value => {
      const row = value.rows.find(row => row.id === rowId)

      row.label = newLabel;

      return value;
    }),
  };
}
