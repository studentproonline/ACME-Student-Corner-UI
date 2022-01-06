import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AcmeSCThemingService } from  './modules/shared/services/acme-sc-theming.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ACME-Student-Corner';
  showCreateReport = false;
  constructor(public translateService: TranslateService, private acmeSCThemingService: AcmeSCThemingService) {
    translateService.addLangs(['en', 'hn', 'kn']);
    let language = sessionStorage.getItem('language');
    if (language) {
      this.translateService.setDefaultLang(language);
    } else {
      translateService.setDefaultLang('en');
    }
    this.acmeSCThemingService.setTheme('light-theme');
  }
}
