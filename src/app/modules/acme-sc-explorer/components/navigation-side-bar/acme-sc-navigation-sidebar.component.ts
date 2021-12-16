import { Component, Output, EventEmitter} from '@angular/core';
//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-navigation-sidebar',
    templateUrl: './acme-sc-navigation-sidebar.component.html',
    styleUrls: ['./acme-sc-navigation-sidebar.component.scss']
})
export class AcmeSCNavigationSidebarComponent {

    @Output() navigationItemSelected = new EventEmitter<string>();

    navigationItemsList: any[]=[];
    constructor(private translateService: TranslateService) {
        this.constructNavigationItemsList();
    }

    constructNavigationItemsList() {
        this.addtNavigationItem(this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_MY_HOME'),'home', true);
        this.addtNavigationItem(this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_SHARED_WITH_ME'),'people alt', false);
        this.addtNavigationItem(this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_FAVORITES'),'favorite border', false);
        this.addtNavigationItem(this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_RECENT'),'update', false);
        this.addtNavigationItem(this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_ACHIEVEMENTS'),'auto_awesome', false);
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