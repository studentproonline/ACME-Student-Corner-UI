import { Component } from '@angular/core';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { Router } from '@angular/router';

// services
import { AcmeSCAchievementsService } from '../../services/acme-sc-achievements.service';

// Entities 
import { IAchievementsEntity } from '../../entities/achievements.entity';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

@Component({
    selector: 'acme-sc-achievement-home-page',
    templateUrl: './acme-sc-achievement-home-page.component.html',
    styleUrls: ['./acme-sc-achievement-home-page.component.scss']
})
export class AcmeSCAchievementMainPageComponent {

    topicsPostedData: any = [
    ];
    topicsUserLevelMessage;
    topicsMax;
    topicsBadgesEarned;
    showSearchBox = false;
    topicsChartTitle = 'Toal topics posted';

    commentsPostedData: any = [
    ];
    commentsUserLevelMessage;
    commentsMax;
    commentsBadgesEarned;
    commentsChartTitle = 'Total comments posted';

    thumbsUpdData: any = [
    ];
    thumbsUpUserLevelMessage;
    thumbsUpMax;
    thumbsUpBadgesEarned;
    thumbsUpChartTitle = 'Total Likes';


    thumbsDowndData: any = [
    ];


    isProgress = false;
    isSuccessFull = false;
    achievementsResponseMessage = '';
    
    loginEntity: ILoginEntity;
    nickName: string;
    fullName: string;



    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCAchievementsService: AcmeSCAchievementsService,
        private router: Router) {
        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);
        this.getAchievmentData();
    }

    gotoRooms() {
        this.router.navigateByUrl('/home?roomType=My Rooms');
    }

    getAchievmentData() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCAchievementsService.getAchievements(this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                let achievementData: IAchievementsEntity = response.data;
                this.constructAchievementData(achievementData);
                this.isProgress = false;
                this.isSuccessFull = true;
            },
            err => {
                this.isProgress = false; // end progress
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.achievementsResponseMessage = err.error.description;
                } else {
                    this.achievementsResponseMessage = 'Server Error';
                }
            }
        );
    }

    constructAchievementData(achievementsEntity: IAchievementsEntity) {
        this.constructTopicsPostedData(achievementsEntity);
        this.constructCommentsPostedData(achievementsEntity);
        this.constructThumbsUpdData(achievementsEntity);
        //this.constructThumbsDowndData(achievementsEntity);
    }

    constructTopicsPostedData(achievementsEntity: IAchievementsEntity) {
        let topicPosted: any = [];

        topicPosted.push('Topics');
        topicPosted.push(achievementsEntity.totalTopicsPost);
        this.topicsPostedData.push(topicPosted);
        let data = this.calculateNextBadgeData(achievementsEntity.totalTopicsPost, 20);
        this.topicsMax = data.max;
        this.topicsBadgesEarned = data.badgeEarned;
        this.topicsUserLevelMessage = data.remainingToAchiveBadge + " topic left to be posted to achieve new badge."
    }

    constructCommentsPostedData(achievementsEntity: IAchievementsEntity) {
        let commentsPosted: any = [];

        commentsPosted.push('Comments');
        commentsPosted.push(achievementsEntity.totalCommentsPost);
        this.commentsPostedData.push(commentsPosted);
        const data = this.calculateNextBadgeData(achievementsEntity.totalCommentsPost, 20);
        this.commentsMax = data.max;
        this.commentsBadgesEarned = data.badgeEarned;
        this.commentsUserLevelMessage = data.remainingToAchiveBadge + " comments left to be posted to achieve new badge."
    }

    constructThumbsUpdData(achievementsEntity: IAchievementsEntity) {
        let thumbsUpRecieved: any = [];
        thumbsUpRecieved.push('ThumbsUp');
        thumbsUpRecieved.push(achievementsEntity.thumbsUpvoteRecieved);
        this.thumbsUpdData.push(thumbsUpRecieved);
        const data = this.calculateNextBadgeData(achievementsEntity.thumbsUpvoteRecieved, 20);
        this.thumbsUpMax = data.max;
        this.thumbsUpBadgesEarned = data.badgeEarned;
        this.thumbsUpUserLevelMessage = data.remainingToAchiveBadge + " likes left to be recieved to achieve new badge."
    }

    constructThumbsDowndData(achievementsEntity: IAchievementsEntity) {
        let thumbsDownRecieved: any = [];
        thumbsDownRecieved.push('ThumbsDown');
        thumbsDownRecieved.push(achievementsEntity.thumbsDownvoteRecieved);
        this.thumbsUpdData.push(thumbsDownRecieved);
    }

    calculateNextBadgeData(totalCount, badgeSlabNumber) {
        let data: any = {};
        let remainingToAchiveBadge;
        if (totalCount < badgeSlabNumber) {
            this.topicsMax = badgeSlabNumber;
            data.badgeEarned = 0
            data.max = badgeSlabNumber;
            remainingToAchiveBadge = badgeSlabNumber - totalCount;

        } else {
            let quotient = Math.floor(totalCount / badgeSlabNumber);
            let remainder = totalCount % badgeSlabNumber;
            data.badgeEarned = quotient;
            data.max = badgeSlabNumber * (quotient + 1);
            remainingToAchiveBadge = (((badgeSlabNumber * (quotient + 1) - remainder)) - (badgeSlabNumber * quotient));
        }
        data.remainingToAchiveBadge = remainingToAchiveBadge;
        return data;
    }
}
