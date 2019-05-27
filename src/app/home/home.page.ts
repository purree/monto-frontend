import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { MapService } from '../services/map/map.service';

import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { MenuController, Events } from '@ionic/angular';
import { Observable } from 'rxjs';

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
  factSpots: any;
  selectedUserSpot: any;

  userHref: string;
  userPositionWatcher: Observable<Geoposition>;

  defaultAttractions: any;

  isTempRoute: boolean = false;
  showStartNewRoute: boolean = false;

  constructor(
    private api: ApiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private menuCtrl: MenuController,
    private mapService: MapService,
    private ev: Events
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.fetchActiveRoute().then(() => this.loadMarkers(true));
    if (this.mapService.userMarker) {
      this.mapService.userMarker.setMap(this.mapService.map);
    }
  }

  ngOnInit() {
    this.mapService.loadMap(this.mapElement.nativeElement);
    this.geolocation.getCurrentPosition().then((resp) => {
      this.mapService.createUserMarker(new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude));
      this.userPositionWatcher = this.geolocation.watchPosition();
      this.userPositionWatcher.subscribe((pos: Geoposition) => this.handleUserMove(pos));
    }).catch(error => console.log('Error getting location', error));
  }

  async fetchActiveRoute() {
    this.userHref = await this.api.getUser();
    this.activeRoute = await this.api.getMyActiveRoute(this.userHref).toPromise().catch(error => console.log(error));
    if (this.activeRoute) {
      this.activeRoute = await this.api.getRouteWithMeta(this.activeRoute.id).toPromise();
      this.activeRoute.attractions.forEach(attraction => {
        attraction.gposition = new google.maps.LatLng(attraction.position.latitude, attraction.position.longitude);
      });
    }
  }

  // loadDefault true will fetch all attractions, false will only get from active route
  async loadMarkers(loadDefault) {
    if (loadDefault) {
      if (!this.defaultAttractions) {
        this.attractions = this.defaultAttractions = await this.api.getAttractions().toPromise();
      }
      this.renderMarkers(this.defaultAttractions);
    } else {
      this.renderMarkers(this.activeRoute.attractions.filter(a => a.category.id == 1));
    }
    if (this.activeRoute) {
      this.renderUserSpots(this.activeRoute.attractions.filter(a => a.category.id == 2));
      this.renderFactSpots(this.activeRoute.attractions.filter(a => a.category.id == 3));
    }
  }

  selectPredefinedRoute(route) {
    if (this.activeRoute && route.id == this.activeRoute.id) {
      this.api.unsetMyActiveRoute(this.userHref).subscribe(() => this.endRoute());
      return;
    }
    this.api.setMyActiveRoute(this.userHref, route.id).subscribe(data => {
      this.fetchActiveRoute().then(() => {
        this.loadMarkers(false);
        this.mapService.displayRoute(this.mapService.userMarker.position, this.activeRoute.attractions.filter(a => a.category.id !== 3));
      });
    });
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

  renderUserSpots(userSpots) {
    if (userSpots) {
      let userSpotMarkers = userSpots.map(spot => {
        spot.gposition = new google.maps.LatLng(spot.position.latitude, spot.position.longitude);
        let marker = this.mapService.createMarker(spot.gposition, 'yellow', () => {
          this.mapService.map.panTo(marker.getPosition());
          this.showUserSpotPopup(spot);
        });
        return marker;
      });
      this.mapService.setUserSpots(userSpotMarkers);
    }
  }

  renderFactSpots(factSpots) {
    if (factSpots) {
      let factSpotsMarkers = factSpots.map(fact => {
        fact.gposition = new google.maps.LatLng(fact.position.latitude, fact.position.longitude);
        let marker = this.mapService.createFactMarker(fact.gposition);
        return { id: fact.id, marker };
      });
      this.mapService.setFactSpots(factSpotsMarkers);
    }
  }

  locateMe() {
    if (this.mapService.userMarker) {
      this.mapService.map.panTo(this.mapService.userMarker.getPosition());
    }
  }

  handleUserMove(position: Geoposition): void {
    console.log('updated pos!')
    const userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.mapService.userMarker.setPosition(userPosition);
    if (this.activeRoute && this.routeStarted) {
      this.activeRoute.attractions
        .filter(attraction => attraction.category.id !== 2 && !attraction.seen)
        .forEach(attraction => {
          let distance: number = this.mapService.getDistance(userPosition, attraction.gposition)
          if (attraction.category.id === 1 && distance <= 30) {
            this.arrivedAtAttraction(attraction);
          } else if (attraction.category.id === 3 && distance <= 100) {
            this.factInRange(attraction);
          }
        });
    }
  }

  arrivedAtAttraction(attraction) {
    attraction.seen = true;
    window.navigator.vibrate(200);
    this.currentAttraction = attraction;
    this.api.getUser().then((user) => this.api.addToSeenAttractions(user, attraction.id).subscribe());
  }

  factInRange(fact) {
    fact.seen = true;
    window.navigator.vibrate(200);
    let factMarker = this.mapService.factSpotMarkers.find(f => f.id == fact.id).marker;
    factMarker.addListener('click', () => console.log(fact));
    factMarker.setAnimation(google.maps.Animation.BOUNCE);
    factMarker.setIcon({ ...factMarker.getIcon(), 'fillColor': '#FFD700' });
    this.ev.publish('factInRange');
    setTimeout(() => factMarker.setAnimation(null), 2000);
  }

  startRoute() {
    let statuesAndUserspots = this.activeRoute.attractions.filter(attr => attr.category.id !== 3)
    this.loadMarkers(false);
    this.mapService.displayRoute(this.mapService.userMarker.position, statuesAndUserspots);
    this.routeStarted = true;
  }

  endRoute() {
    this.routeStarted = false;
    this.mapService.clearRoute();
    this.mapService.clearFactSpots();
    this.mapService.clearUserSpots();
    this.fetchActiveRoute().then(() => this.loadMarkers(true));
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
    userSpot.gposition = new google.maps.LatLng(userSpot.position.latitude, userSpot.position.longitude);
    let marker = this.mapService.createMarker(userSpot.gposition, 'yellow', () => {
      this.mapService.map.panTo(marker.getPosition());
      this.showUserSpotPopup(userSpot);
    });
    this.mapService.userSpotMarkers.push(marker);
  }

  closePopups() {
    this.currentAttraction = null;
    this.selectedUserSpot = null;
    this.popupForUserSpot = false;
    this.showStartNewRoute = false;
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
}