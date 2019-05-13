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
  userMarker: any;
  markers: any = [];
  routeStarted: boolean = false;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) { }

  ionViewWillEnter() {
    this.api.getUser().then(userHref => {
      this.api.getMyActiveRoute(userHref).subscribe(data => {
        if (data) {
          this.activeRoute = data;
          this.activeRoute.attractions = this.activeRoute._embedded.attractions;
          /*this.api.getMyActiveRouteAttractions(this.activeRoute).subscribe(data => {
            let activeRouteAttractionsRes = <any>data;
            this.activeRoute.attractions = activeRouteAttractionsRes._embedded.attractions;
          });*/
        }
        this.loadMap();
      });
    });
  }

  ngOnInit() { }

  loadMap() {
    //let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    let latLng = new google.maps.LatLng(59.3251467, 18.0679113);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.mapTypes.set('styled_map', this.styledMapType);
    this.map.setMapTypeId('styled_map');
    this.api.getAttractions().subscribe(data => {
      let attractionsRes = <any>data;
      this.attractions = attractionsRes._embedded.attractions;
      this.attractions.forEach(attraction => {
        //this.api.getAttractionPosition(attraction).subscribe(data => {
        //let pos = <any>data;
        attraction.position = new google.maps.LatLng(attraction.position.latitude, attraction.position.longitude);
        let inRoute = !!this.activeRoute.attractions.find(x => x.id == attraction.id);
        let color = inRoute ? 'green' : 'red';
        let marker = this.createMarker(attraction.position, color);
        this.markers.push({ id: attraction.id, marker });
        marker.addListener('click', () => {
          this.map.panTo(marker.getPosition());
          this.onSelect(attraction);
        });
        //})
      });
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      let currentPosition = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.createUserMarker(currentPosition);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  createUserMarker(userPosition) {
    let icon = {
      path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
      fillColor: '#4A90E2',
      fillOpacity: 1,
      anchor: new google.maps.Point(0, 0),
      strokeWeight: 15,
      strokeOpacity: 0.5,
      strokeColor: '#4A90E2',
      scale: 0.5
    }
    this.userMarker = new google.maps.Marker({
      position: userPosition,
      animation: google.maps.Animation.Bounce,
      map: this.map,
      icon,
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('Updated user position');
      let updatedPosition = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.userMarker.setPosition(updatedPosition);
      if (this.activeRoute.attractions) {
        this.activeRoute.attractions.forEach(attraction => {
          console.log(`The distance between the user and ${attraction.title} is ${this.getDistance(updatedPosition, attraction.position)} meters.`);
        });
      }
    });
  }

  createMarker(position, color) {
    return new google.maps.Marker({
      position: position,
      animation: google.maps.Animation.Bounce,
      map: this.map,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png'
      }
    });
  }

  getFarthestAttraction() {
    let farthestAttraction;
    let farthestAttractionDistance = 0;
    this.activeRoute.attractions.forEach(attraction => {
      let distance = this.getDistance(this.userMarker.position, attraction.position);
      if (distance > farthestAttractionDistance) {
        farthestAttraction = attraction;
        farthestAttractionDistance = distance;
      }
    });
    return farthestAttraction;
  }

  startRoute() {
    this.createUserMarker(this.userMarker.position);
    this.markers.forEach(marker => marker.marker.setMap(null));
    this.markers = [];
    let wayPoints = [];
    this.activeRoute.attractions.forEach(attraction => {
      attraction.position = this.attractions.find(x => x.id == attraction.id).position;
      let marker = this.createMarker(attraction.position, 'green');
      this.markers.push({ id: attraction.id, marker });
      wayPoints.push({ location: attraction.position });
    });
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    this.directionsDisplay.setMap(this.map);
    this.directionsService.route({
      origin: this.userMarker.position,
      destination: this.getFarthestAttraction().position,
      waypoints: wayPoints,
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, (response, status) => {
      console.log(response);
      console.log(status);
      this.directionsDisplay.setDirections(response);
    });
    this.routeStarted = true;
  }

  addAttractionToRoute() {
    console.log('activeRoutesHref: ' + this.activeRoute._links.attractions.href);
    this.api.addAttractionToRoute(this.activeRoute.id, this.selectedAttraction.id).subscribe(data => {
      this.activeRoute.attractions.push(this.selectedAttraction);
      this.selectedAttraction.inRoute = true;
      this.markers.find(marker => marker.id == this.selectedAttraction.id).marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
        this.selectedAttraction.inRoute = false;
        this.markers.find(marker => marker.id == this.selectedAttraction.id).marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      }
    });
  }

  onSelect(item: any): void {
    this.selectedAttraction = item;
    this.selectedAttraction.inRoute = !!this.activeRoute._embedded.attractions.find(x => x.id == this.selectedAttraction.id);
  }

  unselectAttraction(): void {
    this.selectedAttraction = null;
  }

  // TODO: Modal for selecting a active route?

  rad(x) {
    return x * Math.PI / 180;
  };

  getDistance(p1, p2) {
    const earthRadius = 6378137; // Earth’s mean radius in meter
    const diffLat = this.rad(p2.lat() - p1.lat());
    const diffLong = this.rad(p2.lng() - p1.lng());
    const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
      Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
      Math.sin(diffLong / 2) * Math.sin(diffLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance; // returns the distance in meter
  };

  private styledMapType = new google.maps.StyledMapType(
    [
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ],
    { name: 'Styled Map' });

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

}