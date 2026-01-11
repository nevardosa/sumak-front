# SumakFront

Una aplicación Angular moderna construida con arquitectura limpia, Tailwind CSS y las mejores prácticas de desarrollo.

## 🚀 Características

- **Angular 19** - Última versión con standalone components
- **Tailwind CSS** - Framework CSS utilitario para diseño rápido
- **Arquitectura Limpia** - Separación clara de responsabilidades
- **TypeScript** - Tipado estático para mayor robustez
- **Reactive Forms** - Formularios reactivos con validación
- **JWT Authentication** - Sistema de autenticación seguro
- **HTTP Interceptors** - Manejo centralizado de peticiones
- **Route Guards** - Protección de rutas
- **Responsive Design** - Diseño adaptable a todos los dispositivos
- **PWA Ready** - Preparado para Progressive Web App

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios y funcionalidades centrales
│   │   ├── guards/           # Guards de rutas
│   │   ├── interceptors/     # Interceptores HTTP
│   │   ├── services/         # Servicios principales
│   │   ├── models/           # Interfaces y tipos
│   │   └── constants/        # Constantes de la aplicación
│   ├── shared/               # Componentes y utilidades compartidas
│   │   ├── components/       # Componentes reutilizables
│   │   ├── directives/       # Directivas personalizadas
│   │   ├── pipes/            # Pipes personalizados
│   │   └── utils/            # Utilidades
│   ├── features/             # Módulos de funcionalidades
│   │   ├── auth/             # Autenticación
│   │   ├── dashboard/        # Panel principal
│   │   └── profile/          # Perfil de usuario
│   ├── layout/               # Componentes de layout
│   │   └── components/       # Header, Footer, Sidebar
│   └── environments/         # Configuraciones de entorno
└── assets/                   # Recursos estáticos
```

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework**: Angular 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **HTTP Client**: Angular HttpClient
- **State Management**: Angular Signals
- **Forms**: Angular Reactive Forms
- **Routing**: Angular Router
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v19 o superior)

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd SumakFront
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Revisar `src/environments/environment.ts`
   - Configurar URLs de API según el entorno

4. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   - Navegar a `http://localhost:4200`

## 📜 Scripts Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run build:prod` - Construir optimizado para producción
- `npm test` - Ejecutar pruebas unitarias
- `npm run test:coverage` - Ejecutar pruebas con cobertura
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código con Prettier
- `npm run format:check` - Verificar formato del código

## 🏗️ Arquitectura

### Core Layer
Contiene la lógica de negocio central, servicios, modelos e interceptores.

### Shared Layer
Componentes, directivas y utilidades reutilizables en toda la aplicación.

### Features Layer
Módulos de funcionalidades específicas organizados por dominio.

### Layout Layer
Componentes de estructura y navegación de la aplicación.

## 🔐 Autenticación

El sistema de autenticación incluye:
- Login/Register con validación
- JWT token management
- Refresh token automático
- Route guards para protección
- Interceptores para headers automáticos

## 🎨 Diseño

- **Design System**: Basado en Tailwind CSS
- **Componentes**: Reutilizables y consistentes
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Cumple estándares WCAG
- **Dark Mode**: Preparado para tema oscuro

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

- **Unit Tests**: Jasmine + Karma
- **E2E Tests**: Preparado para Cypress
- **Coverage**: Reportes de cobertura incluidos

## 🚀 Deployment

### Desarrollo
```bash
npm run build
```

### Producción
```bash
npm run build:prod
```

## 📈 Performance

- **Lazy Loading**: Carga diferida de módulos
- **OnPush Strategy**: Optimización de change detection
- **Tree Shaking**: Eliminación de código no utilizado
- **Bundle Analysis**: Análisis de tamaño de bundles
- **Service Workers**: Preparado para PWA

## 🔧 Configuración de Desarrollo

### VS Code Extensions Recomendadas
- Angular Language Service
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

### Git Hooks
- **Pre-commit**: Formateo automático y linting
- **Pre-push**: Ejecución de tests

## 📚 Documentación Adicional

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para la feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- Angular Team por el excelente framework
- Tailwind CSS por el sistema de diseño
- Comunidad open source por las herramientas utilizadas