<script lang="ts">
    import * as R from 'remeda'
    import type { TableContextState } from "./TableContextState";
    import LabelEditable from "./LabelEditable.svelte";

    export let tableContextState: TableContextState;

    let currentHighlightedColumn: string| null = null;

    // https://stackoverflow.com/a/66490611

    $: columns = R.sortBy($tableContextState.columns, c => c.order);
    $: rows = R.sortBy($tableContextState.rows, r => r.order);
</script>
<table on:pointerleave={() => currentHighlightedColumn = null}>
    <tr>
        <th>&nbsp;</th>
        {#each columns as column (column.id)}
        <th on:pointerenter={() => {currentHighlightedColumn = column.id}}
            class:isHovered={column.id === currentHighlightedColumn}>
            <LabelEditable data={column.label}
                           on:update={(newData) => {tableContextState.editColumn(column.id, newData.detail)}} />
        </th>
        {/each}
        <th>
            <button on:click={() => tableContextState.addColumn()}>New Column</button>
        </th>
    </tr>

    {#each rows as row (row.id)}

    <tr>
        <td on:pointerenter={() => {currentHighlightedColumn = null}}>
            <LabelEditable data={row.label}
                           on:update={(newData) => tableContextState.editRow(row.id, newData.detail)} />
        </td>
        {#each columns as column (`${row.id}_${column.id}`)}
            <td on:pointerenter={() => {currentHighlightedColumn = column.id}}
                class:isHovered={column.id === currentHighlightedColumn}>
                <LabelEditable bind:data={$tableContextState.cells[`${row.id}_${column.id}`]}></LabelEditable>
            </td>
        {/each}
    </tr>

    {/each}

    <tr>
        <td colspan={$tableContextState.columns.length+1}>

            <button on:click={() => tableContextState.addRow()}>New Row</button>
        </td>
    </tr>
</table>

<style lang="scss">
  table {
    table-layout: fixed;
    background: var(--app-background)
  }

  table, th, td {
    border-collapse: collapse;
  }

    tr {
      th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--app-background);

        &:first-child {
          z-index: 3;
          top: 0;
          left: 0;
        }
      }



      td:first-child {
        position: sticky;
        left: 0;
        z-index: 1;
        background: var(--app-background)
      }

      &:hover {
        background: #ffffff47;

        td:first-child {
          background: #616161;
        }
      }
    }

    .isHovered {
      background: #ffffff47;
    }
    th.isHovered {

      background: #616161;
    }
</style>
