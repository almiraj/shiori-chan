import { Component, ElementRef, NgZone, OnInit, ViewChild, Params } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { LatLng } from '../entity/lat-lng';

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
  searchControl: FormControl;
  latitude = 34.6938877; // 大阪市役所
  longitude = 135.50192900000002;
  zoom = 6;

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
    if (this.shcedRowPlace.latLng) {
      this.latitude = this.shcedRowPlace.latLng.lat;
      this.longitude = this.shcedRowPlace.latLng.lng;
      this.zoom = 17;
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 17;
      });
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
          this.searchElementRef.nativeElement.value = place.name;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.shcedRowPlace.address = place.name;
          this.shcedRowPlace.latLng = new LatLng(place.geometry.location.lat(), place.geometry.location.lng());
          this.zoom = 17;
        });
      });

      // https://gist.github.com/schoenobates/ef578a02ac8ab6726487
      // need to stop prop of the touchend event
      if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        setTimeout(function() {
          const container = document.getElementsByClassName('pac-container')[0];
          container.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
          });
          container.addEventListener('touchend', function(e) {
            e.stopImmediatePropagation();
          });
        }, 500);
      }
    });
  }

  mapClick(event: any) {
    // 読み取り専用ならアンカーの変更はさせない
    if (this.readOnly) {
      return;
    }

    this.searchElementRef.nativeElement.value = ''; // アンカー変更時はクリア
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;

    this.shcedRowPlace.address = ''; // アンカー変更時はクリア
    this.shcedRowPlace.latLng = new LatLng(event.coords.lat, event.coords.lng);
  }
}
