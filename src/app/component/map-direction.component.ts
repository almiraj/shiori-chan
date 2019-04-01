import { Component, ElementRef, NgZone, OnInit, ViewChild, Params, Input } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ScheduleRowPlace } from '../entity/schedule-row-place';

@Component({
  selector: 'app-map-direction',
  template: `
    <div class="content">
      <div id="autocomplete" class="form-group">
        <input placeholder="場所を指定してください" autocorrect="on"
          autocapitalize="off" spellcheck="off" type="text" class="form-control" #search [formControl]="searchControl">
      </div>
      <agm-map [latitude]="latitude" [longitude]="longitude" [scrollwheel]="false" [zoom]="zoom" (mapClick)="mapClick($event)">
        <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
      </agm-map>
    </div>
  `,
  styles: [`
    agm-map { height: 100%; }
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

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {}

  @Input()
  set shceRowPlace(shceRowPlace: ScheduleRowPlace) { this._rowPlace = shceRowPlace; }
  get shceRowPlace(): ScheduleRowPlace { return this._rowPlace; }

  ngOnInit() {
    // set google maps defaults
    if (this.shceRowPlace.lat && this.shceRowPlace.lng) {
      this.latitude = this.shceRowPlace.lat;
      this.longitude = this.shceRowPlace.lng;
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
      const autocomplete = new window['google'].maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
      if (this.shceRowPlace.address) {
        this.searchElementRef.nativeElement.value = this.shceRowPlace.address;
      }

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place = window['google'].maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.shceRowPlace.address = this.searchElementRef.nativeElement.value = place.name;
          this.shceRowPlace.lat = this.latitude = place.geometry.location.lat();
          this.shceRowPlace.lng = this.longitude = place.geometry.location.lng();
          this.zoom = 17;
        });
      });
    });
  }

  mapClick(event: any) {
    this.shceRowPlace.lat = this.latitude = event.coords.lat;
    this.shceRowPlace.lng = this.longitude = event.coords.lng;
  }
}
