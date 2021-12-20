import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCAchievementsRoutingModule } from './acme-sc-achievements-routing.module';

//components
import { AcmeSCAchievementMainPageComponent } from './components/achievement-home-page/acme-sc-achievement-home-page.component';
import { AcmeSCAchievementBarComponent } from './components/achievement-bar/acme-sc-achievement-bar.component';
import { AcmeSCAchievementCardComponent } from './components/achievement-card/acme-sc-achievement-card.component';

//services
import { AcmeSCAchievementsService } from './services/acme-sc-achievements.service';
import { AcmesharedUiTuilitiesService } from '../shared/services/acme-sc-ui-utiltities.services';

// Google chart
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
    declarations: [AcmeSCAchievementMainPageComponent,
        AcmeSCAchievementBarComponent,
        AcmeSCAchievementCardComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCAchievementsRoutingModule,
        GoogleChartsModule],

    providers: [AcmeSCAchievementsService, AcmesharedUiTuilitiesService],

    entryComponents: []
})
export class AcmeStudentCornerAchievementsModule {
}