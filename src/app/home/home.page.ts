import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { MapService } from '../services/map/map.service';

import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { MenuController, Events } from '@ionic/angular';
import { Subscription } from 'rxjs';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  selectedAttraction: any;
  currentAttraction: any; // this is the attraction you arrive at
  popupForUserSpot: boolean = false;
  factSpots: any;
  selectedUserSpot: any;
  selectedFactPacket: any;
  showCompleted: boolean = false;
  helpMeFindActive: boolean = false;

  userHref: string;
  userPositionSub: Subscription;

  isTempRoute: boolean = false;
  showStartNewRoute: boolean = false;

  constructor(
    private api: ApiService,
    private geolocation: Geolocation,
    private menuCtrl: MenuController,
    private ev: Events,
    public mapService: MapService
  ) { }

  ionViewWillEnter() {
    if (this.mapService.userMarker) {
      this.mapService.userMarker.setMap(this.mapService.map);
    }
  }

  ionViewWillLeave() {
    this.userPositionSub.unsubscribe();
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
    this.mapService.loadMap(this.mapElement.nativeElement);
    if (!this.mapService.activeRoute) {
      // this.mapService.activeRoute is undefined on reload or no active route
      this.fetchActiveRoute().then(() => this.loadMarkers(this.mapService.isRouteCreator));
    } else {
      this.restoreState();
    }
    this.geolocation.getCurrentPosition().then((resp) => {
      this.mapService.createUserMarker(new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude));
      this.mapService.userPositionWatcher = this.geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 0 });
      this.userPositionSub = this.mapService.userPositionWatcher.subscribe((pos: Geoposition) => this.handleUserMove(pos));
    }).catch(error => console.log('Error getting location', error));

  }

  async restoreState() {
    this.userHref = await this.api.getUser();
    let resp = await this.api.getMyActiveRoute(this.userHref).toPromise().catch(error => console.log(error));
    let activeRoute = <any>resp;
    if (activeRoute && activeRoute.id != this.mapService.activeRoute.id) {
      this.mapService.routeStarted = false;
      this.fetchActiveRoute().then(() => this.loadMarkers(this.mapService.isRouteCreator));
    } else if (this.mapService.routeStarted) {
      // TODO: check integrity of route attractions
      this.startRoute();
    } else {
      this.fetchActiveRoute().then(() => this.loadMarkers(this.mapService.isRouteCreator));
    }
  }

  async fetchActiveRoute() {
    this.userHref = await this.api.getUser();
    this.mapService.activeRoute = await this.api.getMyActiveRoute(this.userHref).toPromise().catch(error => console.log(error));
    if (this.mapService.activeRoute) {
      this.mapService.activeRoute = await this.api.getRouteWithMeta(this.mapService.activeRoute.id).toPromise();
      let creator = await this.api.getRouteCreator(this.mapService.activeRoute.id).toPromise();
      this.mapService.isRouteCreator = (creator._links.self.href === this.userHref);
    }
  }

  // loadDefault true will fetch all attractions, false will only get from active route
  async loadMarkers(loadDefault) {
    if (loadDefault || !this.mapService.activeRoute) {
      if (!this.mapService.defaultAttractions) {
        this.mapService.defaultAttractions = await this.api.getAttractions().toPromise();
      }
      this.renderMarkers(this.mapService.defaultAttractions);
    } else {
      this.renderMarkers(this.mapService.activeRoute.attractions.filter(a => a.category.id == 1));
    }
    if (this.mapService.activeRoute) {
      this.renderUserSpots(this.mapService.activeRoute.attractions.filter(a => a.category.id == 2));
      this.renderFactSpots(this.mapService.activeRoute.attractions.filter(a => a.category.id == 3));
    }
  }

  selectPredefinedRoute(route) {
    if (this.mapService.activeRoute && route.id == this.mapService.activeRoute.id) {
      this.api.unsetMyActiveRoute(this.userHref).subscribe(() => this.endRoute());
      return;
    }
    this.api.setMyActiveRoute(this.userHref, route.id).subscribe(() => {
      this.fetchActiveRoute().then(() => {
        this.loadMarkers(false);
        this.mapService.displayRoute(this.mapService.userMarker.position, this.mapService.activeRoute.attractions.filter(a => a.category.id !== 3));
      });
    });
  }

  renderMarkers(attractions) {
    let markers = attractions.map(attr => {
      attr.gposition = new google.maps.LatLng(attr.position.latitude, attr.position.longitude);
      let marker = this.mapService.createMarker(attr, () => {
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
        let marker = this.mapService.createUserSpotMarker(spot, () => {
          this.mapService.map.panTo(marker.getPosition());
          this.showUserSpotPopup(spot);
        });
        return { id: spot.id, marker };
      });
      this.mapService.setUserSpots(userSpotMarkers);
    }
  }

  renderFactSpots(factSpots) {
    if (factSpots) {
      console.log(factSpots);
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

  helpMeFind() {
    let attraction = this.currentAttraction || this.selectedAttraction;
    this.helpMeFindActive = true;
    this.mapService.map.panTo(attraction.gposition);
    this.mapService.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    this.mapService.map.setTilt(0);
    this.mapService.map.setZoom(19);
    this.closePopups();
  }

  deactivateHelpMeFind() {
    this.helpMeFindActive = false;
    this.mapService.map.setMapTypeId('styled_map');
    this.mapService.map.setZoom(17);
  }

  handleUserMove(position: Geoposition): void {
    console.log('updated pos!');
    const userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.mapService.userMarker.setPosition(userPosition);
    if (this.mapService.activeRoute && this.mapService.routeStarted) {
      this.mapService.activeRoute.attractions
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
    this.mapService.setMarkerIcon(attraction.id, this.mapService.colors.greenSeen);
    window.navigator.vibrate(200);
    this.currentAttraction = attraction;
    this.api.getUser().then((user) => this.api.addToSeenAttractions(user, attraction.id).subscribe());
    this.mapService.routeCompleted = this.mapService.activeRoute.attractions.filter(a => a.category.id == 1).every(a => a.seen);
    console.log(this.mapService.routeCompleted);
  }

  factInRange(fact) {
    fact.seen = true;
    window.navigator.vibrate(200);
    let factMarker = this.mapService.factSpotMarkers.find(f => f.id == fact.id).marker;
    factMarker.addListener('click', () => this.onSelectFactPacket(fact));
    factMarker.setAnimation(google.maps.Animation.BOUNCE);
    factMarker.setIcon({ ...factMarker.getIcon(), 'fillColor': this.mapService.colors.factFillUnlocked });
    this.ev.publish('factInRange');
    setTimeout(() => factMarker.setAnimation(null), 2000);
  }

  startRoute() {
    let statuesAndUserspots = this.mapService.activeRoute.attractions.filter(attr => attr.category.id !== 3)
    this.loadMarkers(false);
    this.mapService.displayRoute(this.mapService.userMarker.position, statuesAndUserspots);
    this.mapService.routeStarted = true;
  }

  endRoute() {
    this.mapService.routeStarted = false;
    this.mapService.clearRoute();
    this.mapService.clearFactSpots();
    this.mapService.clearUserSpots();
    this.fetchActiveRoute().then(() => this.loadMarkers(this.mapService.isRouteCreator));
  }

  handleAddToRouteClick() {
    if (this.mapService.activeRoute) {
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
          this.mapService.activeRoute = { ...routeResponse, attractions: [] };
          this.addAttractionToRoute();
        });
      });
    }
  }

  userSpotCreated(spot) {
    this.popupForUserSpot = null;
    spot.gposition = new google.maps.LatLng(spot.position.latitude, spot.position.longitude);
    if (spot.title === 'Fact') {
      let marker = this.mapService.createFactMarker(spot.gposition);
      this.mapService.activeRoute.attractions.push(spot);
      this.mapService.factSpotMarkers.push({ id: spot.id, marker });
    } else {
      let marker = this.mapService.createUserSpotMarker(spot, () => {
        this.mapService.map.panTo(marker.getPosition());
        this.showUserSpotPopup(spot);
      });
      this.mapService.userSpotMarkers.push({ id: spot.id, marker });
    }
  }

  closePopups() {
    this.currentAttraction = null;
    this.selectedUserSpot = null;
    this.selectedFactPacket = null;
    this.popupForUserSpot = false;
    this.showStartNewRoute = false;
    this.showCompleted = false;
  }

  handleFinishRoute() {
    this.showCompleted = true;
  }

  showUserSpotPopup(spot: any) {
    this.selectedUserSpot = spot;
  }

  createTempRoute() {
    this.showStartNewRoute = true;
  }

  onSelectFactPacket(fact: any): void {
    this.selectedFactPacket = fact;
  }

  onSelect(item: any): void {
    this.selectedAttraction = item;
    this.selectedAttraction.inRoute = this.mapService.activeRoute && !!this.mapService.activeRoute.attractions.find(x => x.id == this.selectedAttraction.id);
  }

  unselectAttraction(): void {
    this.selectedAttraction = null;
  }

  // attractionId is id of fact/spot
  deleteSpot(deleteObj) {
    this.api.removeAttractionFromRoute(this.mapService.activeRoute.id, deleteObj.spot.id).subscribe(() => {
      this.api.deleteSpot(deleteObj.spot.id);
      this.mapService.removeSpot(deleteObj.spot, deleteObj.categoryId);
      this.closePopups();
    });
  }

  addAttractionToRoute() {
    this.api.addAttractionToRoute(this.mapService.activeRoute.id, this.selectedAttraction.id).subscribe(data => {
      this.mapService.activeRoute.attractions.push(this.selectedAttraction);
      this.selectedAttraction.inRoute = true;
      this.mapService.setMarkerIcon(this.selectedAttraction.id, this.mapService.colors.green);
      this.selectedAttraction = null;
      // this is never reachable as attractions not in route is hidden
      //if (this.mapService.routeStarted) {
      //  this.mapService.displayRoute(this.mapService.userMarker.position, this.mapService.activeRoute.attractions.filter(a => a.category.id !== 3));
      //}
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.mapService.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.mapService.activeRoute.attractions = this.mapService.activeRoute.attractions.filter(x => x.id !== attractionId);
        this.selectedAttraction.inRoute = false;
        this.mapService.setMarkerIcon(this.selectedAttraction.id, this.mapService.colors.red);
      }
      this.selectedAttraction = null;
      if (this.mapService.routeStarted && this.mapService.activeRoute.attractions.length) {
        this.mapService.displayRoute(this.mapService.userMarker.position, this.mapService.activeRoute.attractions.filter(a => a.category.id !== 3));
        this.mapService.markers.find(m => m.id === attractionId).marker.setMap(null);
        //this.mapService.setMarkerIcon(attractionId, '#ff0000');
      }
    });
  }
}