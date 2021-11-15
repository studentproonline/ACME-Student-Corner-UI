import { Component, Input } from '@angular/core';

@Component({
    selector: 'acme-sc-achievement-card',
    templateUrl: './acme-sc-achievement-card.component.html',
    styleUrls: ['./acme-sc-achievement-card.component.scss']
})
export class AcmeSCAchievementCardComponent  {

    @Input() data: any
    @Input() min: any
    @Input() max: any
    @Input() chartTitle: any
    @Input() chartHeading: any
    @Input() color: any
    @Input() userLevelMessage: any
    @Input() badgesEarned: any
    @Input() iconName: any
}