import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  readonly whatsappNumber = '573208663691';
  readonly email = 'suumak25@gmail.com';

  readonly contactMethods = [
    {
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      title: 'Correo Electrónico',
      value: 'suumak25@gmail.com',
      link: 'mailto:suumak25@gmail.com',
      description: 'Escríbenos para pedidos al por mayor'
    },
    {
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      title: 'WhatsApp',
      value: '+57 320 866 3691',
      link: `https://wa.me/573208663691?text=Hola, me interesa información sobre pedidos al por mayor`,
      description: 'Atención inmediata para pedidos especiales'
    }
  ];
}
