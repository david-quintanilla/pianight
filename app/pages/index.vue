<template>
  <div class="pt-4 flex flex-col gap-4">
    <div class="flex flex-col items-center gap-2">
      <PianoNoteSelector />
      <PianoChordNavigator />
    </div>
    <PianoChordDetails class="w-full" />
  </div>
</template>
