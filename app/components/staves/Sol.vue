<template>
  <div class="flex flex-col gap-4 mt-20">
    <h1 class="text-2xl font-extrabold flex gap-2 items-center">
      Clave de Sol
      <SvgoHandRight />
    </h1>
    <div class="flex flex-col w-full border border-cyan-500 justify-around relative mb-36">
      <SvgoSol class="text-[16rem] absolute -left-20 -top-12 text-amber-500" />

      <!-- top notes -->
      <div class="flex w-full h-8 absolute pl-[58rem] z-30 -top-32">
        <StavesNote :note="i18n.t('note.f')" :left="73" :bottom="0.34" :lines="['top', 'bottom']" />
        <StavesNote :note="i18n.t('note.e')" :left="70" :bottom="-0.81" :lines="['center']" />
      </div>
      <div class="flex w-full h-8 absolute pl-[58rem] z-30 -top-24">
        <StavesNote :note="i18n.t('note.d')" :left="67" :bottom="0.33" :lines="['top', 'bottom']" />
        <StavesNote :note="i18n.t('note.c')" :left="64" :bottom="-0.85" :lines="['center']" />
      </div>
      <div class="flex w-full h-8 absolute pl-[46rem] z-30 -top-16">
        <StavesNote :note="i18n.t('note.b')" :left="61" :bottom="0.27" :lines="['top', 'bottom']" />
        <StavesNote :note="i18n.t('note.a')" :left="58" :bottom="-0.9" :lines="['center']" />
      </div>

      <!-- center notes -->
      <div class="flex w-full h-8 absolute pl-[38rem] z-30 -top-8">
        <StavesNote :note="i18n.t('note.g')" :left="55" :bottom="0.22" :lines="['top']" />
        <StavesNote :note="i18n.t('note.f')" :left="52" :bottom="-0.8" />
      </div>
      <div class="flex w-full h-8 relative pl-[30rem] z-30">
        <StavesNote :note="i18n.t('note.e')" :left="49" :top="0.2" />
        <StavesNote :note="i18n.t('note.d')" :left="46" :bottom="-0.8" />
      </div>
      <div class="flex w-full border-t border-cyan-500 h-8 relative pl-[22rem] z-20">
        <StavesNote :note="i18n.t('note.c')" :left="43" :top="0.2" />
        <StavesNote :note="i18n.t('note.b')" :left="40" :bottom="-0.8" />
      </div>
      <div class="flex w-full border-t border-cyan-500 h-8 relative pl-[14rem] z-10">
        <StavesNote :note="i18n.t('note.a')" :left="37" :top="0.2" />
        <StavesNote class="bg-yellow-500" :note="i18n.t('note.g')" :left="34" :bottom="-0.8" />
      </div>
      <div class="flex w-full border-t border-yellow-500 h-8 relative pl-[6rem]">
        <StavesNote :note="i18n.t('note.f')" :left="31" :top="0.2" />
        <StavesNote :note="i18n.t('note.e')" :left="28" :bottom="-0.8" />
      </div>

      <!-- down notes -->
      <div class="flex w-full h-8 absolute z-30 -bottom-10">
        <StavesNote :note="i18n.t('note.d')" :lines="['bottom']" :left="25" :top="-0.2" />
        <StavesNote :note="i18n.t('note.c')" :lines="['center']" :left="22" :bottom="-0.5" />
      </div>
      <div class="flex w-full h-8 absolute z-30 -bottom-20">
        <StavesNote :note="i18n.t('note.b')" :lines="['top', 'bottom']" :left="19" :top="-0.64" />
        <StavesNote :note="i18n.t('note.a')" :lines="['center']" :left="15.5" :bottom="-0.04" />
      </div>
      <div class="flex w-full h-8 absolute z-30 -bottom-30">
        <StavesNote :note="i18n.t('note.g')" :lines="['top', 'bottom']" :left="12" :top="-1.1" />
        <StavesNote :note="i18n.t('note.f')" :lines="['center']" :left="8.5" :bottom="0.4" />
      </div>
      <div class="flex w-full h-8 absolute z-30 -bottom-40">
        <StavesNote :note="i18n.t('note.e')" :lines="['top', 'bottom']" :left="5" :top="-1.53" />
        <StavesNote :note="i18n.t('note.d')" :lines="['center']" :left="2" :bottom="0.85" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const i18n = useI18n()
</script>