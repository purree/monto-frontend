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
  directionsService: any;
  directionsDisplay: any;
  address: string;
  attractions: any;
  selectedAttraction: any;
  activeRoute: any;
  markers: any = [];

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) { }

  ionViewWillEnter() {
    this.api.getMyActiveRoute().then(val => val.subscribe(data => {
      if (data) {
        this.activeRoute = data;
        let selfLink = this.activeRoute._links.self.href;
        this.activeRoute.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
        this.api.getMyActiveRouteAttractions(this.activeRoute).subscribe(data => {
          let activeRouteAttractionsRes = <any>data;
          this.activeRoute.attractions = activeRouteAttractionsRes._embedded.attractions;
          this.activeRoute.attractions.forEach(attraction => {
            let selfLink = attraction._links.self.href;
            attraction.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
          });
        });
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
        let attractionsRes = <any>data;
        this.attractions = attractionsRes._embedded.attractions;
        this.attractions.forEach(attraction => {
          let selfLink = attraction._links.self.href;
          attraction.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
          this.api.getAttractionPosition(attraction).subscribe(data => {
            let pos = <any>data;
            attraction.position = new google.maps.LatLng(pos.latitude, pos.longitude);
            let marker = this.createMarker(attraction.position);
            this.markers.push(marker);
            marker.addListener('click', () => {
              this.map.panTo(marker.getPosition());
              this.onSelect(attraction);
            });
          })
        });
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  createMarker(position) {
    return new google.maps.Marker({
      position: position,
      animation: google.maps.Animation.Bounce,
      map: this.map
    });
  }

  startRoute() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    let wayPoints = [];
    this.activeRoute.attractions.forEach(attraction => {
      attraction.position = this.attractions.find(x => x.id == attraction.id).position;
      let marker = this.createMarker(attraction.position);
      this.markers.push(marker);
      wayPoints.push({ location: attraction.position });
    });
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);
    this.directionsService.route({
      origin: new google.maps.LatLng(59.3268215, 18.0695307),
      destination: new google.maps.LatLng(59.3268215, 18.0695307),
      waypoints: wayPoints,
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, (response, status) => {
      console.log(response);
      console.log(status);
      this.directionsDisplay.setDirections(response);
      let route = response.routes[0];
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
    this.api.addAttractionToRoute(this.activeRoute._links.attractions.href, this.selectedAttraction._links.self.href).subscribe(data => {
      this.activeRoute.attractions.push(this.selectedAttraction);
      this.selectedAttraction.inRoute = true;
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
        this.selectedAttraction.inRoute = false;
      }
    });
  }

  onSelect(item: any): void {
    this.selectedAttraction = item;
    this.selectedAttraction.inRoute = !!this.activeRoute.attractions.find(x => x._links.self.href == this.selectedAttraction._links.self.href);
  }

  unselectAttraction(): void {
    this.selectedAttraction = null;
  }

  // TODO: Modal for selecting a active route?

}