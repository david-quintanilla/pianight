<template>
  <div class="p-8 pt-4 flex gap-2">
    <div class="flex justify-between items-start gap-4">
      <PianoNoteSelector />
      <PianoChordNavigator />
    </div>
    <PianoChordDetails class="w-full" />
  </div>
</template>
