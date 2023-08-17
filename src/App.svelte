<script lang="ts">
  import Table from "./lib/Table.svelte";
  import {
   updateEntryEmoji,
    updateEntryLabel,
  } from "./lib/LocalState";
  import LabelEditable from "./lib/LabelEditable.svelte";
  import { SvelteUIProvider } from "@svelteuidev/core";
  import Sidebar from "./lib/Sidebar.svelte";
  import { currentSelected, exampleTableState } from "./lib/state";
  import EmojiPicker from "./lib/EmojiPicker.svelte";
</script>

<SvelteUIProvider withGlobalStyles themeObserver={'dark'}>

<Sidebar></Sidebar>

<main>
<div class="header">
  {#if $currentSelected}

    <h2>
      <EmojiPicker selectedEmoji={$currentSelected.emoji}
                   on:update={(newData) => {updateEntryEmoji($currentSelected.id, newData.detail)}}></EmojiPicker>

      <LabelEditable data={$currentSelected.label} inlineBlock={true}
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
