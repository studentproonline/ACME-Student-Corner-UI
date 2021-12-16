import { NgModule } from '@angular/core';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCLoginRoutingModule } from './acme-sc-login-routing.module';
import { AcmeSCLoginComponent } from './components/login/acme-sc-login.component';
import { AcmeSCUserActivationComponent } from './components/activation/acme-sc-user-activation.component';

// dialogs
import { AcmeSCCreateAccountComponent } from './dialogs/acme-sc-create-account/acme-sc-create-account.component';
import { AcmeSCActivateAccountComponent} from './dialogs/acme-sc-activate-account/acme-sc-activate-account.component';
import { AcmeSCAccountPasswordResetComponent } from './dialogs/acme-sc-account-password-reset/acme-sc-account-password-reset';

//services
import { AcmeSCAccountService } from './services/acme-sc-user-account.service';
import { AcmeSCLoginService } from './services/acme-sc-login.service';
import { AcmesharedUiTuilitiesService} from '../shared/services/acme-sc-ui-utiltities.services';

import { TranslateService } from '@ngx-translate/core';

@NgModule({
    declarations: [AcmeSCLoginComponent,
        AcmeSCCreateAccountComponent,
        AcmeSCActivateAccountComponent,
        AcmeSCUserActivationComponent,
        AcmeSCAccountPasswordResetComponent],
    imports: [
        AcmeSCSharedModule,
        AcmeSCLoginRoutingModule,

    ],
    providers: [ AcmeSCAccountService, AcmeSCLoginService, AcmesharedUiTuilitiesService, TranslateService ],
    entryComponents: []
})
export class AcmeStudentCornerLoginModule { }