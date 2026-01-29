import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WhatsappButtonComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'SumakFront';
}
