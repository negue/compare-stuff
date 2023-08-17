<script lang="ts">
    import * as R from 'remeda'
    import type { TableContextState } from "./TableContextState";
    import LabelEditable from "./LabelEditable.svelte";
    import { ActionIcon, Divider, Menu } from '@svelteuidev/core';
    import { Trash, DragHandleDots2, PinLeft, PinRight, PinTop, PinBottom, Plus } from 'radix-icons-svelte';

    export let tableContextState: TableContextState;

    let currentHighlightedColumn: string| null = null;


    // https://stackoverflow.com/a/66490611

    $: columns = R.sortBy($tableContextState.columns, c => c.order);
    $: rows = R.sortBy($tableContextState.rows, r => r.order);

    function askRemoveColumn(columnId: string) {
      if (window.confirm('Do you want to remove this column?')) {
        tableContextState.removeColumn(columnId);
      }
    }

    function askRemoveRow(rowId: string) {
      if (window.confirm('Do you want to remove this row?')) {
        tableContextState.removeRow(rowId);
      }
    }

    type MenuType = typeof Menu["prototype"]
    const menuWeakMap = new WeakMap<String, MenuType>();

    let currentOpenedMenuOnRowId: string = '';
    let lastOpenedMenu: MenuType;

    function onAnyMenuOpen(menu: MenuType) {
      if (lastOpenedMenu?.close) {
        lastOpenedMenu.close();
        lastOpenedMenu = null;
      }

      lastOpenedMenu = menu;
    }

    function onOpenRowMenu(menu: MenuType, rowId: string){
       onAnyMenuOpen(menu);

       currentOpenedMenuOnRowId = rowId;
    }

</script>
<table on:pointerleave={() => currentHighlightedColumn = null}>
    <tr>
        <th>&nbsp;</th>
        {#each columns as column (column.id)}
        <th on:pointerenter={() => {currentHighlightedColumn = column.id}}
            class:isHovered={column.id === currentHighlightedColumn}>

            <div class="cell-with-menu">
            <Menu bind:this={menuWeakMap[column.id]}
                  on:open={() => onAnyMenuOpen(menuWeakMap[column.id])}>
                <ActionIcon slot="control" color="white">
                    <DragHandleDots2 />
                </ActionIcon>

                <Menu.Label>New Column</Menu.Label>
                <Menu.Item icon={PinLeft}
                           on:click={() => tableContextState.addColumnBeforeAfter(column.id, true)}>Left</Menu.Item>
                <Menu.Item icon={PinRight} on:click={() => tableContextState.addColumnBeforeAfter(column.id, false)}>Right</Menu.Item>

                <Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item color="red" icon={Trash}
                           on:click={() => askRemoveColumn(column.id)}
                            >Remove</Menu.Item>
            </Menu>

            <LabelEditable data={column.label}
                           on:update={(newData) => {tableContextState.editColumn(column.id, newData.detail)}} />
            </div>
        </th>
        {/each}
        <th>
            <ActionIcon color="white" on:click={() => tableContextState.addColumn()}>
                <Plus />
            </ActionIcon>
        </th>
    </tr>

    {#each rows as row (row.id)}

    <tr>
        <td on:pointerenter={() => {currentHighlightedColumn = null}}
            style:z-index={currentOpenedMenuOnRowId === row.id ? 10 :1}>
            <div class="cell-with-menu">
                <Menu bind:this={menuWeakMap[row.id]}
                      on:open={() => onOpenRowMenu(menuWeakMap[row.id], row.id)}>
                    <ActionIcon slot="control" color="white">
                        <DragHandleDots2 />
                    </ActionIcon>

                    <Menu.Label>New Row</Menu.Label>
                    <Menu.Item icon={PinTop}
                               on:click={() => tableContextState.addRowBeforeAfter(row.id, true)}>Above</Menu.Item>
                    <Menu.Item icon={PinBottom} on:click={() => tableContextState.addRowBeforeAfter(row.id, false)}>Below</Menu.Item>

                    <Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item color="red" icon={Trash}
                               on:click={() => askRemoveRow(row.id)}
                    >Remove</Menu.Item>
                </Menu>

                <LabelEditable data={row.label}
                               on:update={(newData) => tableContextState.editRow(row.id, newData.detail)} />

             </div>

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
        <td>
            <ActionIcon color="white" on:click={() => tableContextState.addRow()}>
                <Plus />
            </ActionIcon>
        </td>
    </tr>
</table>

<style lang="scss">
  table {
    table-layout: fixed;
    background: var(--app-background)
  }

  .cell-with-menu {
    display: inline-flex;
    flex-direction: row;
    width: 100%;

    &:not(:hover) {

      :global(.svelteui-Menu-root) {
        // opacity: 0;
      }
    }

    :global(.svelteui-Menu-root) {
      white-space: normal;
    }
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
        white-space: nowrap;

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
