import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'acme-sc-achievement-bar',
    templateUrl: './acme-sc-achievement-bar.component.html',
    styleUrls: ['./acme-sc-achievement-bar.component.scss']
})
export class AcmeSCAchievementBarComponent  implements OnInit {
    @Input() data: any
    @Input() min: any
    @Input() max: any
    @Input() chartTitle: any
    @Input() chartHeading: any
    @Input() color: any

    options: any;
    type = 'BarChart';
    constructor() {
      
    }

    ngOnInit() {
        this.createChartoptions();
    }

    createChartoptions() {
        this.options = {
            title: this.chartHeading,
            height:154,
            chartArea: { height: '54'},
            legend: {position: 'none'},
            colors: [this.color],
            hAxis: {
                title: this.chartTitle,
                minValue: this.min,
                maxValue: this.max,
                format: 0,
                textStyle: {
                    bold: true,
                    fontSize: 12,
                    color: '#4d4d4d'
                },
                titleTextStyle: {
                    bold: true,
                    fontSize: 12,
                    color: '#4d4d4d'
                }
            }
        };
    }
}
