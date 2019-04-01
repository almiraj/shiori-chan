import { Component, ElementRef, NgZone, OnInit, ViewChild, Params, Input } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ScheduleRowPlace } from '../entity/schedule-row-place';

@Component({
  selector: 'app-map-direction',
  template: `
    <agm-map [latitude]="latitude" [longitude]="longitude" [scrollwheel]="false" [zoom]="zoom" (mapClick)="mapClick($event)">
      <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
    </agm-map>
  `,
  styles: [`
    agm-map { height: 200px; z-index: 5000; }
    #autocomplete { position: absolute; top: 1em; z-index: 2; width: 80%; margin: 0 10%; }
    #autocomplete input { width: 100%; font-size: 1.2em; opacity: 0.9; border-radius: 6px; padding: 6px; }
  `]
})
export class MapDirectionComponent implements OnInit {
  _rowPlace: ScheduleRowPlace;
  latitude: number;
  longitude: number;
  searchControl: FormControl;
  zoom = 17;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {}

  @Input()
  set shceRowPlace(shceRowPlace: ScheduleRowPlace) { this._rowPlace = shceRowPlace; }
  get shceRowPlace(): ScheduleRowPlace { return this._rowPlace; }

  ngOnInit() {
    // set google maps defaults
    if (this.shceRowPlace.latLng) {
      this.latitude = this.shceRowPlace.latLng.lat();
      this.longitude = this.shceRowPlace.latLng.lng();
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    } else {
      this.latitude = 34.6938877;
      this.longitude = 135.50192900000002;
      this.zoom = 6; // 広範囲で表示
    }

    // create search FormControl
    this.searchControl = new FormControl();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
    });
  }

  mapClick(event: any) {
    this.shceRowPlace.latLng = new google.maps.LatLng(event.coords.lat, event.coords.lng);
  }
}
