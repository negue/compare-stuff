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
  import { SvelteUIProvider } from "@svelteuidev/core";
  import Sidebar from "./lib/Sidebar.svelte";
  import { currentSelected, exampleTableState } from "./lib/state";



</script>

<SvelteUIProvider withGlobalStyles themeObserver={'dark'}>

<Sidebar></Sidebar>

<main>
<div class="header">
  {#if $currentSelected}

    <h2>
      <LabelEditable data={$currentSelected.label}
                     on:update={(newData) => {updateEntryLabel($currentSelected.id, newData.detail)}} />
    </h2>

  {/if}
</div>
  <div class="overflow">
  {#if $currentSelected}


    <Table tableContextState={exampleTableState}></Table>

    {/if}
  </div>
</main>

</SvelteUIProvider>

<style lang="scss">




  main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100vh;
    flex: 1;
  }

  .overflow {
    overflow: auto;
    flex: 1;
  }

</style>
