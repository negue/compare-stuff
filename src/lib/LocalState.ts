import { type TableContext } from "./TableContext";
import * as localforage from "localforage";
import { writable } from "svelte/store";

const localforageReady = localforage.ready();

export interface CompareStuffEntry {
  id: string;
  version: number;
  label: string;
  emoji: string;
}

export const listOfCompareStuff = writable<CompareStuffEntry[]>([])

const compareStuffPrefix = 'compareStuff/';
const entriesKey = `${compareStuffPrefix}entries`;

export async function listEntries(): Promise<CompareStuffEntry[]>{
  await localforageReady;

  const entries = await localforage.getItem<CompareStuffEntry[]>(entriesKey) ?? [];

  return entries;
}

listEntries().then(entries => listOfCompareStuff.set(entries));

function saveEntries(entries: CompareStuffEntry[]){
  listOfCompareStuff.set(entries)


  localforage.setItem(entriesKey, entries);
}

export async function updateEntryLabel(entryId: string, newLabel: string) {
  const entries = await listEntries();

  var compareStuffEntry = entries.find(e => e.id === entryId);
  compareStuffEntry.label = newLabel;


  saveEntries(entries);
}

export async function updateEntryEmoji(entryId: string, newEmoji: string) {
  const entries = await listEntries();

  var compareStuffEntry = entries.find(e => e.id === entryId);
  compareStuffEntry.emoji = newEmoji;


  saveEntries(entries);
}


export async function getEntryTable(entryId: string): Promise<TableContext> {
  await localforage.ready()

  const tableContext = await localforage.getItem<TableContext>(entriesKey+'/'+entryId)

  return tableContext;
}


export async function updateEntryTable(entryId: string, tableContext: TableContext) {
  localforage.setItem(entriesKey+'/'+entryId, tableContext);
}


export async function addEntry(entry: CompareStuffEntry, tableContext: TableContext){
  const entries = await listEntries();

  entries.push(entry);

  saveEntries(entries);
  localforage.setItem(entriesKey+'/'+entry.id, tableContext);
}
