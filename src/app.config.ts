import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, provideAppInitializer } from '@angular/core';
import Aura from '@primeuix/themes/aura';
import { appRoutes } from './app.routes';
import { LayoutService } from '@/layout/service/layout.service';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { errorInterceptor } from '@/core/interceptors/error-interceptor';
import { SessionService } from '@/core/services/session-service';
import { headersInterceptor } from '@/core/interceptors/headers-interceptor';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEnvironmentNgxLoaderIndicator } from 'ngx-loader-indicator';
import { ConfirmationService, MessageService } from 'primeng/api';

registerLocaleData(localePT, 'pt-BR');

const isDarkMode = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const appConfig: ApplicationConfig = {
  providers: [
    SessionService,
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    provideAppInitializer(() => {
      const layoutService = inject(LayoutService);
      layoutService.layoutConfig.update((state) => ({
        ...state,
        darkTheme: isDarkMode()
      }));
    }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, errorInterceptor])),
    provideAnimations(),
    provideAnimationsAsync(),
    provideEnvironmentNgxLoaderIndicator({
      img: 'https://i.giphy.com/L05HgB2h6qICDs5Sms.webp',
      loaderStyles: {
        background: 'rgba(0, 0, 0, 0.8)'
      },
      imgStyles: {
        width: '50px'
      }
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' }
      }
    }),
    provideEnvironmentNgxMask()
  ]
};
