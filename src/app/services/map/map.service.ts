import { Injectable } from '@angular/core';

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

  constructor() { }

  setMarkerIcon(markerId, icon) {
    this.markers.find(marker => marker.id == markerId).marker.setIcon(icon);
  }

  setMarkers(markers) {
    this.clearMarkers();
    this.markers = markers;
  }

  clearMarkers() {
    if (this.markers) {
      this.markers.forEach(m => m.marker.setMap(null));
      this.markers = [];
    }
  }

  clearUserSpots() {
    if (this.userSpotMarkers) {
      this.userSpotMarkers.forEach(m => m.setMap(null));
    }
  }

  setUserSpots(userSpotMarkers) {
    this.clearUserSpots();
    this.userSpotMarkers = userSpotMarkers;
  }

  displayRoute(origin, waypoints) {
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
    return this.googleMarker(userPosition, {
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
