import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCAchievementMainPageComponent } from './components/achievement-home-page/acme-sc-achievement-home-page.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCAchievementMainPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCAchievementsRoutingModule {
}