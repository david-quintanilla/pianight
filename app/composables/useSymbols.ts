export interface MusicSymbol {
  id: string
  name: string
  glyph: string
  meaning: string
}

export interface SymbolCategory {
  id: string
  label: string
  symbols: MusicSymbol[]
}

// Codepoints SMuFL (Bravura)
// Referencia: https://w3c.github.io/smufl/latest/tables/
const cp = (hex: string) => String.fromCodePoint(parseInt(hex, 16))

export function useSymbols() {
  const categories: SymbolCategory[] = [
    {
      id: 'clefs',
      label: 'Claves',
      symbols: [
        { id: 'gClef', name: 'Clave de Sol', glyph: cp('E050'), meaning: 'Mano derecha. La línea sobre la que se enrolla es Sol₄.' },
        { id: 'fClef', name: 'Clave de Fa', glyph: cp('E062'), meaning: 'Mano izquierda. Los dos puntos rodean la línea de Fa₃.' },
        { id: 'cClef', name: 'Clave de Do', glyph: cp('E05C'), meaning: 'La línea central marca Do₄. Usada por viola y voz.' }
      ]
    },
    {
      id: 'figures',
      label: 'Figuras',
      symbols: [
        { id: 'whole', name: 'Redonda', glyph: cp('E1D2'), meaning: 'Dura 4 tiempos.' },
        { id: 'half', name: 'Blanca', glyph: cp('E1D3'), meaning: 'Dura 2 tiempos.' },
        { id: 'quarter', name: 'Negra', glyph: cp('E1D5'), meaning: 'Dura 1 tiempo.' },
        { id: 'eighth', name: 'Corchea', glyph: cp('E1D7'), meaning: 'Dura ½ tiempo.' },
        { id: 'sixteenth', name: 'Semicorchea', glyph: cp('E1D9'), meaning: 'Dura ¼ tiempo.' }
      ]
    },
    {
      id: 'rests',
      label: 'Silencios',
      symbols: [
        { id: 'rest-whole', name: 'Silencio de redonda', glyph: cp('E4E3'), meaning: '4 tiempos en silencio.' },
        { id: 'rest-half', name: 'Silencio de blanca', glyph: cp('E4E4'), meaning: '2 tiempos en silencio.' },
        { id: 'rest-quarter', name: 'Silencio de negra', glyph: cp('E4E5'), meaning: '1 tiempo en silencio.' },
        { id: 'rest-eighth', name: 'Silencio de corchea', glyph: cp('E4E6'), meaning: '½ tiempo en silencio.' },
        { id: 'rest-sixteenth', name: 'Silencio de semicorchea', glyph: cp('E4E7'), meaning: '¼ tiempo en silencio.' }
      ]
    },
    {
      id: 'accidentals',
      label: 'Alteraciones',
      symbols: [
        { id: 'sharp', name: 'Sostenido', glyph: cp('E262'), meaning: 'Sube la nota un semitono.' },
        { id: 'flat', name: 'Bemol', glyph: cp('E260'), meaning: 'Baja la nota un semitono.' },
        { id: 'natural', name: 'Becuadro', glyph: cp('E261'), meaning: 'Anula la alteración previa.' },
        { id: 'dbl-sharp', name: 'Doble sostenido', glyph: cp('E263'), meaning: 'Sube dos semitonos.' },
        { id: 'dbl-flat', name: 'Doble bemol', glyph: cp('E264'), meaning: 'Baja dos semitonos.' }
      ]
    },
    {
      id: 'dynamics',
      label: 'Dinámicas',
      symbols: [
        { id: 'pp', name: 'Pianissimo', glyph: cp('E52B'), meaning: 'Muy suave.' },
        { id: 'p', name: 'Piano', glyph: cp('E520'), meaning: 'Suave.' },
        { id: 'mp', name: 'Mezzo piano', glyph: cp('E52C'), meaning: 'Medio suave.' },
        { id: 'mf', name: 'Mezzo forte', glyph: cp('E52D'), meaning: 'Medio fuerte.' },
        { id: 'f', name: 'Forte', glyph: cp('E522'), meaning: 'Fuerte.' },
        { id: 'ff', name: 'Fortissimo', glyph: cp('E52F'), meaning: 'Muy fuerte.' },
        { id: 'sfz', name: 'Sforzando', glyph: cp('E539'), meaning: 'Acento súbito.' },
        { id: 'cresc', name: 'Crescendo', glyph: cp('E53E'), meaning: 'Subiendo de volumen.' },
        { id: 'dim', name: 'Diminuendo', glyph: cp('E53F'), meaning: 'Bajando de volumen.' }
      ]
    },
    {
      id: 'articulations',
      label: 'Articulaciones',
      symbols: [
        { id: 'staccato', name: 'Staccato', glyph: cp('E4A2'), meaning: 'Nota corta y desligada.' },
        { id: 'accent', name: 'Acento', glyph: cp('E4A0'), meaning: 'Enfatizar la nota.' },
        { id: 'tenuto', name: 'Tenuto', glyph: cp('E4A4'), meaning: 'Sostener la duración completa.' },
        { id: 'marcato', name: 'Marcato', glyph: cp('E4AC'), meaning: 'Acento más enérgico.' },
        { id: 'fermata', name: 'Calderón', glyph: cp('E4C0'), meaning: 'Sostener la nota a voluntad.' }
      ]
    },
    {
      id: 'repeats',
      label: 'Repeticiones',
      symbols: [
        { id: 'repeat-start', name: 'Inicio de repetición', glyph: cp('E040'), meaning: 'Aquí empieza la sección a repetir.' },
        { id: 'repeat-end', name: 'Fin de repetición', glyph: cp('E041'), meaning: 'Vuelve al inicio de repetición.' },
        { id: 'segno', name: 'Segno', glyph: cp('E047'), meaning: 'Marca de referencia para D.S.' },
        { id: 'coda', name: 'Coda', glyph: cp('E048'), meaning: 'Salta al final marcado.' }
      ]
    }
  ]

  return { categories }
}
