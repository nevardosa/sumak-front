import { CorporateSegment, CorporateDifferentiator, CorporateStep, CorporateStat } from '../models/corporate-gifts.models';

export const CORPORATE_GIFTS_CONTENT = {
  hero: {
    title: 'Regalos corporativos con propósito y curaduría premium',
    subtitle: 'Diseñamos rituales gastronómicos para empresas y equipos profesionales que reconocen el valor del detalle, la intención y el significado.',
    bullets: [
      'Propuestas a la medida según ocasión y público',
      'Presentación impecable y entrega cuidada',
      'Cobertura nacional (32 departamentos)'
    ],
    primaryCta: 'Solicitar propuesta corporativa',
    secondaryCta: 'Ver rituales',
    microcopy: 'Respuesta personalizada en menos de 24 horas hábiles.'
  },
  segments: {
    title: 'Soluciones para organizaciones y equipos',
    subtitle: 'Acompañamos reconocimientos, celebraciones y momentos clave con rituales gastronómicos que comunican gratitud con elegancia.',
    items: [
      {
        id: 'recognition',
        title: 'Reconocimientos profesionales',
        description: 'Detalles sobrios para celebrar trayectorias, logros y aportes de valor.'
      },
      {
        id: 'teams',
        title: 'Equipos y talento humano',
        description: 'Regalos corporativos para aniversarios, logros y fortalecimiento de la cultura organizacional.'
      },
      {
        id: 'institutional',
        title: 'Relaciones institucionales',
        description: 'Obsequios premium para aliados, clientes y vínculos estratégicos.'
      },
      {
        id: 'events',
        title: 'Eventos y celebraciones',
        description: 'Experiencias para fechas especiales, cierres de año y hitos corporativos.'
      }
    ] as readonly CorporateSegment[]
  },
  differentiators: {
    title: 'Lo que hace diferente a Sumak',
    subtitle: 'Cada ritual se diseña para expresar cuidado, pausa y significado. Curaduría, calidad y presentación en un solo gesto.',
    items: [
      {
        id: 'curation',
        title: 'Curaduría personalizada',
        description: 'Diseñamos cada ritual según ocasión, cantidad y mensaje.',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
      },
      {
        id: 'ingredients',
        title: 'Ingredientes seleccionados',
        description: 'Chocolate de alto cacao, frutos secos seleccionados y sabores curados.',
        icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
      },
      {
        id: 'presentation',
        title: 'Presentación impecable',
        description: 'Empaque premium pensado para entornos corporativos.',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
      },
      {
        id: 'support',
        title: 'Acompañamiento experto',
        description: 'Te acompañamos a elegir el ritual adecuado.',
        icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
      },
      {
        id: 'coverage',
        title: 'Cobertura nacional',
        description: 'Entregas a nivel nacional con cuidado logístico.',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    ] as readonly CorporateDifferentiator[]
  },
  process: {
    title: 'Cómo trabajamos',
    note: 'Te asesoramos en la selección por perfil de sabor, ocasión y presupuesto.',
    steps: [
      {
        number: 1,
        title: 'Cuéntanos tu necesidad',
        description: 'Ocasión, cantidad y público.'
      },
      {
        number: 2,
        title: 'Diseñamos la propuesta',
        description: 'Opciones premium alineadas a tu objetivo.'
      },
      {
        number: 3,
        title: 'Ajustamos y confirmamos',
        description: 'Detalles, tiempos y logística.'
      },
      {
        number: 4,
        title: 'Entregamos con presentación impecable',
        description: 'Listo para sorprender.'
      }
    ] as readonly CorporateStep[]
  },
  trust: {
    title: 'Confianza construida a través de cada ritual',
    subtitle: 'Cada entrega es un estándar de cuidado y detalle.',
    stats: [
      { value: '14', label: 'Rituales premium diseñados' },
      { value: '+50', label: 'Proyectos y reconocimientos entregados' },
      { value: '32', label: 'Departamentos cubiertos' }
    ] as readonly CorporateStat[]
  },
  finalCta: {
    title: '¿Listo para crear un regalo corporativo a la altura de tu organización?',
    subtitle: 'Cuéntanos tu objetivo y diseñamos una propuesta estratégica y personalizada para tu organización.',
    cta: 'Solicitar propuesta corporativa',
    microcopy: 'Atención personalizada para empresas y organizaciones.'
  }
} as const;
