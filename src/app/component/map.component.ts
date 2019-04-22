import { Component, ElementRef, NgZone, OnInit, ViewChild, Params } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ScheduleRowPlace } from '../entity/schedule-row-place';

@Component({
  selector: 'ons-page[page]',
  template: `
    <ons-page class="page">
      <ons-toolbar>
        <div class="left">
          <ons-back-button>Back</ons-back-button>
        </div>
        <div class="center">Map</div>
        <div class="right">
          <ons-toolbar-button></ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <div id="autocomplete" class="form-group">
          <input [attr.disabled]="readOnly" placeholder="場所を検索してください" autocorrect="on"
            autocapitalize="off" spellcheck="off" type="text" class="form-control" #search [formControl]="searchControl">
        </div>
        <agm-map [latitude]="latitude" [longitude]="longitude" [scrollwheel]="false" [zoom]="zoom" (mapClick)="mapClick($event)">
          <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
        </agm-map>
      </div>
    </ons-page>
  `,
  styles: [`
    agm-map { height: 100%; }
    #autocomplete { position: absolute; top: 1em; z-index: 2; width: 80%; margin: 0 10%; }
    #autocomplete input { width: 100%; font-size: 1.2em; opacity: 0.9; border-radius: 6px; padding: 6px; }
  `]
})
export class MapComponent implements OnInit {
  shcedRowPlace: ScheduleRowPlace;
  readOnly: boolean;
  latitude: number;
  longitude: number;
  searchControl: FormControl;
  zoom = 17;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    params: Params
  ) {
    this.shcedRowPlace = params.data.shcedRowPlace;
    this.readOnly = params.data.readOnly;
  }

  ngOnInit() {
    // set google maps defaults
    if (this.shcedRowPlace.lat) {
      this.latitude = this.shcedRowPlace.lat;
      this.longitude = this.shcedRowPlace.lng;
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
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
      if (this.shcedRowPlace.address) {
        this.searchElementRef.nativeElement.value = this.shcedRowPlace.address;
      }
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.shcedRowPlace.address = this.searchElementRef.nativeElement.value = place.name;
          this.latitude = this.shcedRowPlace.lat = place.geometry.location.lat();
          this.longitude = this.shcedRowPlace.lng = place.geometry.location.lng();
          this.zoom = 17;
        });
      });
    });
  }

  mapClick(event: any) {
    // 読み取り専用ならアンカーの変更はさせない
    if (this.readOnly) {
      return;
    }
    this.shcedRowPlace.address = this.searchElementRef.nativeElement.value = '';
    this.shcedRowPlace.lat = event.coords.lat;
    this.shcedRowPlace.lng = event.coords.lng;

    this.latitude = this.shcedRowPlace.lat;
    this.longitude = this.shcedRowPlace.lng;
}
}
