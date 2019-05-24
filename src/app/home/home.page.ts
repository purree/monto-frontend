import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { MapService } from '../services/map/map.service';

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
  attractions: any;
  selectedAttraction: any;
  activeRoute: any;
  currentAttraction: any; // this is the attraction you arrive at
  routeStarted: boolean = false;
  popupForUserSpot: boolean = false;
  userSpots: any;
  selectedUserSpot: any;

  userHref: string;

  defaultAttractions: any;

  isTempRoute: boolean = false;
  showStartNewRoute: boolean = false;

  constructor(
    private api: ApiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private menuCtrl: MenuController,
    private mapService: MapService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.mapService.loadMap(this.mapElement.nativeElement);
    this.fetchActiveRoute().then(() => this.loadMarkers());
    this.geolocation.getCurrentPosition().then((resp) => {
      let currentPosition = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.createUserMarker(currentPosition);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async fetchActiveRoute() {
    this.userHref = await this.api.getUser();
    this.activeRoute = await this.api.getMyActiveRoute(this.userHref).toPromise().catch(error => console.log(error));
    if (this.activeRoute) {
      this.activeRoute = await this.api.getRouteWithMeta(this.activeRoute.id).toPromise();
      this.activeRoute.attractions.forEach(attraction => {
        attraction.gposition = new google.maps.LatLng(attraction.position.latitude, attraction.position.longitude);
      });
      this.userSpots = this.activeRoute.attractions.filter(attraction => attraction.category.id == 2);
    }
  }

  async loadMarkers() {
    if (!this.defaultAttractions) {
      this.attractions = this.defaultAttractions = await this.api.getAttractions().toPromise();
    }
    this.renderMarkers(this.defaultAttractions);
    this.renderUserSpots();
  }

  renderMarkers(attractions) {
    let markers = attractions.map(attr => {
      attr.gposition = new google.maps.LatLng(attr.position.latitude, attr.position.longitude);
      let color = 'red';
      if (this.activeRoute && this.activeRoute.attractions.length) {
        color = (!!this.activeRoute.attractions.find(x => x.id == attr.id)) ? 'green' : 'red';
      }
      let marker = this.mapService.createMarker(attr.gposition, color, () => {
        this.mapService.map.panTo(marker.getPosition());
        this.onSelect(attr);
      });
      return { id: attr.id, marker };
    });
    this.mapService.setMarkers(markers);
  }

  renderUserSpots() {
    if (this.userSpots) {
      let userSpotMarkers = this.userSpots.map(spot => {
        if (spot.position.latitude) {
          spot.gposition = new google.maps.LatLng(spot.position.latitude, spot.position.longitude);
        }
        let marker = this.mapService.createMarker(spot.gposition, 'yellow', () => {
          this.mapService.map.panTo(marker.getPosition());
          this.showUserSpotPopup(spot);
        });
        return marker;
      });
      this.mapService.setUserSpots(userSpotMarkers);
    }
  }

  locateMe() {
    if (this.mapService.userMarker) {
      this.mapService.map.panTo(this.mapService.userMarker.getPosition());
    }
  }

  createUserMarker(userPosition) {
    if (this.mapService.userMarker) {
      return;
    }
    this.mapService.userMarker = this.mapService.createUserMarker(userPosition);
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      let updatedPosition = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.mapService.userMarker.setPosition(updatedPosition);
      if (this.activeRoute && this.routeStarted) {
        this.activeRoute.attractions.forEach(attraction => {
          if (attraction.category.id == 1) {
            let distance: number = this.mapService.getDistance(updatedPosition, attraction.gposition)
            console.log(`The distance between the user and ${attraction.title} is ${distance} meters.`);
            if (distance <= 30 && !attraction.seen) {
              this.arrivedAtAttraction(attraction);
              attraction.seen = true;
            }
          }
        });
      }
    });
  }

  startRoute() {
    let activeRouteStatues = this.activeRoute.attractions.filter(attr => attr.category.id == 1);
    this.renderMarkers(activeRouteStatues);
    this.renderUserSpots();
    this.mapService.displayRoute(this.mapService.userMarker.position, activeRouteStatues);
    this.routeStarted = true;
  }

  endRoute() {
    this.resetMarkers();
  }

  resetMarkers() {
    this.routeStarted = false;
    this.mapService.clearRoute();
    this.fetchActiveRoute().then(() => this.loadMarkers());
  }

  handleAddToRouteClick() {
    if (this.activeRoute) {
      this.addAttractionToRoute();
    } else {
      let routeData = {
        "routeName": 'Unnamed',
        "description": '',
        "routeIsPublic": false,
        "routeCreator": this.userHref
      }
      this.api.createRoute(routeData).subscribe(response => {
        let routeResponse = <any>response
        this.api.setMyActiveRoute(this.userHref, routeResponse.id).subscribe(() => {
          this.isTempRoute = true;
          this.activeRoute = { ...routeResponse, attractions: [] };
          this.addAttractionToRoute();
        });
      });
    }
  }

  userSpotCreated(userSpot) {
    this.popupForUserSpot = null;
    this.userSpots.push(userSpot);
    userSpot.gposition = new google.maps.LatLng(userSpot.position.latitude, userSpot.position.longitude);
    let marker = this.mapService.createMarker(userSpot.gposition, 'yellow', () => {
      this.mapService.map.panTo(marker.getPosition());
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
    this.api.getUser().then((user) => this.api.addToSeenAttractions(user, attraction.id).subscribe());
  }

  showUserSpotPopup(spot: any) {
    this.selectedUserSpot = spot;
  }

  createTempRoute() {
    this.showStartNewRoute = true;
  }

  onSelect(item: any): void {
    this.selectedAttraction = item;
    this.selectedAttraction.inRoute = this.activeRoute && !!this.activeRoute.attractions.find(x => x.id == this.selectedAttraction.id);
  }

  unselectAttraction(): void {
    this.selectedAttraction = null;
  }

  addAttractionToRoute() {
    this.api.addAttractionToRoute(this.activeRoute.id, this.selectedAttraction.id).subscribe(data => {
      this.activeRoute.attractions.push(this.selectedAttraction);
      this.selectedAttraction.inRoute = true;
      this.mapService.setMarkerIcon(this.selectedAttraction.id, 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      this.selectedAttraction = null;
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
        this.selectedAttraction.inRoute = false;
        this.mapService.setMarkerIcon(this.selectedAttraction.id, 'http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      }
      this.selectedAttraction = null;
    });
  }

  selectPredefinedRoute(route) {
    if (this.activeRoute && route.id == this.activeRoute.id) {
      this.api.unsetMyActiveRoute(this.userHref).subscribe(() => {
        this.resetMarkers();
      });
      return;
    }
    this.api.setMyActiveRoute(this.userHref, route.id).subscribe(data => {
      this.fetchActiveRoute().then(() => {
        this.renderMarkers(this.activeRoute.attractions.filter(a => a.category.id == 1));
        this.renderUserSpots();
        this.mapService.displayRoute(this.mapService.userMarker.position, this.activeRoute.attractions);
      });
    });
  }
}