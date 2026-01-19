import { Injectable, signal } from '@angular/core';
import { SecuritySanitizerService } from '../../../core/services/security-sanitizer.service';
import { Product, ProductCategory } from '../models/catalog.models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly securityService = inject(SecuritySanitizerService);

  private readonly products = signal<Product[]>([
  {
    id: '1',
    name: 'Kuntur Dorado',
    price: 524500,
    description:
      'En las culturas andinas, el kuntur es el ave que habita las mayores alturas, símbolo de visión clara y conexión entre el cielo y la tierra. Kuntur Dorado representa ese vuelo amplio que desciende hacia los valles cálidos, donde los aromas cítricos se mezclan con la fruta y el aire se vuelve luminoso.',
    experience: 'Un combo fresco, vivo y elegante, pensado para abrir los sentidos.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% naranja y limón',
      'Snack de frutos amarillos deshidratados 30 g',
      'Pistachos naturales 80 g',
      'Arándanos secos 80 g',
      'Miel de abejas infusionada con maracuyá 250 g'
    ],
    sensorialExperience: 'Cítrica, tropical y herbal, con una frescura limpia y persistente.',
    imageUrl: 'assets/images/kuntur_dorado.jpg',
    category: ProductCategory.PREMIUM,

    // Línea discreta (web)
    curatedLine:
      'Recomendado para: regalos corporativos, aperturas y encuentros diurnos; perfil luminoso y preciso.',
    // Lineamientos de ocasión / afinidad (alto perfil)
    occasions: [
      'Regalo corporativo de alto nivel',
      'Ascensos y nuevos comienzos',
      'Cierres de negociación / agradecimiento formal',
      'Brunch o tarde elegante'
    ],
    affinity: {
      temperament: ['estratégico', 'creativo', 'moderno', 'sobrio'],
      palate: ['fresco', 'cítrico', 'herbal', 'equilibrado'],
      genderAffinity: 'Unisex'
    },
    servingSuggestion:
      'Ideal como ritual de apertura: servir primero la bebida, luego chocolate cítrico; finalizar con miel para prolongar el aroma.'
  },

  {
    id: '2',
    name: 'Sol Caribeño',
    price: 379500,
    description:
      'El Caribe no solo se vive: se siente en la piel y se guarda en la memoria. Sol Caribeño rinde homenaje a la luz que madura la caña, al tiempo que transforma la bebida y a la dulzura natural de las tierras cálidas.',
    experience: 'Este combo evoca tardes doradas, calma tropical y un sabor que abraza sin prisa.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% con sal marina',
      'Snack de frutos amarillos deshidratados 30 g',
      'Almendra natural 80 g',
      'Maní natural 80 g',
      'Miel de abeja natural de 250 g'
    ],
    sensorialExperience: 'Tropical, melosa y armoniosa, con un cierre suave y reconfortante.',
    imageUrl: 'assets/images/sol_caribeno.jpg',
    category: ProductCategory.CLASSIC,

    curatedLine:
      'Recomendado para: agradecimientos, celebraciones serenas y momentos familiares; dulzor cálido y armónico.',
    occasions: [
      'Agradecimiento (exjefe, mentor, colega)',
      'Cumpleaños y celebraciones tranquilas',
      'Detalle familiar con intención',
      'Aniversario en clave cálida'
    ],
    affinity: {
      temperament: ['cálido', 'cercano', 'clásico', 'afectivo'],
      palate: ['tropical', 'meloso', 'suave', 'reconfortante'],
      genderAffinity: 'Unisex (ligeramente femenino por perfil meloso)'
    },
    servingSuggestion:
      'Ritual de confort: chocolate con sal primero, luego frutos; cerrar con miel natural para redondear el final.'
  },

  {
    id: '3',
    name: 'Zipa Real',
    price: 481600,
    description:
      'El zipa era el gobernante del pueblo muisca, una figura de autoridad serena y equilibrio. Zipa Real honra ese liderazgo tranquilo, donde el poder no se impone, se reconoce.',
    experience:
      'Un combo clásico, armonioso y sobrio, pensado para líderes quienes valoran la tradición bien ejecutada.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% maní, almendra y pistacho',
      'Snack de frutos amarillos deshidratados 30 g',
      'Marañón natural 80 g',
      'Almendra natural 80 g',
      'Mermelada de frutos rojos de 130 g'
    ],
    sensorialExperience: 'Suave y elegante, con frutos secos nobles y un contraste frutal delicado.',
    imageUrl: 'assets/images/zipa_real.jpg',
    category: ProductCategory.PREMIUM,

    curatedLine:
      'Recomendado para: directivos y figuras de respeto; tradición sobria con contraste frutal discreto.',
    occasions: [
      'Reconocimiento profesional / institucional',
      'Regalo a directivo o cliente estratégico',
      'Cumpleaños formal',
      'Celebración con tono clásico'
    ],
    affinity: {
      temperament: ['sereno', 'institucional', 'tradicional', 'exigente'],
      palate: ['frutos secos nobles', 'suave', 'equilibrado', 'clásico'],
      genderAffinity: 'Predominio masculino (unisex)'
    },
    servingSuggestion:
      'Servir la bebida y acompañar con chocolate de frutos secos; terminar con mermelada para un contraste frutal elegante.'
  },

  {
    id: '4',
    name: 'Magia Colombiana',
    price: 659900,
    description:
      'Colombia es selva, cacao, madera y misterio. Magia Colombiana celebra esa profundidad que no se explica, se siente.',
    experience:
      'Este combo es un ritual lento, elegante y envolvente, donde cada sabor acompaña a la bebida como parte de un hechizo ancestral.',
    ingredients: [
      'Bebida premium incluida en la presentación original',
      'Chocolate 70% con granos de café',
      'Dátiles 80 g',
      'Nuez de Brasil 80 g',
      'Nuez pecan 80 g',
      'Miel de abejas infusionada con canela 250 g'
    ],
    sensorialExperience: 'Profunda, oscura y envolvente, con elegancia prolongada.',
    imageUrl: 'assets/images/magia_colombiana.jpg',
    category: ProductCategory.EXCLUSIVE,

    curatedLine:
      'Recomendado para: conocedores y regalos de alto impacto; capas oscuras, largas y sofisticadas (after dinner).',
    occasions: [
      'Regalo de máximo nivel (persona difícil de impresionar)',
      'Aniversario elegante e íntimo',
      'Cierre de ciclo / logro mayor',
      'Cena formal (after dinner)'
    ],
    affinity: {
      temperament: ['culto', 'introspectivo', 'sofisticado', 'sibarita'],
      palate: ['cacao', 'café', 'fruta madura', 'especiado fino'],
      genderAffinity: 'Unisex'
    },
    servingSuggestion:
      'Ritual nocturno: chocolate con café + dátiles; finalizar con miel y canela para prolongar el retrogusto.'
  },

  {
    id: '5',
    name: 'Mama Killa',
    price: 336400,
    description:
      'La luna protege, envuelve y calma. Mama Killa es un homenaje a la dulzura, la ternura y el descanso del alma.',
    experience: 'Un combo cremoso y reconfortante, pensado como un abrazo nocturno.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% sal marina y caramelo',
      'Dátiles 80 g',
      'Almendra natural 80 g',
      'Uva pasa rubia 80 g',
      'Mermelada de frutos rojos de 130 g'
    ],
    sensorialExperience: 'Dulce, sedosa y lunar, con notas suaves y envolventes.',
    imageUrl: 'assets/images/mama_killa.jpg',
    category: ProductCategory.CLASSIC,

    curatedLine:
      'Recomendado para: detalles afectivos y noches tranquilas; dulzor sedoso con calidez emocional.',
    occasions: [
      'Aniversario / detalle romántico (sin exceso)',
      'Cumpleaños íntimo',
      'Agradecimiento personal',
      'Regalo de cuidado y cercanía'
    ],
    affinity: {
      temperament: ['afectivo', 'delicado', 'sereno', 'cálido'],
      palate: ['caramelo', 'fruta dulce', 'sedoso', 'reconfortante'],
      genderAffinity: 'Predominio femenino (unisex)'
    },
    servingSuggestion:
      'Servir lentamente: chocolate caramelo + dátiles; cerrar con mermelada para una nota roja suave.'
  },

  {
    id: '6',
    name: 'Raíz de Fuego',
    price: 713000,
    description:
      'El fuego nace de la raíz. Este combo honra la energía ancestral del agave y la fuerza de la tierra.',
    experience: 'Intensidad y carácter en cada sorbo.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% sal marina y caramelo',
      'Snack de frutos amarillos deshidratados 30 g',
      'Maní japonés 80 g',
      'Pistacho 80 g',
      'Miel de abejas infusionada con jalapeño 250 g'
    ],
    sensorialExperience: 'Fuego, dulzor y chispa tropical.',
    imageUrl: 'assets/images/raíz_de_fuego.jpg',
    category: ProductCategory.EXCLUSIVE,

    curatedLine:
      'Recomendado para: personalidades de carácter y celebraciones potentes; contraste dulce-picante con final vibrante.',
    occasions: [
      'Celebración importante / logro mayor',
      'Regalo para carácter fuerte (alto impacto)',
      'Reunión nocturna selecta',
      'Brindis con personalidad'
    ],
    affinity: {
      temperament: ['decidido', 'audaz', 'dominante', 'enérgico'],
      palate: ['dulce-picante', 'tropical', 'intenso', 'largo'],
      genderAffinity: 'Predominio masculino (unisex)'
    },
    servingSuggestion:
      'Construir tensión: chocolate caramelo, luego frutos; finalizar con miel al jalapeño en micro-dosis para una chispa controlada.'
  },

  {
    id: '7',
    name: 'Viejo Amigo',
    price: 470700,
    description:
      'Hay sabores que siempre están. Viejo Amigo representa la confianza, la memoria y la tradición.',
    experience: 'Familiaridad y calidez en cada momento.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% sal marina y caramelo',
      'Dátiles 80 g',
      'Nuez pecan 80 g',
      'Almendra natural 80 g',
      'Miel de abejas natural 250 g'
    ],
    sensorialExperience: 'Cálida, clásica y reconfortante.',
    imageUrl: 'assets/images/viejo_amigo.jpg',
    category: ProductCategory.CLASSIC,

    curatedLine:
      'Recomendado para: amistad, gratitud y tradición; perfil cálido, clásico y profundamente confiable.',
    occasions: [
      'Regalo de amistad (reencuentro)',
      'Agradecimiento sobrio',
      'Detalle para figuras mayores o de gran respeto',
      'Celebración familiar'
    ],
    affinity: {
      temperament: ['tradicional', 'confiable', 'sereno', 'nostálgico'],
      palate: ['caramelo', 'fruta madura', 'miel', 'clásico'],
      genderAffinity: 'Predominio masculino (unisex)'
    },
    servingSuggestion:
      'After-dinner amable: dátiles + chocolate caramelo; cerrar con miel natural para un final cálido.'
  },

  {
    id: '8',
    name: 'Zipa Supremo',
    price: 909400,
    description:
      'Cuando el linaje alcanza su punto más alto, surge la excelencia. Zipa Supremo representa la madurez del poder, la profundidad del tiempo y el lujo que no necesita alzar la voz.',
    experience:
      'Este combo está diseñado para paladares que saben reconocer la grandeza en los detalles.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% sal marina y caramelo',
      'Dátiles 80 g',
      'Pistachos naturales 80 g',
      'Nuez pecan 80 g',
      'Mermelada de ciruela 130 g'
    ],
    sensorialExperience: 'Lujo silencioso, mineralidad sutil y fruta oscura bien integrada.',
    imageUrl: 'assets/images/zipa_supremo.jpg',
    category: ProductCategory.EXCLUSIVE,

    curatedLine:
      'Recomendado para: máximos reconocimientos; lujo silencioso, maduro y profundamente integrado.',
    occasions: [
      'Regalo de máximo nivel (VIP / alta dirección)',
      'Reconocimiento mayor / premio / ascenso ejecutivo',
      'Aniversario de gran significado',
      'Cierre de negociación clave'
    ],
    affinity: {
      temperament: ['élite discreta', 'sobrio', 'exigente', 'clásico moderno'],
      palate: ['fruta oscura', 'salinidad fina', 'mineralidad sutil', 'larga integración'],
      genderAffinity: 'Predominio masculino (unisex)'
    },
    servingSuggestion:
      'Ritual de precisión: chocolate primero, luego dátiles; terminar con ciruela para un final oscuro y elegante.'
  },

  {
    id: '9',
    name: 'Ritual de Agave',
    price: 618700,
    description:
      'Hay bebidas que no se toman con prisa, se honran. Ritual del Agave invita a detener el tiempo, a conectar con la tierra, con el origen y con el pulso sereno del agave reposado.',
    experience: 'Es un momento consciente, profundo y cálido, pensado para disfrutar lentamente.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% con notas de naranja y limón',
      'Albaricoque 80 g',
      'Marañón natural 80 g',
      'Almendra natural 80 g',
      'Miel de abejas infusionada con jengibre 250 g'
    ],
    sensorialExperience: 'Dulce-cítrica, equilibrada y profundamente aromática.',
    imageUrl: 'assets/images/ritual_de_agave.jpg',
    category: ProductCategory.PREMIUM,

    curatedLine:
      'Recomendado para: pausa consciente, regalo personal y celebraciones íntimas; aromático, cálido y refinado.',
    occasions: [
      'Aniversario íntimo (ritual, no fiesta)',
      'Regalo personal de alto significado',
      'Celebración tranquila / noche de conversación',
      'Momento de pausa y conexión'
    ],
    affinity: {
      temperament: ['consciente', 'sereno', 'reflexivo', 'elegante'],
      palate: ['cítrico aromático', 'fruta amable', 'especiado fino', 'equilibrado'],
      genderAffinity: 'Unisex'
    },
    servingSuggestion:
      'Progresión aromática: chocolate cítrico, luego albaricoque; cerrar con miel y jengibre para un final perfumado.'
  },

  {
    id: '10',
    name: 'Killa Sagrada',
    price: 283900,
    description:
      'La luna, killa, ha sido símbolo de lo sagrado y lo íntimo desde tiempos ancestrales. Killa Sagrada es un pequeño ritual personal, delicado y luminoso.',
    experience: 'Intimidad y conexión espiritual.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% naranja y limón',
      'Snack de frutos amarillos deshidratados 30 g',
      'Pistachos naturales 80 g',
      'Uva pasa rubia 80 g',
      'Mermelada de maracuyá de 130 g'
    ],
    sensorialExperience: 'Luminosa, fresca y suavemente tropical.',
    imageUrl: 'assets/images/killa_sagrada.jpg',
    category: ProductCategory.CLASSIC,

    curatedLine:
      'Recomendado para: detalles delicados y rituales personales; frescura luminosa con dulzor sutil.',
    occasions: [
      'Detalle íntimo / gesto sutil',
      'Cumpleaños delicado',
      'Agradecimiento personal',
      'Regalo “sin ruido”, con intención'
    ],
    affinity: {
      temperament: ['delicado', 'sensitivo', 'luminoso', 'sereno'],
      palate: ['cítrico suave', 'tropical', 'ligero', 'fresco'],
      genderAffinity: 'Predominio femenino (unisex)'
    },
    servingSuggestion:
      'Ritual ligero: chocolate cítrico y frutos; finalizar con maracuyá para una acidez fina y luminosa.'
  },

  {
    id: '11',
    name: 'Kuntur Andino',
    price: 457500,
    description:
      'En las alturas de la cordillera, el kuntur vuela con calma y precisión. Kuntur Andino representa pureza, visión y sobriedad.',
    experience: 'Un combo limpio, elevado y elegante.',
    ingredients: [
      'Bebida premium incluida en presentación original',
      'Chocolate 70% naranja y limón',
      'Albaricoque 80 g',
      'Pistachos naturales 80 g',
      'Arándano seco 80 g',
      'Mermelada de frutos cítricos de 130 g'
    ],
    sensorialExperience: 'Herbal, cítrica y fresca, con espíritu de montaña.',
    imageUrl: 'assets/images/kuntur_andino.jpg',
    category: ProductCategory.PREMIUM,

    curatedLine:
      'Recomendado para: perfiles sobrios, regalos profesionales y reuniones discretas; limpieza aromática de montaña.',
    occasions: [
      'Regalo profesional / corporativo (elegante y seguro)',
      'Reunión selecta, sin excesos',
      'Agradecimiento formal',
      'Tarde de conversación sobria'
    ],
    affinity: {
      temperament: ['sobrio', 'preciso', 'minimalista', 'sereno'],
      palate: ['herbal', 'cítrico', 'fresco', 'limpio'],
      genderAffinity: 'Unisex (ligeramente masculino por perfil herbal)'
    },
    servingSuggestion:
      'Orden recomendado: bebida, chocolate cítrico; luego albaricoque; finalizar con mermelada cítrica para un cierre limpio.'
  },

  {
    id: '12',
    name: 'Pasión Andina',
    price: 371200,
    description:
      'Vino Malbec Las Moras La cordillera es fuerza, emoción y carácter. Pasión Andina expresa esa intensidad que nace de la altura y se siente en cada sorbo.',
    experience: 'Un combo honesto, profundo y lleno de expresión frutal.',
    ingredients: [
      'Vino Malbec Las Moras',
      'Chocolate 70% arándanos y sal rosada',
      'Albaricoque',
      'Nuez pecan',
      'Uva pasa rubia',
      'Mermelada de frutos rojos'
    ],
    sensorialExperience: 'Intensa, frutal y envolvente.',
    imageUrl: 'assets/images/pasion_andina.jpg',
    category: ProductCategory.PREMIUM,

    curatedLine:
      'Recomendado para: celebraciones de pareja, cenas y regalos con emoción; frutal intenso, elegante y envolvente.',
    occasions: [
      'Aniversario / pareja (cena, conversación)',
      'Cumpleaños con intención',
      'Regalo elegante sin excesiva solemnidad',
      'Celebración íntima con vino'
    ],
    affinity: {
      temperament: ['expresivo', 'emocional', 'cálido', 'sofisticado'],
      palate: ['frutal', 'intenso', 'envolvente', 'equilibrado'],
      genderAffinity: 'Unisex'
    },
    servingSuggestion:
      'Maridaje frutal: chocolate con arándanos y sal, luego albaricoque; cerrar con mermelada para reforzar el perfil de frutos rojos.'
  },

  {
    id: '13',
    name: 'Selva Nocturna',
    price: 373700,
    description:
      'Vino Cabernet Sauvignon Cuando la selva se sumerge en la noche, todo se vuelve más profundo.',
    experience: 'Selva Nocturna es contemplación, silencio y elegancia natural.',
    ingredients: [
      'Vino Cabernet Sauvignon',
      'Chocolate 70% con granos de café',
      'Dátiles',
      'Nuez de Brasil',
      'Arándano seco',
      'Mermelada de ciruela de 130 g'
    ],
    sensorialExperience: 'Sobria, oscura y estructurada.',
    imageUrl: 'assets/images/selva_nocturna.jpg',
    category: ProductCategory.PREMIUM,

    curatedLine:
      'Recomendado para: noches elegantes y paladares avanzados; estructura oscura, contemplativa y precisa.',
    occasions: [
      'Cena nocturna formal',
      'Regalo para persona sobria y exigente',
      'Celebración discreta (sin exhibición)',
      'After dinner contemplativo'
    ],
    affinity: {
      temperament: ['introspectivo', 'sobrio', 'culto', 'exigente'],
      palate: ['café', 'fruta oscura', 'estructura', 'largo final'],
      genderAffinity: 'Predominio masculino (unisex)'
    },
    servingSuggestion:
      'Ritual nocturno: chocolate con café, luego dátiles; finalizar con ciruela para un cierre oscuro y redondo.'
  },

  {
    id: '14',
    name: 'Parche Fino',
    price: 459000,
    description:
      'Chivas Regal 12 años, Un parche fino es ese encuentro donde la conversación fluye sin esfuerzo y el tiempo se vuelve secundario.',
    experience: 'Este combo celebra la amistad desde la elegancia y el equilibrio.',
    ingredients: [
      'Chivas Regal 12 años',
      'Chocolate 70% arándanos y pistacho',
      'Snack de frutos amarillos deshidratados',
      'Almendra natural',
      'Arándano seco',
      'Miel de abejas infusionada con canela de 250 g'
    ],
    sensorialExperience: 'Equilibrada y social, con dulzor especiado y textura natural.',
    imageUrl: 'assets/images/parche_fino.jpg',
    category: ProductCategory.PREMIUM,

    curatedLine:
      'Recomendado para: encuentros elegantes, amistad y regalos versátiles; equilibrio social con dulzor especiado.',
    occasions: [
      'Reunión social selecta / conversación',
      'Regalo a amigo, socio o colega cercano',
      'Celebración informal con estándar alto',
      'Agradecimiento elegante (sin solemnidad)'
    ],
    affinity: {
      temperament: ['social', 'equilibrado', 'urbano', 'elegante'],
      palate: ['frutal moderado', 'especiado fino', 'textura natural', 'armonía'],
      genderAffinity: 'Unisex'
    },
    servingSuggestion:
      'Orden recomendado: bebida, chocolate arándanos-pistacho; luego frutos/almendra; cerrar con miel y canela para un final cálido.'
  }
]);



  getProducts() {
    return this.products().map(product => this.sanitizeProduct(product));
  }

  getProductById(id: string): Product | undefined {
    if (!id || typeof id !== 'string') return undefined;

    const product = this.products().find(product => product.id === id);
    return product ? this.sanitizeProduct(product) : undefined;
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    if (!Object.values(ProductCategory).includes(category)) {
      return [];
    }

    return this.products()
      .filter(product => product.category === category)
      .map(product => this.sanitizeProduct(product));
  }

  private sanitizeProduct(product: Product): Product {
    const nameValidation = this.securityService.validateProductName(product.name);
    const priceValidation = this.securityService.validatePrice(product.price);

    if (!nameValidation.isValid || !priceValidation.isValid) {
      console.warn('[SECURITY] Product data validation failed:', {
        id: product.id,
        nameErrors: nameValidation.errors,
        priceErrors: priceValidation.errors
      });
    }

    return {
      ...product,
      name: nameValidation.sanitizedValue || 'Producto sin nombre',
      price: Number(priceValidation.sanitizedValue) || 0,
      description: this.securityService.sanitizeDescription(product.description),
      experience: this.securityService.sanitizeDescription(product.experience),
      sensorialExperience: this.securityService.sanitizeDescription(product.sensorialExperience),
      curatedLine: this.securityService.sanitizeDescription(product.curatedLine),
      servingSuggestion: this.securityService.sanitizeDescription(product.servingSuggestion),
      ingredients: product.ingredients.map(ingredient =>
        this.securityService.sanitizeInput(ingredient, 200)
      ),
      occasions: product.occasions.map(occasion =>
        this.securityService.sanitizeInput(occasion, 100)
      ),
      affinity: {
        temperament: product.affinity.temperament.map(temp =>
          this.securityService.sanitizeInput(temp, 50)
        ),
        palate: product.affinity.palate.map(palate =>
          this.securityService.sanitizeInput(palate, 50)
        ),
        genderAffinity: this.securityService.sanitizeInput(product.affinity.genderAffinity, 50)
      }
    };
  }

  formatPrice(price: number): string {
    const validation = this.securityService.validatePrice(price);

    if (!validation.isValid) {
      console.warn('[SECURITY] Price formatting failed:', validation.errors);
      return '$0';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(validation.sanitizedValue));
  }
}
