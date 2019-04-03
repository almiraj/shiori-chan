import { Component,  NgZone, OnInit, Input, ViewChild, ElementRef, ContentChild, Directive } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { FormControl } from '@angular/forms';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { Plan } from '../entity/plan';

@Component({
  selector: 'app-map-inner-direction',
  template: ''
})
export class MapDirectionInnerComponent implements OnInit {
  _plan: Plan;
  latitude: number;
  longitude: number;
  searchControl: FormControl;
  zoom = 17;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private googleMapsAPIWrapper: GoogleMapsAPIWrapper,
    private ngZone: NgZone,
  ) {}

  @Input()
  set place(plan: Plan) { this._plan = plan; }
  get place(): Plan { return this._plan; }

  ngOnInit() {
    this.googleMapsAPIWrapper.getNativeMap().then(map => {
      this.ngZone.run(() => {
        this.latitude = 41.85;
        this.longitude = -87.65;
        this.zoom = 6;
        const directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(<any>map);

        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: 'Halifax, NS',
          destination: 'Los Angeles, CA',
          waypoints: [{ location: 'montreal quebec', stopover: true }, { location: 'chicago, il', stopover: true }],
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
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
    <agm-map id="gmap" [latitude]="latitude" [longitude]="longitude" [scrollwheel]="false" [zoom]="zoom">
      <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
      <app-map-inner-direction></app-map-inner-direction>
    </agm-map>
  `,
  styles: [`
    agm-map { height: 200px; z-index: 5000; }
    #autocomplete { position: absolute; top: 1em; z-index: 2; width: 80%; margin: 0 10%; }
    #autocomplete input { width: 100%; font-size: 1.2em; opacity: 0.9; border-radius: 6px; padding: 6px; }
  `]
})
export class MapDirectionComponent {
  _plan: Plan;
  latitude: number;
  longitude: number;
  searchControl: FormControl;
  zoom = 17;

//   constructor(
//     private mapsAPILoader: MapsAPILoader,
//     private googleMapsAPIWrapper: GoogleMapsAPIWrapper,
//     private ngZone: NgZone,
//   ) {}

  @Input()
  set place(plan: Plan) { this._plan = plan; }
  get place(): Plan { return this._plan; }

//   ngOnInit() {
//     this.googleMapsAPIWrapper.getNativeMap().then(map => {
// console.log(map);
//     });
//     this.mapsAPILoader.load().then(() => {
//       this.ngZone.run(() => {
//     this.googleMapsAPIWrapper.getNativeMap().then(map => {
// console.log(map);
//     });
//         this.latitude = 41.85;
//         this.longitude = -87.65;
//         this.zoom = 6;
//         const directionsDisplay = new google.maps.DirectionsRenderer();
//         // directionsDisplay.setMap(new google.maps.Map(<any>document.getElementsByClassName('gm-style')[0]));

//         const directionsService = new google.maps.DirectionsService();
//         directionsService.route({
//           origin: 'Halifax, NS',
//           destination: 'Los Angeles, CA',
//           waypoints: [{ location: 'montreal quebec', stopover: true }, { location: 'chicago, il', stopover: true }],
//           optimizeWaypoints: true,
//           travelMode: google.maps.TravelMode.DRIVING
//         }, function(response, status) {
//           if (status === google.maps.DirectionsStatus.OK) {
//             directionsDisplay.setDirections(response);
//           } else {
//             window.alert('Directions request failed due to ' + status);
//           }
//         });
//       });
//     });
//   }
}
