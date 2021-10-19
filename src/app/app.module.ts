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
import { AcmeScCookiesService } from './core/services/acme-sc-cookies.service';

//validators
import { WhiteSpaceValidator } from './core/validators/acme-sc-whitespace-validator';


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
  providers: [ AcmeSCAuthguradServiceService, AcmeSCAuthorizationService, 
    WhiteSpaceValidator, AcmeScCookiesService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
