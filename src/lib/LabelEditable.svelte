<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let data: string;

    const dispatch = createEventDispatcher();

    function onInput(ev: InputEvent) {
      data = (ev.target as HTMLDivElement).innerText;

      dispatch('update', data);
    }
</script>


<div contenteditable="true" on:input={onInput}>{data ?? ''}</div>
