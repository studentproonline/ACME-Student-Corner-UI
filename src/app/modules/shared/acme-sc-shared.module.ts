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

//dialogs
import { AcmeSCUserConfirmationComponent } from './components/dialogs/user-confirmation/acme-sc-user-confirmation.component';
import { AcmeSCShareRoomComponent } from './components/dialogs/share-room/acme-sc-share-room.component';
import { AcmeSCSessionExpiredComponent } from './components/dialogs/session-expired/acme-sc-session-expired.component';

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
        AcmeSCDialogHeaderComponent,
        AcmeSCUserConfirmationComponent,
        AcmeSCShareRoomComponent,
        AcmeSCSessionExpiredComponent,
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
        AcmeSCDialogHeaderComponent,
        AcmeSCUserConfirmationComponent,
        AcmeSCShareRoomComponent,
        AcmeSCSessionExpiredComponent,
        AcmeSCUserPopupComponent
    ],
    providers: [ AcmeSCHttpService ]
})

export class AcmeSCSharedModule { }