import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialWrapperModule } from './material-wrapper.module';

// services
import { AcmeSCHttpService } from '../../core/services/acme-sc-http.service';
import { HttpClient } from '@angular/common/http';

// components
import { AcmeSCMainHeaderComponent } from './components/main-header/acme-sc-main-header.component';
import { AcmeSCDialogHeaderComponent } from './components/dialog-header/acme-sc-dialog-header.component';
import { AcmeSCUserPopupComponent } from './components/user-popup/acme-sc-user-popup.component';
import { AcmeSCNavigationBarComponent } from './components/navigation-bar/acme-sc-navigation-bar.component';
import { AcmeSCCompanyHeaderComponent } from './components/company-header/acme-sc-company-header.component';
import { AcmeSCRoomSharedUsersListComponent } from './components/room-users-list/acme-sc-room-shared-users-list.component';
import { AcmeSCRoomSharedUserItemComponent } from './components/room-shared-user-item/acme-sc-room-shared-user-item';
import { AcmeSCServerErrorComponent } from './components/server-error/acme-sc-server-error.component';
import { AcmeSCInformationComponent } from './components/dialogs/information-dialog/acme-sc-information.component';

//dialogs
import { AcmeSCUserConfirmationComponent } from './components/dialogs/user-confirmation/acme-sc-user-confirmation.component';
import { AcmeSCShareRoomComponent } from './components/dialogs/share-room/acme-sc-share-room.component';
import { AcmeSCSessionExpiredComponent } from './components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSCContactinformationComponent } from './components/dialogs/contact-information/acme-sc-contact-information.component';

// third party
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

// localization
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    imports: [MaterialWrapperModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgScrollbarModule,
        CommonModule,
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useFactory: httpTranslateLoader,
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        AcmeSCMainHeaderComponent,
        AcmeSCCompanyHeaderComponent,
        AcmeSCDialogHeaderComponent,
        AcmeSCNavigationBarComponent,
        AcmeSCUserConfirmationComponent,
        AcmeSCShareRoomComponent,
        AcmeSCRoomSharedUsersListComponent,
        AcmeSCRoomSharedUserItemComponent,
        AcmeSCSessionExpiredComponent,
        AcmeSCContactinformationComponent,
        AcmeSCUserPopupComponent,
        AcmeSCServerErrorComponent,
        AcmeSCInformationComponent
    ],
    exports: [
        NgScrollbarModule,
        CommonModule,
        FlexLayoutModule,
        MaterialWrapperModule,
        FormsModule,
        ReactiveFormsModule,
        AcmeSCMainHeaderComponent,
        AcmeSCCompanyHeaderComponent,
        AcmeSCNavigationBarComponent,
        AcmeSCDialogHeaderComponent,
        AcmeSCUserConfirmationComponent,
        AcmeSCShareRoomComponent,
        AcmeSCRoomSharedUsersListComponent,
        AcmeSCRoomSharedUserItemComponent,
        AcmeSCSessionExpiredComponent,
        AcmeSCContactinformationComponent,
        AcmeSCUserPopupComponent,
        AcmeSCServerErrorComponent,
        AcmeSCInformationComponent,
        TranslateModule
    ],
    providers: [ AcmeSCHttpService ]
})

export class AcmeSCSharedModule { }

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }