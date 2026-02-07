import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CorporateSolutionsSectionComponent } from './corporate-solutions-section.component';
import { CORPORATE_SOLUTIONS_DATA } from './corporate-solutions.data';

describe('CorporateSolutionsSectionComponent', () => {
  let component: CorporateSolutionsSectionComponent;
  let fixture: ComponentFixture<CorporateSolutionsSectionComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateSolutionsSectionComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CorporateSolutionsSectionComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render H2 with correct text', () => {
    const h2 = compiled.querySelector('h2');
    expect(h2?.textContent?.trim()).toContain('Soluciones corporativas para reconocimientos con significado');
  });

  it('should render subtitle', () => {
    const subtitle = compiled.querySelector('p');
    expect(subtitle?.textContent?.trim()).toContain('Propuestas premium para empresas');
  });

  it('should render 3 solution cards', () => {
    const cards = compiled.querySelectorAll('article.corporate-card');
    expect(cards.length).toBe(3);
  });

  it('should render card titles correctly', () => {
    const titles = compiled.querySelectorAll('.corporate-card__title');
    expect(titles.length).toBe(3);
    expect(titles[0].textContent?.trim()).toBe('Reconocimiento médico');
    expect(titles[1].textContent?.trim()).toBe('Equipos y talento humano');
    expect(titles[2].textContent?.trim()).toBe('Relaciones institucionales');
  });

  it('should render CTA button with correct routerLink', () => {
    const cta = compiled.querySelector('a.corporate-cta');
    expect(cta).toBeTruthy();
    expect(cta?.getAttribute('href')).toBe('/regalos-corporativos');
    expect(cta?.textContent?.trim()).toContain('Cotizar regalo corporativo');
  });

  it('should have proper accessibility attributes', () => {
    const section = compiled.querySelector('section');
    const h2 = compiled.querySelector('h2');
    
    expect(section?.getAttribute('aria-labelledby')).toBe('corporate-solutions-heading');
    expect(h2?.getAttribute('id')).toBe('corporate-solutions-heading');
  });

  it('should have aria-label on CTA', () => {
    const cta = compiled.querySelector('a.corporate-cta');
    expect(cta?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should use trackBy function', () => {
    const solution = CORPORATE_SOLUTIONS_DATA[0];
    const result = component.trackBySolution(0, solution);
    expect(result).toBe(solution.id);
  });

  it('should have readonly solutions data', () => {
    expect(component.solutions).toBe(CORPORATE_SOLUTIONS_DATA);
    expect(component.solutions.length).toBe(3);
  });
});
