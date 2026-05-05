<template>
  <section class="px-6 lg:px-10 py-6">
    <div class="max-w-[1600px] mx-auto flex flex-col gap-5">
      <header class="flex flex-col items-center text-center gap-1">
        <h1 class="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-musical leading-[1.05]">
          Acordes
        </h1>
        <p class="text-xs text-cyan-100/55 max-w-md leading-relaxed">
          Elige una nota y un tipo de acorde para ver su fundamental e inversiones.
        </p>
      </header>

      <div class="flex flex-col items-center gap-2">
        <PianoNoteSelector />
        <PianoChordNavigator />
      </div>

      <PianoChordDetails class="w-full" />
    </div>
  </section>
</template>
