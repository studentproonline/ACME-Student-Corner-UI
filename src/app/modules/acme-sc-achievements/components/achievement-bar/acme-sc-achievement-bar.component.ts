import { Component, Input, OnInit } from '@angular/core';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

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
    chartBackgroundColor;
    chartTextColor;
    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService) {
     
    }

    ngOnInit() {

        if(this.acmeSCAuthorizationService.uiTheme === 'dark-theme') {
            this.chartBackgroundColor = '#333333';
            this.chartTextColor = 'white';
          } else{
            this.chartBackgroundColor = 'white';
            this.chartTextColor = 'black';
        }
        this.createChartoptions();
    }

    createChartoptions() {
        this.options = {
            title: this.chartHeading,
            height:154,
            chartArea: { height: '54'},
            legend: {position: 'none'},
            colors: [this.color],
            backgroundColor: this.chartBackgroundColor,
            titleTextStyle: {
                bold: true,
                fontSize: 12,
                color: this.chartTextColor
            },
            hAxis: {
                title: this.chartTitle,
                minValue: this.min,
                maxValue: this.max,
                format: 0,
                textStyle: {
                    bold: true,
                    fontSize: 12,
                    color: this.chartTextColor
                },
                titleTextStyle: {
                    bold: true,
                    fontSize: 12,
                    color: this.chartTextColor
                }
            }
        };
    }
}
