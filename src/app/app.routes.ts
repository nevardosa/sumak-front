import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';
import { RegisterComponent } from './features/auth/components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'regalos-corporativos',
        loadComponent: () => import('./features/corporate-gifts/corporate-gifts.component').then(m => m.CorporateGiftsComponent)
      },
      {
        path: 'experiencias',
        loadComponent: () => import('./features/experiences/experiences.component').then(m => m.ExperiencesComponent)
      },
      {
        path: 'cotizacion-corporativa',
        loadComponent: () => import('./features/corporate-quote/corporate-quote.component').then(m => m.CorporateQuoteComponent)
      },
      {
        path: 'politica-tratamiento-datos',
        loadComponent: () => import('./features/legal/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
      },
      // Admin routes - protected
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
