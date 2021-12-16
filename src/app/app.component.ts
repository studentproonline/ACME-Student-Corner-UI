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
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'hn']);
    translate.setDefaultLang('en');
  }
}
