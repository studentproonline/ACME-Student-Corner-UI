import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ACME-Student-Corner';
  showCreateReport = false;
  constructor(public translateService: TranslateService) {
    translateService.addLangs(['en', 'hn', 'kn']);
    let language = sessionStorage.getItem('language');
    if (language) {
      this.translateService.setDefaultLang(language);
    } else {
      translateService.setDefaultLang('en');
    }
  }
}
