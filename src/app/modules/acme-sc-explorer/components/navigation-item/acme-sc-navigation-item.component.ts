import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'acme-sc-navigation-item',
    templateUrl: './acme-sc-navigation-item.component.html',
    styleUrls: ['./acme-sc-navigation-item.component.scss']
})
export class AcmeSCNavigationItemComponent {
    @Input() itemName = '';
    @Input() iconName ='';
    @Input() public selected: boolean =false;

    @Output() itemClicked = new EventEmitter<string>();

    constructor() {

    }
    
    navigationItemClicked() {
        this.itemClicked.emit(this.itemName);
    }
}