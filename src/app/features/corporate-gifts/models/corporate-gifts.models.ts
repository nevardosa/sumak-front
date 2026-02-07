export interface CorporateSegment {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface CorporateDifferentiator {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface CorporateStep {
  readonly number: number;
  readonly title: string;
  readonly description: string;
}

export interface CorporateStat {
  readonly value: string;
  readonly label: string;
}
