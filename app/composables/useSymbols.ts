export interface MusicSymbol {
  id: string
  name: string
  glyph: string
  meaning: string
  rotate?: number
  svg?: string
}

export interface SymbolCategory {
  id: string
  label: string
  symbols: MusicSymbol[]
}

// Codepoints SMuFL (Bravura)
// Referencia: https://w3c.github.io/smufl/latest/tables/
const cp = (hex: string) => String.fromCodePoint(parseInt(hex, 16))

// Arpegio: serpentina vertical con flecha triangular sólida. dir: 'up' o 'down'.
function arpeggioSvg(dir: 'up' | 'down'): string {
  const wavePath = 'M 14 6 C 22 11, 6 17, 14 22 S 22 33, 14 38 S 6 49, 14 54'
  const arrow = dir === 'down'
    ? '<path d="M 6 52 L 14 64 L 22 52 Z" fill="currentColor"/>'
    : '<path d="M 6 12 L 14 0 L 22 12 Z" fill="currentColor"/>'
  return `<svg viewBox="0 -2 28 68" xmlns="http://www.w3.org/2000/svg">
    <path d="${wavePath}" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
    ${arrow}
  </svg>`
}

export function useSymbols() {
  const { t } = useI18n()

  const categories = computed<SymbolCategory[]>(() => [
    {
      id: 'clefs',
      label: t('symbols.clefs'),
      symbols: [
        { id: 'gClef', name: t('symbols.gclef'), glyph: cp('E050'), meaning: t('symbols.gclef-meaning') },
        { id: 'fClef', name: t('symbols.fclef'), glyph: cp('E062'), meaning: t('symbols.fclef-meaning') },
        { id: 'cClef', name: t('symbols.cclef'), glyph: cp('E05C'), meaning: t('symbols.cclef-meaning') }
      ]
    },
    {
      id: 'figures',
      label: t('symbols.figures'),
      symbols: [
        { id: 'whole', name: t('symbols.whole'), glyph: cp('E1D2'), meaning: t('symbols.whole-meaning') },
        { id: 'half', name: t('symbols.half'), glyph: cp('E1D3'), meaning: t('symbols.half-meaning') },
        { id: 'quarter', name: t('symbols.quarter'), glyph: cp('E1D5'), meaning: t('symbols.quarter-meaning') },
        { id: 'eighth', name: t('symbols.eighth'), glyph: cp('E1D7'), meaning: t('symbols.eighth-meaning') },
        { id: 'sixteenth', name: t('symbols.sixteenth'), glyph: cp('E1D9'), meaning: t('symbols.sixteenth-meaning') }
      ]
    },
    {
      id: 'rhythm',
      label: t('symbols.rhythm'),
      symbols: [
        { id: 'aug-dot', name: t('symbols.aug-dot'), glyph: cp('E1E7'), meaning: t('symbols.aug-dot-meaning') },
        { id: 'tie', name: t('symbols.tie'), glyph: cp('E1FD'), meaning: t('symbols.tie-meaning') },
        { id: 'arpeggio-up', name: t('symbols.arpeggio-up'), glyph: '', meaning: t('symbols.arpeggio-up-meaning'), svg: arpeggioSvg('up') },
        { id: 'arpeggio-down', name: t('symbols.arpeggio-down'), glyph: '', meaning: t('symbols.arpeggio-down-meaning'), svg: arpeggioSvg('down') }
      ]
    },
    {
      id: 'rests',
      label: t('symbols.rests'),
      symbols: [
        { id: 'rest-whole', name: t('symbols.rest-whole'), glyph: cp('E4E3'), meaning: t('symbols.rest-whole-meaning') },
        { id: 'rest-half', name: t('symbols.rest-half'), glyph: cp('E4E4'), meaning: t('symbols.rest-half-meaning') },
        { id: 'rest-quarter', name: t('symbols.rest-quarter'), glyph: cp('E4E5'), meaning: t('symbols.rest-quarter-meaning') },
        { id: 'rest-eighth', name: t('symbols.rest-eighth'), glyph: cp('E4E6'), meaning: t('symbols.rest-eighth-meaning') },
        { id: 'rest-sixteenth', name: t('symbols.rest-sixteenth'), glyph: cp('E4E7'), meaning: t('symbols.rest-sixteenth-meaning') }
      ]
    },
    {
      id: 'accidentals',
      label: t('symbols.accidentals'),
      symbols: [
        { id: 'sharp', name: t('symbols.sharp'), glyph: cp('E262'), meaning: t('symbols.sharp-meaning') },
        { id: 'flat', name: t('symbols.flat'), glyph: cp('E260'), meaning: t('symbols.flat-meaning') },
        { id: 'natural', name: t('symbols.natural'), glyph: cp('E261'), meaning: t('symbols.natural-meaning') },
        { id: 'dbl-sharp', name: t('symbols.dbl-sharp'), glyph: cp('E263'), meaning: t('symbols.dbl-sharp-meaning') },
        { id: 'dbl-flat', name: t('symbols.dbl-flat'), glyph: cp('E264'), meaning: t('symbols.dbl-flat-meaning') }
      ]
    },
    {
      id: 'dynamics',
      label: t('symbols.dynamics'),
      symbols: [
        { id: 'pp', name: t('symbols.pp'), glyph: cp('E52B'), meaning: t('symbols.pp-meaning') },
        { id: 'p', name: t('symbols.p'), glyph: cp('E520'), meaning: t('symbols.p-meaning') },
        { id: 'mp', name: t('symbols.mp'), glyph: cp('E52C'), meaning: t('symbols.mp-meaning') },
        { id: 'mf', name: t('symbols.mf'), glyph: cp('E52D'), meaning: t('symbols.mf-meaning') },
        { id: 'f', name: t('symbols.f'), glyph: cp('E522'), meaning: t('symbols.f-meaning') },
        { id: 'ff', name: t('symbols.ff'), glyph: cp('E52F'), meaning: t('symbols.ff-meaning') },
        { id: 'sfz', name: t('symbols.sfz'), glyph: cp('E539'), meaning: t('symbols.sfz-meaning') },
        { id: 'cresc', name: t('symbols.cresc'), glyph: cp('E53E'), meaning: t('symbols.cresc-meaning') },
        { id: 'dim', name: t('symbols.dim'), glyph: cp('E53F'), meaning: t('symbols.dim-meaning') }
      ]
    },
    {
      id: 'articulations',
      label: t('symbols.articulations'),
      symbols: [
        { id: 'staccato', name: t('symbols.staccato'), glyph: cp('E4A2'), meaning: t('symbols.staccato-meaning') },
        { id: 'accent', name: t('symbols.accent'), glyph: cp('E4A0'), meaning: t('symbols.accent-meaning') },
        { id: 'tenuto', name: t('symbols.tenuto'), glyph: cp('E4A4'), meaning: t('symbols.tenuto-meaning') },
        { id: 'marcato', name: t('symbols.marcato'), glyph: cp('E4AC'), meaning: t('symbols.marcato-meaning') },
        { id: 'fermata', name: t('symbols.fermata'), glyph: cp('E4C0'), meaning: t('symbols.fermata-meaning') }
      ]
    },
    {
      id: 'repeats',
      label: t('symbols.repeats'),
      symbols: [
        { id: 'repeat-start', name: t('symbols.repeat-start'), glyph: cp('E040'), meaning: t('symbols.repeat-start-meaning') },
        { id: 'repeat-end', name: t('symbols.repeat-end'), glyph: cp('E041'), meaning: t('symbols.repeat-end-meaning') },
        { id: 'segno', name: t('symbols.segno'), glyph: cp('E047'), meaning: t('symbols.segno-meaning') },
        { id: 'coda', name: t('symbols.coda'), glyph: cp('E048'), meaning: t('symbols.coda-meaning') }
      ]
    }
  ])

  return { categories }
}
