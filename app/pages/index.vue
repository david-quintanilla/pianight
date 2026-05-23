<template>
  <section class="px-4 sm:px-6 lg:px-10 py-6">
    <div class="max-w-[1600px] mx-auto flex flex-col gap-5">
      <div class="flex flex-col items-center gap-2">
        <PianoNoteSelector />
        <PianoChordNavigator />
      </div>

      <PianoChordDetails class="w-full" />
    </div>
  </section>
</template>
