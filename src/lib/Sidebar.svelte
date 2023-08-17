<script lang="ts">
  import { addEntry, type CompareStuffEntry, getEntryTable, listOfCompareStuff } from "./LocalState";
  import { currentSelected, exampleTableState, ignoreUpdate } from "./state";
  import { nanoid } from "nanoid";


  async function addNew() {
    const entry = {
      id: nanoid(),
      label: 'New Comparison',
      version: 1,
      emoji: '😉'
    }

    await addEntry(entry, {
      cells: {},
      rows: [],
      columns: []
    });

    selectCurrentCompare(entry);
  }

  async function selectCurrentCompare(entry: CompareStuffEntry) {
    $currentSelected = entry;

    $ignoreUpdate = true;
    const data = await getEntryTable(entry.id);
    exampleTableState.set(data);
    $ignoreUpdate = false;
  }
</script>
<div class="sidebar">
    Comparisons <br>

    <ul>
        {#each $listOfCompareStuff as compareStuff}
            <li on:click={() => selectCurrentCompare(compareStuff)}
                class:isActive={compareStuff.id === $currentSelected?.id}>
                {compareStuff.emoji} {compareStuff.label}
            </li>
        {/each}
    </ul>

    <button on:click={addNew}>Add new</button>

    <div class="animate_">

    </div>
</div>


<style lang="scss">
  .sidebar {
    background: #2a2a2a;
    min-width: 200px;

    ul {
      list-style-type: none;
      margin: 1rem 0 1rem;
      padding: 0;

      li {
        text-align: start;
        cursor: pointer;
        padding-left: 0.5rem;
        padding-right: 0.5rem;

        &:hover, &.isActive {
          background: #ffffff47;
        }
      }
    }
  }


  // to check if the main thread is not wasted by other stuff ^^
  div.animate {
    /* animation properties */
    animation-name: my-animation;
    animation-duration: 2s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    /* other properties */
    width: 300px;
    height: 100px;
    border-radius: 10px;

    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;

  }

  @keyframes my-animation {
    from {
      background-color: #ff7a59;
      width: 150px;
      top: 10px;
    }
    to {
      background-color: #33475b;
      width: 50px;
      top: 100px;
    }
  }
</style>
