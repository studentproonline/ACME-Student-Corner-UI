import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'acme-sc-main-header',
    templateUrl: './acme-sc-main-header.component.html',
    styleUrls: ['./acme-sc-main-header.component.scss']
})
export class AcmeSCMainHeaderComponent {
    @Input() userNickName = '';
    @Input() userFullName = '';
    @Output() userNameClicked = new EventEmitter();
    @Output() searchTextchange = new EventEmitter<string>();

    searchFormGroup: any;

    constructor(private formBuilder: FormBuilder) {
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

}