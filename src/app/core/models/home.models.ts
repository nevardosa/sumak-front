export interface FeatureCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
  readonly isExternal?: boolean;
}

export interface Testimonial {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly content: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly avatar?: string;
  readonly verified?: boolean;
}

export interface Stat {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly description?: string;
}

export interface HeroContent {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly primaryCta: {
    readonly text: string;
    readonly route: string;
  };
  readonly secondaryCta: {
    readonly text: string;
    readonly route: string;
  };
}

export interface AboutSection {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly ctaText: string;
  readonly ctaRoute: string;
  readonly imageAlt: string;
}

export type TestimonialNavigationDirection = 'next' | 'previous';

export interface HomeComponentState {
  readonly isLoading: boolean;
  readonly currentTestimonial: number;
  readonly isTestimonialAutoPlay: boolean;
}