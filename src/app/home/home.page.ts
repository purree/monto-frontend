import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';


declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address: string;
  attractionsResponse: any;
  attraction: any;
  activeRoute: any;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {}

  ionViewWillEnter() {
    this.api.getMyActiveRoute().then(val => val.subscribe(data => {
      if (data) {
        this.activeRoute = data;
        let selfLink = this.activeRoute._links.self.href;
        this.activeRoute.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
        this.api.getMyActiveRouteAttractions(this.activeRoute).subscribe(data => {
          let activeRouteAttractionsRes = <any>data;
          this.activeRoute.attractions = activeRouteAttractionsRes._embedded.attractions;
        })
      }
    }));
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      //let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let latLng = new google.maps.LatLng(59.3251467, 18.0679113);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.api.getAttractions().subscribe(data => {
        this.attractionsResponse = data;
        console.log(this.attractionsResponse._embedded.attractions);
        this.attractionsResponse._embedded.attractions.forEach(attraction => {
          let selfLink = attraction._links.self.href;
          attraction.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
          this.http.get(attraction._links.position.href).subscribe(data => {
            let pos = <any>data;
            let marker = new google.maps.Marker({
              position: new google.maps.LatLng(pos.latitude, pos.longitude),
              animation: google.maps.Animation.Bounce,
              map: this.map
            });
            marker.addListener('click', () => {
              this.map.panTo(marker.getPosition());
              this.onSelect(attraction);
              console.log(attraction);
            });
          })
        });
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }

  addAttractionToRoute() {
    this.api.addAttractionToRoute(this.activeRoute._links.attractions.href, this.attraction._links.self.href).subscribe(data => {
      this.activeRoute.attractions.push(this.attraction);
      this.attraction.inRoute = true;
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
        this.attraction.inRoute = false;
      }
    });
  }

  onSelect(item: any): void {
    this.attraction = item;
    this.attraction.inRoute = !!this.activeRoute.attractions.find(x => x._links.self.href == this.attraction._links.self.href);
  }

  unselectAttraction(): void {
    this.attraction = null;
  }
}