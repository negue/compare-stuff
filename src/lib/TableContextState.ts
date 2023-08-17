import { type Writable, writable } from "svelte/store";
import type { Orderable, TableColumn, TableContext } from "./TableContext";
import {maxBy, sortBy} from 'remeda'
import { nanoid } from "nanoid";

export interface TableContextState extends Writable<TableContext> {
  addColumn: (columnLabel?:string) => void;
  addColumnBeforeAfter: (columnId: string, before: boolean) => void;
  removeColumn: (columnId: string) => void;
  editColumn: (columnId: string, updates: Partial<TableColumn>) => void;

  removeRow: (rowId: string) => void;
  addRow: (rowLabel?:string) => void;
  addRowBeforeAfter: (rowId: string, before: boolean) => void;

  editRow: (rowId: string, newLabel: string) => void;
}

// maybe there are smarter ways, open a PR if you have one xD
function reorderListAfterNonIntegerOrder (list: Orderable[]) {
  let currentOrder = 0;
  let nonIntegerFound = false;
  for (const orderable of sortBy(list, e => e.order)) {
    if (Number.isInteger(orderable.order) && !nonIntegerFound) {
      currentOrder = orderable.order;
    } else {
      nonIntegerFound = true;
      orderable.order = ++currentOrder;
    }
  }
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
    addColumnBeforeAfter: (columnId:string, before: boolean) => update(value => {
      const currentColumn: TableColumn = value.columns.find(c => c.id === columnId);

      value.columns.push({
        order: currentColumn.order + (before ? -0.5 : 0.5),
        id: nanoid(),
        label: `Column`
      })

      reorderListAfterNonIntegerOrder(value.columns);

      return value;
    }),
    editColumn: (columnId: string, updates: Partial<TableColumn>) => update(value => {
      const column = value.columns.find(column => column.id === columnId)

      Object.assign(column, updates);

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

    addRowBeforeAfter: (rowId, before) => update(value => {
      const currentRow = value.rows.find(r => r.id === rowId);

      value.rows.push({
        order: currentRow.order  + (before ? -0.5 : 0.5),
        id: nanoid(),
        label: `Row`
      })

      reorderListAfterNonIntegerOrder(value.rows);

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
