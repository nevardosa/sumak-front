import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocialLinksComponent } from '../../../shared/components/social-links/social-links.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, SocialLinksComponent],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  appName = environment.appName;
  version = environment.version;
  currentYear = new Date().getFullYear();
}