import { Component, Input, ElementRef,HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'acme-sc-conference-room-self-view',
    templateUrl: './acme-sc-conference-room-self-view.component.html',
    styleUrls: ['./acme-sc-conference-room-self-view.component.scss']
})
export class AcmeSCConferenceRoomSelfViewComponent {
    @Input() localCallId: any;
    @Input() userName: any;
    startDrag: boolean;
    topStart:number=0;
    leftStart:number=0;

    @ViewChild('viewcard', {static: false, read: ElementRef}) viewCard: ElementRef;
    // @ViewChild('viewCard') viewCard!: ElementRef;
    //ViewChildren('viewCard') viewCard: any;

    constructor(public element: ElementRef)
    {

    }

    ngAfterViewInit(){
        console.log(this.viewCard);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (event.button === 2)
            return; // prevents right click drag, remove his if you don't want it
       
        this.topStart = event.clientY - this.viewCard.nativeElement.offsetTop;
        this.leftStart = event.clientX - this.viewCard.nativeElement.offsetLeft;
        this.startDrag = true;
     }


    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.startDrag) {
            this.viewCard.nativeElement.style.top = (event.clientY - this.topStart) + 'px';
            this.viewCard.nativeElement.style.left = (event.clientX - this.leftStart) + 'px';
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        this.startDrag = false;
    }
}