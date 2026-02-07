import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CorporateSolutionCard } from './corporate-solutions.interface';
import { CORPORATE_SOLUTIONS_DATA } from './corporate-solutions.data';

@Component({
  selector: 'app-corporate-solutions-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './corporate-solutions-section.component.html',
  styleUrls: ['./corporate-solutions-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateSolutionsSectionComponent {
  readonly solutions: readonly CorporateSolutionCard[] = CORPORATE_SOLUTIONS_DATA;

  trackBySolution(index: number, solution: CorporateSolutionCard): string {
    return solution.id;
  }
}
