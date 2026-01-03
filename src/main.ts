import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

export const APP_CONFIG: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch())],
};

void bootstrapApplication(App, APP_CONFIG);
