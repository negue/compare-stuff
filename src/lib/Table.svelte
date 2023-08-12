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
        <td></td>
        {#each columns as column (column.id)}
        <th on:pointerenter={() => {currentHighlightedColumn = column.id}}
            class:isHovered={column.id === currentHighlightedColumn}>
            <LabelEditable data={column.label}
                           on:update={(newData) => {tableContextState.editColumn(column.id, newData.detail)}} />
        </th>
        {/each}
        <td>
            <button on:click={() => tableContextState.addColumn()}>New Column</button>
        </td>
    </tr>

    {#each rows as row (row.id)}

    <tr>
        <td>
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
    tr {
      &:hover {
        background: #ffffff47;
      }
    }

    .isHovered {
      background: #ffffff47;
    }
</style>
