import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcmeSCLoginComponent } from './components/login/acme-sc-login.component';
import { AcmeSCUserActivationComponent } from './components/activation/acme-sc-user-activation.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCLoginComponent

    },
    {
        path: 'activation',
        component: AcmeSCUserActivationComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCLoginRoutingModule {

}