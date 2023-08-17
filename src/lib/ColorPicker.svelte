<script context="module">
  import 'vanilla-colorful/hex-alpha-color-picker.js';
</script>
<script lang="ts">
  import { Button, Box, Popper, Text } from '@svelteuidev/core';
  import { clickoutside, useDebounce } from '@svelteuidev/composables';
  import { createEventDispatcher } from "svelte";

  // maybe create the instance across components?
  let popupPointerReference: HTMLElement;

  export let emptyText = 'Choose';
  export let color = undefined;

  let mounted = false;
  // on opening it calls the function already, but thats the first popup open
  // so this can be ignored
  let clickCounter = 0;

  const dispatch = createEventDispatcher();


  const onColorPick = useDebounce((event: CustomEvent<{
    value: string;
  }>) => {
    color = event.detail.value;

    dispatch('update', color);
  }, 60);

  function handleClickOutside (node: HTMLElement){
    if (clickCounter) {
      mounted = false;
    }

    clickCounter++;
  }

  const toggleMount = () => {
    mounted = !mounted;
    clickCounter = 0;
  };


</script>


<Button radius="lg" variant="light"
            style="display: inline-block; background-color: {color}"
            bind:element={popupPointerReference} on:click={toggleMount}>

    <Text size='xl'>{color ?? emptyText}</Text>
</Button>
<Popper {mounted}  reference={popupPointerReference} zIndex={10}  position="right">
    <Box use="{[[clickoutside, { enabled: mounted, callback: (node) => handleClickOutside(node) }]]}">
        <hex-alpha-color-picker color={color ?? ''} on:color-changed={(e) => onColorPick(e)}></hex-alpha-color-picker>
    </Box>
</Popper>
