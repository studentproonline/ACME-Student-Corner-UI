import { Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'acme-sc-navigation-sidebar',
    templateUrl: './acme-sc-navigation-sidebar.component.html',
    styleUrls: ['./acme-sc-navigation-sidebar.component.scss']
})
export class AcmeSCNavigationSidebarComponent {

    @Output() navigationItemSelected = new EventEmitter<string>();

    navigationItemsList: any[]=[];
    constructor() {
        this.constructNavigationItemsList();
    }

    constructNavigationItemsList() {
        this.addtNavigationItem('My Rooms','home', true);
        this.addtNavigationItem('Achievements','auto_awesome', false);
        this.addtNavigationItem('Recent','update', false);
        this.addtNavigationItem('Favorites','favorite border', false);
        this.addtNavigationItem('Shared with Me','people alt', false);

    }
    
    addtNavigationItem(itemName: string, itemIcon: string,selected: boolean) {
        let navigationItem: any={};
        navigationItem.name=itemName;
        navigationItem.icon=itemIcon;
        navigationItem.selected=selected;
        this.navigationItemsList.push(navigationItem);
    }

    updateSelection(itemName: string) {
        for (let navigationItem of this.navigationItemsList) {
            if(navigationItem.name === itemName) {
                navigationItem.selected=true;
            } else {
                navigationItem.selected=false;
            }
        }
    }

    navigationItemClicked($event){
        console.log($event);
        this.updateSelection($event)
        this.navigationItemSelected.emit($event);
    }
}