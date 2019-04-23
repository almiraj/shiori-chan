import { Component,  NgZone, OnInit, Input, ViewChild, ElementRef, ContentChild, Directive } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { FormControl } from '@angular/forms';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { Plan } from '../entity/plan';
import { Schedule } from '../entity/schedule';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { LatLng } from '../entity/lat-lng';

@Component({
  selector: 'app-map-inner-direction',
  template: ''
})
export class MapDirectionInnerComponent implements OnInit {
  @Input() schedule: Schedule;

  constructor(
    private googleMapsAPIWrapper: GoogleMapsAPIWrapper,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    const latLngList = this.schedule.getLatLngList();
    if (latLngList.length < 2) {
      return;
    }
    const origin = latLngList[0].toLocation();
    const destination = latLngList[latLngList.length - 1].toLocation();

    const waypoints = new Array<google.maps.DirectionsWaypoint>();
    for (let i = 1; i < latLngList.length - 1; i++) {
      waypoints.push({ location: latLngList[i].toLocation(), stopover: true });
    }

    this.googleMapsAPIWrapper.getNativeMap().then(map => {
      this.ngZone.run(() => {
        // this.latitude = 41.85;
        // this.longitude = -87.65;
        // this.zoom = 6;
        const directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(<any>map);

        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      });
    });
  }
}

@Component({
  selector: 'app-map-direction',
  template: `
    <agm-map *ngIf="existsRoutes" id="gmap" [scrollwheel]="false">
      <app-map-inner-direction [schedule]="schedule"></app-map-inner-direction>
    </agm-map>
    <div *ngIf="!existsRoutes" id="empty-map">
      スケジュールに位置情報を2つ以上登録すると、ここに旅のルートが表示されます。
    </div>
  `,
  styles: [`
    agm-map, #empty-map { height: 60vh; }
    #empty-map { text-align: center; padding-top: 29vh; }
  `]
})
export class MapDirectionComponent implements OnInit {
  @Input() schedule: Schedule;
  existsRoutes = false;

  ngOnInit() {
    const latLngList = this.schedule.getLatLngList();
    if (latLngList.length >= 2) {
      this.existsRoutes = true;
    }
  }
}
