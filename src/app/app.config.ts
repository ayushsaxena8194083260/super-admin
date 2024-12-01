import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthGuard } from './auth/authGuard';
import { AuthService } from './auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide routing with component input bindings
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    // Enable client-side hydration (useful for SSR)
    provideClientHydration(),
    provideHttpClient(),
    provideToastr(),
    // Provide charts functionality using ng2-charts with default registerables
    provideCharts(withDefaultRegisterables()),
    AuthGuard,AuthService, provideAnimationsAsync()
  ]
};
