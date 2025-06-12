<template>
  <div class="p-8 flex flex-col gap-2">
    <div>
      <PianoChordSelector />
    </div>
    <div class="flex justify-center gap-1">
      <PianoKeyboardOctave :id="1" />
      <PianoKeyboardOctave :id="2" />
      <PianoKeyboardOctave :id="3" />
    </div>
  </div>
</template>
