import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AcmeScCookiesService } from '../../../../core/services/acme-sc-cookies.service';

@Component({
    selector: 'acme-sc-main-header',
    templateUrl: './acme-sc-main-header.component.html',
    styleUrls: ['./acme-sc-main-header.component.scss']
})
export class AcmeSCMainHeaderComponent {
    @Input() userNickName = '';
    @Input() userFullName = '';
    @Input() placeHolder = '';
    @Output() userNameClicked = new EventEmitter();
    @Output() searchTextchange = new EventEmitter<string>();

    searchFormGroup: any;

    constructor(private formBuilder: FormBuilder, 
        private acmeScCookiesService: AcmeScCookiesService, private router: Router) {
        this.searchFormGroup = this.formBuilder.group({
            searchControl: ['']
        });
        this.searchFormGroup.get("searchControl").valueChanges.subscribe(x => {
            this.searchTextchange.emit(x);
        })
    }

    nickNameClicked(): void {
        this.userNameClicked.emit();
    }

    logout() {
       this.acmeScCookiesService.deleteCookies();
       this.router.navigateByUrl("/login");
    }
}
