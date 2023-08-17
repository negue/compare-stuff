<script lang="ts">
  import { ActionIcon, Box, Popper, Text } from '@svelteuidev/core';
  import { Picker } from 'emoji-picker-element';
  import type { EmojiClickEvent, NativeEmoji } from "emoji-picker-element/shared";
  import { clickoutside } from '@svelteuidev/composables';
  import { createEventDispatcher } from "svelte";

  // maybe create the instance across components?
  let pickerInstance: Picker;
  let popupPointerReference: HTMLElement;

  const defaultEmoji = '😉'

  export let selectedEmoji = defaultEmoji;
  let mounted = false;
  // on opening it calls the function already, but thats the first popup open
  // so this can be ignored
  let clickCounter = 0;

  let boxTargetForPicker: HTMLElement

  const dispatch = createEventDispatcher();


  function onEmojiClick(event: EmojiClickEvent) {
    selectedEmoji = (event.detail.emoji as NativeEmoji).unicode;

    dispatch('update', selectedEmoji);
  }

  function handleClickOutside (node: HTMLElement){
    if (clickCounter) {
      mounted = false;
    }

    clickCounter++;
  }

  const toggleMount = () => {
    mounted = !mounted;
    clickCounter = 0;

    if (!pickerInstance) {
      pickerInstance = new Picker();

      pickerInstance.addEventListener('emoji-click', onEmojiClick);
    }
  };

  $: {
    if (boxTargetForPicker) {
     boxTargetForPicker.appendChild(pickerInstance);
    }
  }
</script>


<ActionIcon color="green" radius="lg" variant="light"
            style="display: inline-block"
            bind:element={popupPointerReference} on:click={toggleMount}>

    <Text size='xl'>{selectedEmoji ?? defaultEmoji}</Text>
</ActionIcon>
<Popper {mounted}  reference={popupPointerReference} zIndex={10}>
    <Box bind:element={boxTargetForPicker}
         use="{[[clickoutside, { enabled: mounted, callback: (node) => handleClickOutside(node) }]]}">
    </Box>
</Popper>
