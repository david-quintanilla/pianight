<template>
  <section class="px-6 lg:px-10 py-10 lg:py-14">
    <div class="max-w-[1600px] mx-auto flex flex-col gap-10">
      <header class="flex flex-col items-center text-center gap-3">
        <p class="text-[11px] uppercase tracking-[0.22em] text-aqua-300/60 font-medium">
          Diccionario armónico
        </p>
        <h1 class="font-display text-4xl lg:text-5xl font-semibold tracking-tight text-musical leading-[1.05]">
          Acordes
        </h1>
        <p class="text-sm text-cyan-100/55 max-w-md leading-relaxed">
          Elige una nota y un tipo de acorde para visualizar su fundamental y sus inversiones.
        </p>
      </header>

      <div class="flex flex-col items-center gap-4">
        <PianoNoteSelector />
        <PianoChordNavigator />
      </div>

      <PianoChordDetails class="w-full" />
    </div>
  </section>
</template>
