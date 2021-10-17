import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';

// services
import { AcmeSCAuthguradServiceService } from './core/guards/acme-sc-authentication.guard.service';
import { AcmeSCAuthorizationService } from './core/services/acme-sc-authorization.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [ AcmeSCAuthguradServiceService, AcmeSCAuthorizationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
