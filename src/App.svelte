<script lang="ts">
  import Table from "./lib/Table.svelte";
  import { createTableContextState } from "./lib/TableContextState";
  import {
    addEntry,
    type CompareStuffEntry,
    getEntryTable,
    listOfCompareStuff,
    updateEntryLabel,
    updateEntryTable
  } from "./lib/LocalState";
  import LabelEditable from "./lib/LabelEditable.svelte";
  import { nanoid } from "nanoid";

  let currentSelected: CompareStuffEntry|null = null;
  let ignoreUpdate = false;

  const exampleTableState = createTableContextState();

  async function selectCurrentCompare(entry: CompareStuffEntry) {
    currentSelected = entry;

    ignoreUpdate=true;
    const data = await getEntryTable(entry.id);
    exampleTableState.set(data);
    ignoreUpdate = false;
  }

  async function addNew(){
    const entry = {
      id: nanoid(),
      label: 'New Comparison',
      version: 1
    }

    await addEntry(entry, {
      cells: {},
      rows: [],
      columns: []
    });

    selectCurrentCompare(entry);
  }

  exampleTableState.subscribe(value => {
    if (ignoreUpdate || !currentSelected){
       return;
    }

    updateEntryTable(currentSelected.id, value);
  })

</script>

<main>
  <div>
    Sidebar <br>

    <ul>
      {#each $listOfCompareStuff as compareStuff}
        <li on:click={() => selectCurrentCompare(compareStuff)}>
          {compareStuff.label}
        </li>
        {/each}
    </ul>

    <button on:click={addNew}>Add new</button>
  </div>
  {#if currentSelected}
  <div>
    <h2>
      <LabelEditable data={currentSelected.label}
                     on:update={(newData) => {updateEntryLabel(currentSelected.id, newData.detail)}} />
    </h2>

    <Table tableContextState={exampleTableState}></Table>

  </div>
    {/if}

</main>
