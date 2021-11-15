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
    showUserPopup: any= false;
    rightClickMenuPositionX: number;
    rightClickMenuPositionY: number;

    constructor(private formBuilder: FormBuilder, 
        private acmeScCookiesService: AcmeScCookiesService, private router: Router) {
        this.searchFormGroup = this.formBuilder.group({
            searchControl: ['']
        });
        this.searchFormGroup.get("searchControl").valueChanges.subscribe(x => {
            this.searchTextchange.emit(x);
        })
    }

    nickNameClicked(event): void {
        this.userNameClicked.emit();
        this.showUserPopup= true;
        this.rightClickMenuPositionX = event.clientX;
        this.rightClickMenuPositionY = event.clientY;
    }

    // close popup event 
    closePopup() {
        this.showUserPopup= false;
    }

    getRightClickMenuStyle() {
        return {
            position: 'absolute',
            left: `${this.rightClickMenuPositionX-400}px`,
            top: `${this.rightClickMenuPositionY+10}px`,
            height: '200px',
            width: '400px',
            'z-index': '100'
          }
    }

    logout() {
       this.acmeScCookiesService.deleteCookies();
       this.router.navigateByUrl("/login");
    }
}
