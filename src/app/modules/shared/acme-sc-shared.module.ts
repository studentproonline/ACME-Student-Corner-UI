import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialWrapperModule } from './material-wrapper.module';

// services
import { AcmeSCHttpService } from '../../core/services/acme-sc-http.service';

// components
import { AcmeSCMainHeaderComponent } from './components/main-header/acme-sc-main-header.component';
import { AcmeSCDialogHeaderComponent } from './components/dialog-header/acme-sc-dialog-header.component';
import { AcmeSCUserPopupComponent } from './components/user-popup/acme-sc-user-popup.component';
import { AcmeSCNavigationBarComponent } from './components/navigation-bar/acme-sc-navigation-bar.component';
import { AcmeSCCompanyHeaderComponent } from './components/company-header/acme-sc-company-header.component';

//dialogs
import { AcmeSCUserConfirmationComponent } from './components/dialogs/user-confirmation/acme-sc-user-confirmation.component';
import { AcmeSCShareRoomComponent } from './components/dialogs/share-room/acme-sc-share-room.component';
import { AcmeSCSessionExpiredComponent } from './components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSCContactinformationComponent } from './components/dialogs/contact-information/acme-sc-contact-information.component';

// third party
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

@NgModule({
    imports: [MaterialWrapperModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgScrollbarModule,
        CommonModule
    ],
    declarations: [
        AcmeSCMainHeaderComponent,
        AcmeSCCompanyHeaderComponent,
        AcmeSCDialogHeaderComponent,
        AcmeSCNavigationBarComponent,
        AcmeSCUserConfirmationComponent,
        AcmeSCShareRoomComponent,
        AcmeSCSessionExpiredComponent,
        AcmeSCContactinformationComponent,
        AcmeSCUserPopupComponent
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
        AcmeSCSessionExpiredComponent,
        AcmeSCContactinformationComponent,
        AcmeSCUserPopupComponent
    ],
    providers: [ AcmeSCHttpService ]
})

export class AcmeSCSharedModule { }