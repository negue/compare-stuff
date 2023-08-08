<script lang="ts">
    import * as R from 'remeda'
    import type { TableContextState } from "./TableContextState";
    import LabelEditable from "./LabelEditable.svelte";

    export let tableContextState: TableContextState;

    // https://stackoverflow.com/a/66490611

    $: columns = R.sortBy($tableContextState.columns, c => c.order);
    $: rows = R.sortBy($tableContextState.rows, r => r.order);
</script>

<table>
    <tr>
        <td></td>
        {#each columns as column (column.id)}
        <th>
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
            <td>
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

