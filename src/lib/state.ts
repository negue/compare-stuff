import { writable, get } from "svelte/store";
import { addEntry, type CompareStuffEntry, updateEntryTable } from "./LocalState";
import { createTableContextState } from "./TableContextState";
import { nanoid } from "nanoid";

export const currentSelected = writable<CompareStuffEntry|null>(null);

export const ignoreUpdate = writable(false);

export const exampleTableState = createTableContextState();



exampleTableState.subscribe(value => {
  if (ignoreUpdate || !get(currentSelected)){
    return;
  }

  updateEntryTable(get(currentSelected).id, value);
})
