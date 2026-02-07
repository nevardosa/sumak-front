import { SensoryCard, IdealMoment, RitualStep, Feature } from '../models/experiences.models';

export const EXPERIENCES_CONTENT = {
  hero: {
    title: 'Experiencias que se recuerdan, rituales que se sienten',
    subtitle: 'En Sumak entendemos el regalo como una experiencia sensorial y emocional: diseñada para expresar cuidado, intención y significado a través del sabor.',
    bullets: [
      'Experiencias gastronómicas cuidadosamente curadas',
      'Rituales diseñados para regalar con intención',
      'Equilibrio de sabor, textura y presentación'
    ],
    primaryCta: 'Solicitar propuesta corporativa',
    secondaryCta: 'Explorar rituales',
    microcopy: 'Respuesta personalizada en menos de 24 horas hábiles.'
  },
  meaning: {
    title: 'El regalo como experiencia, no como objeto',
    paragraphs: [
      'Una experiencia Sumak no comienza al abrir una caja. Comienza desde la intención de quien regala y se completa cuando alguien se detiene, prueba y recuerda.',
      'Cada ritual está pensado para transformar un gesto en un momento con significado.'
    ]
  },
  sensory: {
    title: 'Diseñamos experiencias para los sentidos',
    cards: [
      {
        id: 'sight',
        title: 'Vista',
        description: 'Presentación sobria y elegante que comunica valor desde el primer instante.'
      },
      {
        id: 'aroma',
        title: 'Aroma',
        description: 'Notas naturales del cacao, frutos secos y detalles que despiertan expectativa.'
      },
      {
        id: 'taste',
        title: 'Gusto',
        description: 'Perfiles equilibrados y contrastes curados para disfrutar con calma.'
      }
    ] as readonly SensoryCard[]
  },
  emotional: {
    title: 'Un ritual que comunica más que palabras',
    paragraphs: [
      'Cada experiencia Sumak está diseñada para expresar gratitud, reconocimiento o celebración sin necesidad de discursos.',
      'Es una forma consciente de decir: pensé en ti, cuidé el detalle, elegí con intención.'
    ]
  },
  moments: {
    title: 'Momentos que merecen ser recordados',
    items: [
      { text: 'Reconocimientos profesionales' },
      { text: 'Celebraciones corporativas' },
      { text: 'Cierres de ciclo y aniversarios' },
      { text: 'Relaciones institucionales y alianzas' },
      { text: 'Regalos personales con significado' }
    ] as readonly IdealMoment[]
  },
  ritual: {
    title: 'Así se vive un ritual Sumak',
    steps: [
      {
        number: 1,
        title: 'Se elige con intención',
        description: 'Perfil de sabor, ocasión y mensaje.'
      },
      {
        number: 2,
        title: 'Se presenta con cuidado',
        description: 'Cada elemento tiene un propósito.'
      },
      {
        number: 3,
        title: 'Se degusta con pausa',
        description: 'Sabores que invitan a detenerse.'
      },
      {
        number: 4,
        title: 'Se recuerda',
        description: 'La experiencia permanece más allá del momento.'
      }
    ] as readonly RitualStep[]
  },
  differentiators: {
    title: 'No diseñamos productos, diseñamos experiencias',
    features: [
      { text: 'Curaduría gastronómica premium' },
      { text: 'Ingredientes seleccionados' },
      { text: 'Presentación impecable' },
      { text: 'Acompañamiento experto' },
      { text: 'Cobertura nacional' }
    ] as readonly Feature[],
    microcopy: 'Cada detalle está pensado para sostener el significado del regalo.'
  },
  finalCta: {
    title: '¿Listo para regalar una experiencia con significado?',
    subtitle: 'Explora nuestros rituales o cuéntanos tu objetivo y diseñamos una propuesta a la medida.',
    primaryCta: 'Solicitar propuesta corporativa',
    secondaryCta: 'Explorar rituales',
    microcopy: 'Atención personalizada para empresas y organizaciones.'
  }
} as const;
