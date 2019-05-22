import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { MenuController } from '@ionic/angular';

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
  attractions: any;
  selectedAttraction: any;
  activeRoute: any;
  userMarker: any;
  markers: any = [];
  currentAttraction: any; // this is the attraction you arrive at
  routeStarted: boolean = false;
  popupForUserSpot: boolean = false;
  userSpots: any;
  selectedUserSpot: any;

  isTempRoute: boolean = false;
  showStartNewRoute: boolean = false;

  constructor(
    private api: ApiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private menuCtrl: MenuController
  ) {

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.api.getUser().then(userHref => {
      this.api.getMyActiveRoute(userHref).subscribe(data => {
        console.log(data);
        if (data) {
          this.activeRoute = data;
          this.api.getRouteWithMeta(this.activeRoute.id).subscribe(response => {
            this.activeRoute = response;
            this.activeRoute.attractions.forEach(attraction => {
              attraction.position = new google.maps.LatLng(attraction.position.latitude, attraction.position.longitude);
            });
            this.userSpots = this.activeRoute.attractions.filter(attraction => attraction.category.id == 2);
            this.loadMap();
          });
        }
      }, error => {
        // A 404 on from the api means no user with that email exists
        console.log('No activeRoute set!');
        console.log(error);
        this.loadMap();
      });
    });
  }

  loadMap() {
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
      console.log(data);
      this.attractions = <any>data;
      this.attractions.forEach(attraction => {
        attraction.position = new google.maps.LatLng(attraction.position.latitude, attraction.position.longitude);
        let color = 'red';
        if (this.activeRoute && this.activeRoute.attractions.length) {
          color = (!!this.activeRoute.attractions.find(x => x.id == attraction.id)) ? 'green' : 'red';
        }
        let marker = this.createMarker(attraction.position, color);
        this.markers.push({ id: attraction.id, marker });
        marker.addListener('click', () => {
          this.map.panTo(marker.getPosition());
          this.onSelect(attraction);
        });
      });
    });
    this.renderUserSpots();
    this.geolocation.getCurrentPosition().then((resp) => {
      let currentPosition = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.createUserMarker(currentPosition);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  renderUserSpots() {
    if (this.userSpots) {
      this.userSpots.forEach(spot => {
        if (spot.position.latitude) {
          spot.position = new google.maps.LatLng(spot.position.latitude, spot.position.longitude);
        }
        let marker = this.createMarker(spot.position, 'yellow');
        marker.addListener('click', () => {
          this.map.panTo(marker.getPosition());
          this.showUserSpotPopup(spot);
        });
      });
    }
  }

  locateMe() {
    if (this.userMarker) {
      this.map.panTo(this.userMarker.getPosition());
    }
  }

  createUserMarker(userPosition) {
    if (this.userMarker) {
      return;
    }
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
      let updatedPosition = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.userMarker.setPosition(updatedPosition);
      if (this.activeRoute && this.routeStarted) {
        this.activeRoute.attractions.forEach(attraction => {
          if (attraction.category.id == 1) {
            let distance: number = this.getDistance(updatedPosition, attraction.position)
            console.log(`The distance between the user and ${attraction.title} is ${this.getDistance(updatedPosition, attraction.position)} meters.`);
            if (distance <= 30 && !attraction.seen) {
              this.arrivedAtAttraction(attraction);
              attraction.seen = true;
            }
          }
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
        url: 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png'
      }
    });
  }

  getFarthestAttraction() {
    let farthestAttraction;
    let farthestAttractionDistance = 0;
    this.activeRoute.attractions.forEach(attraction => {
      if (attraction.position != null) {
        let distance = this.getDistance(this.userMarker.position, attraction.position);
        if (distance > farthestAttractionDistance) {
          farthestAttraction = attraction;
          farthestAttractionDistance = distance;
        }
      }
    });
    return farthestAttraction;
  }

  startRoute() {
    this.createUserMarker(this.userMarker.position);
    this.markers.forEach(marker => marker.marker.setMap(null));
    this.markers = [];
    let activeRouteStatues = this.activeRoute.attractions.filter(attr => attr.category.id == 1);
    this.markers = activeRouteStatues.map(attraction => {
      attraction.position = this.attractions.find(x => x.id == attraction.id).position;
      let marker = this.createMarker(attraction.position, 'green');
      marker.addListener('click', () => {
        this.map.panTo(marker.getPosition());
        this.onSelect(attraction);
      });
      return { id: attraction.id, marker };
    });
    this.renderUserSpots();
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    this.directionsDisplay.setMap(this.map);
    this.directionsService.route({
      origin: this.userMarker.position,
      destination: this.getFarthestAttraction().position,
      waypoints: activeRouteStatues.map(attr => ({ location: attr.position })),
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, (response, status) => {
      console.log(response);
      console.log(status);
      this.directionsDisplay.setDirections(response);
    });
    this.routeStarted = true;
  }


  handleAddToRouteClick() {
    if (this.activeRoute) {
      this.addAttractionToRoute();
    } else {
      this.api.getUser().then(userHref => {
        let routeData = {
          "routeName": 'Unnamed',
          "description": '',
          "public": false,
          "routeCreator": userHref
        }
        this.api.createRoute(routeData).subscribe(response => {
          let routeResponse = <any>response
          this.api.setMyActiveRoute(userHref, routeResponse.id).subscribe(() => {
            this.isTempRoute = true;
            this.activeRoute = { ...routeResponse, attractions: [] };
            this.addAttractionToRoute();
          });
        });
      });
    }
  }

  userSpotCreated(userSpot) {
    this.popupForUserSpot = null;
    this.userSpots.push(userSpot);
    userSpot.position = new google.maps.LatLng(userSpot.position.latitude, userSpot.position.longitude);
    let marker = this.createMarker(userSpot.position, 'yellow');
    marker.addListener('click', () => {
      this.map.panTo(marker.getPosition());
      this.showUserSpotPopup(userSpot);
    });
  }

  closePopups() {
    this.currentAttraction = null;
    this.selectedUserSpot = null;
    this.popupForUserSpot = false;
    this.showStartNewRoute = false;
  }

  arrivedAtAttraction(attraction) {
    this.currentAttraction = attraction;
    this.api.getUser().then((user) => {
      this.api.addToSeenAttractions(user, attraction.id).subscribe();
    });
  }

  showUserSpotPopup(spot: any) {
    this.selectedUserSpot = spot;
  }

  createTempRoute() {
    this.showStartNewRoute = true;
  }

  onSelect(item: any): void {
    this.selectedAttraction = item;
    if (this.activeRoute) {
      this.selectedAttraction.inRoute = !!this.activeRoute.attractions.find(x => x.id == this.selectedAttraction.id);
    } else {
      this.selectedAttraction.inRoute = false;
    }
  }

  unselectAttraction(): void {
    this.selectedAttraction = null;
  }

  addAttractionToRoute() {
    this.api.addAttractionToRoute(this.activeRoute.id, this.selectedAttraction.id).subscribe(data => {
      this.activeRoute.attractions.push(this.selectedAttraction);
      this.selectedAttraction.inRoute = true;
      this.markers.find(marker => marker.id == this.selectedAttraction.id).marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      this.selectedAttraction = null;
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
        this.selectedAttraction.inRoute = false;
        this.markers.find(marker => marker.id == this.selectedAttraction.id).marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      }
      this.selectedAttraction = null;
    });
  }

  rad(x) {
    return x * Math.PI / 180;
  };

  getDistance(p1, p2): number {
    const earthRadius = 6378137; // Earth’s mean radius in meter
    const diffLat = this.rad(p2.lat() - p1.lat());
    const diffLong = this.rad(p2.lng() - p1.lng());
    const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
      Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
      Math.sin(diffLong / 2) * Math.sin(diffLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return Number(distance); // returns the distance in meter
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

  /*  
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
*/
}