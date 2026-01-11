import { Injectable, signal } from '@angular/core';
import { Product, ProductCategory } from '../models/catalog.models';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly products = signal<Product[]>([
    {
      id: '1',
      name: 'Kuntur Dorado',
      price: 524500,
      description: 'En las culturas andinas, el kuntur es el ave que habita las mayores alturas, símbolo de visión clara y conexión entre el cielo y la tierra. Kuntur Dorado representa ese vuelo amplio que desciende hacia los valles cálidos, donde los aromas cítricos se mezclan con la fruta y el aire se vuelve luminoso.',
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
      category: ProductCategory.PREMIUM
    },
    {
      id: '2',
      name: 'Sol Caribeño',
      price: 379500,
      description: 'El Caribe no solo se vive: se siente en la piel y se guarda en la memoria. Sol Caribeño rinde homenaje a la luz que madura la caña, al tiempo que transforma la bebida y a la dulzura natural de las tierras cálidas.',
      experience: 'Este combo evoca tardes doradas, calma tropical y un sabor que abraza sin prisa.',
      ingredients: [
        'Bebida premium incluida en presentación original',
        'Chocolate 70% con sal marina',
        'Snack de frutos amarillos deshidratados 30 g',
        'Almendra natural 80 g',
        'Maní natural 80 g',
        'Miel de abeja natural 250 g'
      ],
      sensorialExperience: 'Tropical, melosa y armoniosa, con un cierre suave y reconfortante.',
      imageUrl: 'assets/images/sol_caribeno.jpg',
      category: ProductCategory.CLASSIC
    },
    {
      id: '3',
      name: 'Zipa Real',
      price: 476500,
      description: 'El zipa era el gobernante del pueblo muisca, una figura de autoridad serena y equilibrio. Zipa Real honra ese liderazgo tranquilo, donde el poder no se impone, se reconoce.',
      experience: 'Un combo clásico, armonioso y sobrio, pensado para líderes quienes valoran la tradición bien ejecutada.',
      ingredients: [
        'Bebida premium incluida en presentación original',
        'Chocolate 70% maní, almendra y pistacho',
        'Snack de frutos amarillos deshidratados 30 g',
        'Marañón natural 80 g',
        'Almendra natural 80 g',
        'Mermelada de frutos rojos 130 g'
      ],
      sensorialExperience: 'Suave y elegante, con frutos secos nobles y un contraste frutal delicado.',
      imageUrl: 'assets/images/zipa_real.jpg',
      category: ProductCategory.PREMIUM
    },
    {
      id: '4',
      name: 'Magia Colombiana',
      price: 659900,
      description: 'Colombia es selva, cacao, madera y misterio. Magia Colombiana celebra esa profundidad que no se explica, se siente.',
      experience: 'Este combo es un ritual lento, elegante y envolvente, donde cada sabor acompaña a la bebida como parte de un hechizo ancestral.',
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
      category: ProductCategory.EXCLUSIVE
    },
    {
      id: '5',
      name: 'Mama Killa',
      price: 331300,
      description: 'La luna protege, envuelve y calma. Mama Killa es un homenaje a la dulzura, la ternura y el descanso del alma.',
      experience: 'Un combo cremoso y reconfortante, pensado como un abrazo nocturno.',
      ingredients: [
        'Bebida premium incluida en presentación original',
        'Chocolate 70% sal marina y caramelo',
        'Dátiles 80 g',
        'Almendra natural 80 g',
        'Uva pasa rubia 80 g',
        'Mermelada de frutos rojos 130 g'
      ],
      sensorialExperience: 'Dulce, sedosa y lunar, con notas suaves y envolventes.',
      imageUrl: 'assets/images/mama_killa.jpg',
      category: ProductCategory.CLASSIC
    },
    {
      id: '6',
      name: 'Raíz de Fuego',
      price: 713000,
      description: 'El fuego nace de la raíz. Este combo honra la energía ancestral del agave y la fuerza de la tierra.',
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
      imageUrl: 'assets/images/08.jpg',
      category: ProductCategory.EXCLUSIVE
    },
    {
      id: '7',
      name: 'Viejo Amigo',
      price: 470700,
      description: 'Hay sabores que siempre están. Viejo Amigo representa la confianza, la memoria y la tradición.',
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
      category: ProductCategory.CLASSIC
    },
    {
      id: '8',
      name: 'Zipa Supremo',
      price: 904300,
      description: 'Cuando el linaje alcanza su punto más alto, surge la excelencia. Zipa Supremo representa la madurez del poder, la profundidad del tiempo y el lujo que no necesita alzar la voz.',
      experience: 'Este combo está diseñado para paladares que saben reconocer la grandeza en los detalles.',
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
      category: ProductCategory.EXCLUSIVE
    },
    {
      id: '9',
      name: 'Ritual de Agave',
      price: 618700,
      description: 'Hay bebidas que no se toman con prisa, se honran. Ritual del Agave invita a detener el tiempo, a conectar con la tierra, con el origen y con el pulso sereno del agave reposado.',
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
      category: ProductCategory.PREMIUM
    },
    {
      id: '10',
      name: 'Killa Sagrada',
      price: 278850,
      description: 'La luna, killa, ha sido símbolo de lo sagrado y lo íntimo desde tiempos ancestrales. Killa Sagrada es un pequeño ritual personal, delicado y luminoso.',
      experience: 'Intimidad y conexión espiritual.',
      ingredients: [
        'Bebida premium incluida en presentación original',
        'Chocolate 70% naranja y limón',
        'Snack de frutos amarillos deshidratados 30 g',
        'Pistachos naturales 80 g',
        'Uva pasa rubia 80 g',
        'Mermelada de maracuyá'
      ],
      sensorialExperience: 'Luminosa, fresca y suavemente tropical.',
      imageUrl: 'assets/images/killa_sagrada.jpg',
      category: ProductCategory.CLASSIC
    },
    {
      id: '11',
      name: 'Kuntur Andino',
      price: 452500,
      description: 'En las alturas de la cordillera, el kuntur vuela con calma y precisión. Kuntur Andino representa pureza, visión y sobriedad.',
      experience: 'Un combo limpio, elevado y elegante.',
      ingredients: [
        'Bebida premium incluida en presentación original',
        'Chocolate 70% naranja y limón',
        'Albaricoque 80 g',
        'Pistachos naturales 80 g',
        'Arándano seco 80 g',
        'Mermelada de frutos cítricos 130 g'
      ],
      sensorialExperience: 'Herbal, cítrica y fresca, con espíritu de montaña.',
      imageUrl: 'assets/images/kuntur_andino.jpg',
      category: ProductCategory.PREMIUM
    }
  ]);

  getProducts() {
    return this.products();
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(product => product.id === id);
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.products().filter(product => product.category === category);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
