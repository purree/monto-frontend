import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';
import { Geoposition } from '@ionic-native/geolocation/ngx';


declare var google;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;
  directionsService: any;
  directionsDisplay: any;
  userMarker: any;
  markers: any = [];
  userSpotMarkers: any = [];
  factSpotMarkers: any = [];

  activeRoute: any;
  defaultAttractions: any;
  routeStarted: boolean = false;
  isRouteCreator: boolean = false;

  userPositionWatcher: Observable<Geoposition>;

  constructor(private api: ApiService) { }

  setMarkerIcon(markerId, icon) {
    this.markers.find(marker => marker.id == markerId).marker.setIcon(icon);
  }

  setMarkers(markers) {
    this.clearMarkers();
    this.markers = markers;
  }

  removeSpot(spot, categoryId) { 
    if (categoryId == 2) {
      this.userSpotMarkers.find(m => m.id = spot.id).marker.setMap(null);
      this.userSpotMarkers = this.userSpotMarkers.filter(m => m.id !== spot.id)
    } else if (categoryId == 3) {
      this.factSpotMarkers.find(m => m.id = spot.id).marker.setMap(null);
      this.factSpotMarkers =  this.factSpotMarkers.filter(m => m.id !== spot.id)
    }
  }

  clearMarkers() {
    if (this.markers) {
      this.markers.forEach(m => m.marker.setMap(null));
      this.markers = [];
    }
  }

  clearUserSpots() {
    if (this.userSpotMarkers) {
      this.userSpotMarkers.forEach(m => m.marker.setMap(null));
      this.userSpotMarkers = [];
    }
  }

  setUserSpots(userSpotMarkers) {
    this.clearUserSpots();
    this.userSpotMarkers = userSpotMarkers;
  }

  setFactSpots(factSpotMarkers) {
    this.clearFactSpots();
    this.factSpotMarkers = factSpotMarkers;
  }

  clearFactSpots() {
    if (this.factSpotMarkers) {
      this.factSpotMarkers.forEach(fact => fact.marker.setMap(null));
      this.factSpotMarkers = [];
    }
  };

  displayRoute(origin, waypoints) {
    this.clearRoute();
    if (!this.directionsService) {
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
      this.directionsDisplay.setMap(this.map);
    }
    let destination = this.getFarthestLocation(origin, waypoints);
    this.directionsService.route({
      origin,
      destination: destination.gposition,
      waypoints: waypoints.map(attr => ({ location: attr.gposition })),
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, (response, status) => {
      console.log(response);
      console.log(status);
      this.directionsDisplay.setDirections(response);
    });
  }

  clearRoute() {
    if (this.directionsDisplay) {
      this.directionsDisplay.setDirections({ routes: [] });
      this.directionsDisplay = null;
      this.directionsService = null;
    }
  }

  private rad(x) {
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

  getFarthestLocation(origin, locations) {
    let farthestLocation;
    let farthestLocationDistance = 0;
    locations.forEach(location => {
      if (location.position != null) {
        let distance = this.getDistance(origin, location.gposition);
        if (distance > farthestLocationDistance) {
          farthestLocation = location;
          farthestLocationDistance = distance;
        }
      }
    });
    return farthestLocation;
  }

  loadMap(mapElement) {
    let latLng = new google.maps.LatLng(59.3251467, 18.0679113);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(mapElement, mapOptions);
    this.map.mapTypes.set('styled_map', this.styledMapType);
    this.map.setMapTypeId('styled_map');
    return this.map;
  }

  createMarker(position, color, onClick) {
    const marker = this.googleMarker(position, {
      url: 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png'
    });
    marker.addListener('click', onClick);
    return marker;
  }

  createUserMarker(userPosition) {
    if (this.userMarker) {
      return;
    }
    this.userMarker = this.googleMarker(userPosition, {
      path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
      fillColor: '#4A90E2',
      fillOpacity: 1,
      anchor: new google.maps.Point(0, 0),
      strokeWeight: 15,
      strokeOpacity: 0.5,
      strokeColor: '#4A90E2',
      scale: 0.5
    });
  }

  createFactMarker(position) {
    return this.googleMarker(position, {
      path: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M13.4285714,6.43552876 L11.3587054,6.43552876 C11.6631696,6.18219826 11.8571429,5.82292955 11.8571429,5.42220676 C11.8571429,4.65991226 11.1622768,4.04040404 10.3078125,4.04040404 C9.80200893,4.04040404 9.37723214,4.26379548 9.10714286,4.67142728 C8.83705357,4.26379548 8.41227679,4.04040404 7.90647321,4.04040404 C7.05200893,4.04040404 6.35714286,4.65991226 6.35714286,5.42220676 C6.35714286,5.82292955 6.54866071,6.18219826 6.85558036,6.43552876 L4.78571429,6.43552876 C4.35111607,6.43552876 4,6.76485841 4,7.17249021 L4,7.63309112 C4,7.68375722 4.04419643,7.7252113 4.09821429,7.7252113 L14.1160714,7.7252113 C14.1700893,7.7252113 14.2142857,7.68375722 14.2142857,7.63309112 L14.2142857,7.17249021 C14.2142857,6.76485841 13.8631696,6.43552876 13.4285714,6.43552876 Z M10.3078125,4.68524531 C10.7645089,4.68524531 11.1352679,5.01457496 11.1352679,5.42220676 C11.1352679,5.82983856 10.7645089,6.15916821 10.3078125,6.15916821 L9.48035714,6.15916821 C9.48035714,5.05372604 9.85111607,4.68524531 10.3078125,4.68524531 Z M7.90647321,4.68524531 C8.36316964,4.68524531 8.73392857,5.05372604 8.73392857,6.15916821 L7.90647321,6.15916821 C7.44977679,6.15916821 7.07901786,5.82983856 7.07901786,5.42220676 C7.07901786,5.01457496 7.44977679,4.68524531 7.90647321,4.68524531 Z M4.39285714,8.50823284 L4.39285714,13.6209029 C4.39285714,14.0262317 4.74642857,14.3578644 5.17857143,14.3578644 L8.76339286,14.3578644 L8.76339286,8.32399248 L4.58928571,8.32399248 C4.48125,8.32399248 4.39285714,8.40690064 4.39285714,8.50823284 Z M13.625,8.32399248 L9.45089286,8.32399248 L9.45089286,14.3578644 L13.0357143,14.3578644 C13.4678571,14.3578644 13.8214286,14.0262317 13.8214286,13.6209029 L13.8214286,8.50823284 C13.8214286,8.40690064 13.7330357,8.32399248 13.625,8.32399248 Z',
      fillColor: '#BBBBBB',
      fillOpacity: 1,
      strokeColor: '#484848',
      strokeWeight: 0.5,
      anchor: new google.maps.Point(9, 25),
      scale: 1.3
    });
  }

  googleMarker(position, icon) {
    return new google.maps.Marker({
      position,
      animation: google.maps.Animation.Bounce,
      map: this.map,
      icon
    });
  }

  styledMapType = new google.maps.StyledMapType(
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
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.government",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.school",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.sports_complex",
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
}
