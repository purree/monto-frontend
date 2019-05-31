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
  routeCompleted: boolean = false;

  userPositionWatcher: Observable<Geoposition>;

  constructor(private api: ApiService) { }

  setMarkerIcon(markerId, color, path) {
    let marker = this.markers.find(marker => marker.id == markerId).marker;
    if (path) {
      marker.setIcon({ ...marker.getIcon(), 'fillColor': color, path });
    } else {
      marker.setIcon({ ...marker.getIcon(), 'fillColor': color });
    }
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
      this.factSpotMarkers = this.factSpotMarkers.filter(m => m.id !== spot.id)
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
    console.log(waypoints);
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

  createUserSpotMarker(userSpot, onClick) {
    const color:string = this.getUserSpotMarkerColor(userSpot);
    const marker = this.googleMarker(userSpot.gposition, {
      path: this.icons[userSpot.title],
      fillColor: color,
      fillOpacity: 1,
      strokeColor: this.colors.userSpotOutline,
      strokeWeight: 0.5,
      anchor: new google.maps.Point(9, 25),
      scale: 1.3
    });
    marker.addListener('click', onClick);
    return marker;
  }

  getUserSpotMarkerColor(userSpot): string {
    return this.colors[userSpot.titleEnglish]
  }

  // TODO: check against seenAttractions in DB
  getMarkerColor(attraction) {
    let inRoute: boolean = false;
    if (this.activeRoute && this.activeRoute.attractions.length) {
      inRoute = (!!this.activeRoute.attractions.find(x => x.id == attraction.id));
    }
    if (inRoute) {
      return (this.activeRoute.attractions.find(x => x.id == attraction.id).seen) ?
        this.colors.greenSeen :
        this.colors.green;
    }
    return this.colors.red;
  }

  createMarker(attraction, onClick) {
    const setColor = this.getMarkerColor(attraction)
    const marker = this.googleMarker(attraction.gposition, {
      path: this.icons.Statue,
      fillColor: setColor,
      fillOpacity: 1,
      strokeColor: this.colors.markerOutline,
      strokeWeight: 0.5,
      anchor: new google.maps.Point(9, 25),
      scale: 1.3
    });
    marker.addListener('click', onClick);
    return marker;
  }

  createUserMarker(userPosition) {
    if (this.userMarker) {
      return;
    }
    this.userMarker = this.googleMarker(userPosition, {
      path: this.icons.User,
      fillColor: this.colors.userBlue,
      fillOpacity: 1,
      anchor: new google.maps.Point(0, -20),
      strokeWeight: 15,
      strokeOpacity: 0.5,
      strokeColor: this.colors.userBlue,
      scale: 0.5
    });
  }

  createFactMarker(position) {
    return this.googleMarker(position, {
      path: this.icons.Fact,
      fillColor: this.colors.factFill,
      fillOpacity: 1,
      strokeColor: this.colors.factOutline,
      strokeWeight: 0.5,
      anchor: new google.maps.Point(9, 25),
      scale: 1.3
    });
  }

  googleMarker(position, icon) {
    return new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position,
      icon
    });
  }

  colors = {
    red: '#DE5246',
    redSeen: '#DDAFAB',
    green: '#46DE76',
    greenSeen: '#A5DBB6',
    markerOutline: '#484848',
    userBlue: '#4A90E2',
    factFill: '#BBBBBB',
    factFillUnlocked: '#FFD700',
    factOutline: '#484848',
    userSpot: '#facf5a',
    userSpotOutline: '#484848',
    Café: '#8B572A',
    Restaurant: '#7ED321',
    Vista: '#50E3C2',
    Bar: '#417505',
    Other: '#4A90E2',
  }

  icons = {
    User: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    Statue: 'M9,32 C9,20 0,16 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,16 9,20 9,32 Z M11.882921,10.898457 C12.2709694,10.5857813 12.4781216,10.1202394 12.4985877,9.51480936 C12.5404961,8.27397946 11.6408283,8.10587931 10.9838927,7.98312928 C10.7277296,7.935289 10.4832806,7.88961661 10.3107324,7.79214899 L10.3107324,7.17075263 C10.7742496,6.76069724 11.0373133,6.18257099 11.0373133,5.56310816 C11.0373133,5.47220283 11.031187,5.38103384 11.0197421,5.29112457 C11.0707728,5.08675603 11.1970366,4.40773454 10.8039053,3.83567255 C10.5430632,3.45614354 10.117314,3.20519444 9.53850655,3.08985629 C7.99294409,2.7818094 7.16898072,3.34514119 6.89679477,3.58826827 C6.42223657,3.6596039 6.09097489,3.84563317 5.91095381,4.14219606 C5.60251454,4.65048077 5.88274557,5.28277523 5.99904565,5.50255343 C5.9983051,5.62301837 6.00719171,5.86107725 6.07545699,6.10666519 C6.27113062,6.81076401 6.77399804,6.96099364 7.05631607,6.98788732 C7.06877078,6.98905916 7.08109085,6.98967437 7.09334359,6.98967437 C7.12185479,6.98967437 7.1495581,6.98627604 7.17621792,6.98035826 C7.30204418,7.12279516 7.44712474,7.24955873 7.60566986,7.35540499 L7.60566986,7.85185414 C7.33897071,8.00583364 6.92395951,8.15199113 6.52076345,8.29398859 C5.56181793,8.63168299 4.47492549,9.01446385 4.50044082,9.7986871 L4.50212389,9.8507167 C4.52208509,10.4711463 4.5426522,11.1127276 5.02141807,11.4854892 C5.27044499,11.6793698 5.60116809,11.7718864 6.03078834,11.7674627 C6.22999641,12.0371319 6.63803971,12.7585447 6.10868078,13.6185858 C5.71743451,14.2541907 5.62500035,14.9832497 5.83383558,15.7855485 C6.00062774,16.4262802 6.35104275,17.1062392 6.90504181,17.8642719 C6.96681045,17.9487907 7.07395464,18 7.18907657,18 L11.3271379,18 C11.4766281,18 11.6082104,17.9141629 11.6502198,17.7893035 C11.749016,17.4953773 11.8347515,17.2256495 11.9123074,16.9646226 C11.9588947,16.8079772 11.8507407,16.6481678 11.6707533,16.6076515 C11.4905302,16.5671059 11.3071093,16.661263 11.260522,16.8179085 C11.2036006,17.0094747 11.1421012,17.2060505 11.0739706,17.4141103 L7.3755943,17.4141103 C7.16453742,17.1150573 6.98832007,16.8287773 6.84562947,16.5542742 C8.7456463,16.0262148 9.82217103,15.0780807 10.3983529,14.3540606 C10.6993194,13.9758792 10.8968444,13.621574 11.0239498,13.3429988 C11.0388281,13.3585843 11.0537064,13.3741111 11.0684501,13.3894915 C11.3523839,13.6857907 11.6205641,13.9656549 11.6708206,14.3407895 C11.6805151,14.4132384 11.6858672,14.4952671 11.6866751,14.584649 C11.6881562,14.7456596 11.8385553,14.8752941 12.0232216,14.8752941 C12.0241305,14.8752941 12.025073,14.8752941 12.0259482,14.8752941 C12.2118264,14.8740344 12.3613502,14.7418218 12.3599028,14.5800203 C12.358893,14.4695745 12.3520597,14.366277 12.3395377,14.2729694 C12.2660885,13.7244614 11.9045316,13.3471296 11.5855226,13.0142397 C11.2873501,12.7030581 11.0297732,12.4343264 11.0419923,12.0771502 L11.0702342,11.2547543 C11.2999395,11.2141794 11.6089173,11.1192313 11.882921,10.898457 Z M7.2471088,6.39786691 C7.22822476,6.40275934 7.2103169,6.40946811 7.19301495,6.41699717 C7.17268348,6.41151883 7.15154413,6.40750528 7.1295969,6.40542527 C6.64016038,6.35881541 6.67311487,5.4637363 6.67361979,5.45529907 C6.67715424,5.4022734 6.6640263,5.3494528 6.63568341,5.30240351 C6.54940928,5.15920491 6.34050673,4.68900494 6.50628905,4.41582022 C6.59266416,4.27355909 6.79436318,4.18540759 7.10589929,4.15379726 C7.20163227,4.144071 7.28329478,4.10487302 7.33829749,4.03617402 C7.37808524,3.99196644 7.9620766,3.37666363 9.38824213,3.66095152 C9.78524449,3.74007987 10.0586759,3.89467459 10.2241889,4.13358305 C10.4059941,4.39601616 10.4205021,4.71141634 10.4006419,4.93025708 C10.1155637,4.86021046 9.70543335,4.69902416 9.52484002,4.33590087 C9.46525937,4.21608044 9.32165991,4.14500847 9.17301124,4.16170716 C9.02422792,4.17834726 8.9060428,4.27868589 8.88325404,4.40770524 C8.88163829,4.4167284 8.70592587,5.30706157 8.1069552,5.24926066 C8.01792083,5.24067695 7.92844888,5.26358638 7.8586015,5.31253991 C7.78878779,5.36149344 7.74425378,5.43291696 7.73492958,5.51052193 C7.69689221,5.82721113 7.51552467,6.32825974 7.2471088,6.39786691 Z M6.6003053,16.0071724 C6.2978241,15.1935653 6.33279828,14.4952671 6.70209732,13.8952568 C7.41696414,12.7338189 6.83620428,11.7626582 6.56913486,11.414388 L6.81129485,10.7463231 C6.86724007,10.5920214 6.76884785,10.427466 6.591587,10.3788055 C6.41442713,10.3301742 6.22525015,10.4157477 6.16930493,10.5700494 L5.94781302,11.181075 C5.73386127,11.1752451 5.57656162,11.1315649 5.47029263,11.0488331 C5.20753186,10.8442595 5.191812,10.3536988 5.17508229,9.83434027 L5.17339922,9.782047 C5.16111281,9.40486166 6.05499087,9.0900767 6.77325749,8.83713548 C7.31604731,8.64597941 7.82877752,8.46539919 8.15943329,8.22247718 C8.23517141,8.16681488 8.27889755,8.08490341 8.27889755,7.99862684 L8.27889755,7.20315395 C8.27889755,7.10284462 8.2199228,7.00950773 8.12257408,6.95577896 C8.0215226,6.89999947 7.92609258,6.8318278 7.83901058,6.75363691 C8.14778645,6.49694581 8.29222745,6.0921344 8.35699196,5.82603929 C8.83447869,5.75883439 9.1488087,5.43256541 9.33707682,5.08836731 C9.67806665,5.35513622 10.0911928,5.47419495 10.3636481,5.52660541 C10.3639173,5.53879252 10.364052,5.55097963 10.364052,5.56316675 C10.364052,6.06412747 10.1403721,6.52457189 9.75040496,6.82646664 C9.67857157,6.88207035 9.63750468,6.96172604 9.63750468,7.04536597 L9.63750468,7.93066024 C9.63750468,8.00835309 9.67298378,8.08288199 9.73613253,8.13781189 C10.045649,8.40715884 10.4690419,8.4862872 10.8425822,8.55607015 C11.4715115,8.6735762 11.851111,8.74447239 11.8256293,9.49764193 C11.7854039,10.6893132 10.8616682,10.7012074 10.7584961,10.6985707 C10.7545241,10.6983364 10.7506193,10.6985415 10.7466473,10.6984243 C10.7453008,10.6984243 10.743988,10.6982485 10.7426079,10.6982485 C10.7408239,10.6982485 10.7390398,10.6982778 10.7372558,10.6983071 C10.7323075,10.6983071 10.7273593,10.6981313 10.7224784,10.6983071 C10.106879,10.7064807 9.66783358,10.5242013 9.40719349,10.3686398 C9.2539332,10.2771192 9.04435743,10.3111025 8.93923292,10.444487 C8.83407476,10.57793 8.8730883,10.760268 9.02641591,10.8517886 C9.31745224,11.0255428 9.77629056,11.225224 10.396064,11.2736502 L10.3690675,12.0597191 C10.3601136,12.3203066 10.4326876,12.5442448 10.5457225,12.7438967 C10.4077445,13.1951129 9.63747102,15.1795033 6.6003053,16.0071724 Z M9,14 C8.7239,14 8.5,14.125769 8.5,14.2809225 L8.5,14.7190775 C8.5,14.874231 8.7239,15 9,15 C9.2761,15 9.5,14.874231 9.5,14.7190775 L9.5,14.2809225 C9.5,14.125769 9.27615,14 9,14 Z M11.999975,15 C11.7245888,15 11.5,15.2245888 11.5,15.499975 C11.5,15.7753612 11.7245888,16 11.999975,16 C12.2754112,16 12.5,15.7753612 12.5,15.499975 C12.5,15.2245888 12.2754112,15 11.999975,15 Z',
    StatueSeen: 'M9,32 C9,20 0,16 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,16 9,20 9,32 Z M11.6638559,7.52707935 L11.2237603,7.10491207 C11.2062565,7.08625274 11.1787505,7.07692308 11.1537451,7.07692308 C11.1262391,7.07692308 11.1012337,7.08625274 11.0837299,7.10491207 L8.03306714,9.97145123 L6.92282594,8.93585856 C6.9028216,8.91719923 6.87781617,8.90786957 6.85281073,8.90786957 C6.8278053,8.90786957 6.80279987,8.91719923 6.78279552,8.93585856 L6.33769883,9.3510286 C6.29769013,9.38834725 6.29769013,9.44665765 6.33769883,9.4839763 L7.73800304,10.7901292 C7.8280226,10.8740962 7.9380465,10.9230769 8.0305666,10.9230769 C8.16309539,10.9230769 8.27812038,10.8321127 8.32062962,10.794794 L8.32313016,10.794794 L11.6663565,7.66002706 C11.7013641,7.62037599 11.7013641,7.56206559 11.6638559,7.52707935 L11.6638559,7.52707935 Z M9,4.67307692 C10.15625,4.67307692 11.2427885,5.12259615 12.0600962,5.93990385 C12.8774038,6.75721154 13.3269231,7.84375 13.3269231,9 C13.3269231,10.15625 12.8774038,11.2427885 12.0600962,12.0600962 C11.2427885,12.8774038 10.15625,13.3269231 9,13.3269231 C7.84375,13.3269231 6.75721154,12.8774038 5.93990385,12.0600962 C5.12259615,11.2427885 4.67307692,10.15625 4.67307692,9 C4.67307692,7.84375 5.12259615,6.75721154 5.93990385,5.93990385 C6.75721154,5.12259615 7.84375,4.67307692 9,4.67307692 L9,4.67307692 Z M9,4 C6.23798077,4 4,6.23798077 4,9 C4,11.7620192 6.23798077,14 9,14 C11.7620192,14 14,11.7620192 14,9 C14,6.23798077 11.7620192,4 9,4 Z',
    Fact: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M13.4285714,6.43552876 L11.3587054,6.43552876 C11.6631696,6.18219826 11.8571429,5.82292955 11.8571429,5.42220676 C11.8571429,4.65991226 11.1622768,4.04040404 10.3078125,4.04040404 C9.80200893,4.04040404 9.37723214,4.26379548 9.10714286,4.67142728 C8.83705357,4.26379548 8.41227679,4.04040404 7.90647321,4.04040404 C7.05200893,4.04040404 6.35714286,4.65991226 6.35714286,5.42220676 C6.35714286,5.82292955 6.54866071,6.18219826 6.85558036,6.43552876 L4.78571429,6.43552876 C4.35111607,6.43552876 4,6.76485841 4,7.17249021 L4,7.63309112 C4,7.68375722 4.04419643,7.7252113 4.09821429,7.7252113 L14.1160714,7.7252113 C14.1700893,7.7252113 14.2142857,7.68375722 14.2142857,7.63309112 L14.2142857,7.17249021 C14.2142857,6.76485841 13.8631696,6.43552876 13.4285714,6.43552876 Z M10.3078125,4.68524531 C10.7645089,4.68524531 11.1352679,5.01457496 11.1352679,5.42220676 C11.1352679,5.82983856 10.7645089,6.15916821 10.3078125,6.15916821 L9.48035714,6.15916821 C9.48035714,5.05372604 9.85111607,4.68524531 10.3078125,4.68524531 Z M7.90647321,4.68524531 C8.36316964,4.68524531 8.73392857,5.05372604 8.73392857,6.15916821 L7.90647321,6.15916821 C7.44977679,6.15916821 7.07901786,5.82983856 7.07901786,5.42220676 C7.07901786,5.01457496 7.44977679,4.68524531 7.90647321,4.68524531 Z M4.39285714,8.50823284 L4.39285714,13.6209029 C4.39285714,14.0262317 4.74642857,14.3578644 5.17857143,14.3578644 L8.76339286,14.3578644 L8.76339286,8.32399248 L4.58928571,8.32399248 C4.48125,8.32399248 4.39285714,8.40690064 4.39285714,8.50823284 Z M13.625,8.32399248 L9.45089286,8.32399248 L9.45089286,14.3578644 L13.0357143,14.3578644 C13.4678571,14.3578644 13.8214286,14.0262317 13.8214286,13.6209029 L13.8214286,8.50823284 C13.8214286,8.40690064 13.7330357,8.32399248 13.625,8.32399248 Z',
    Café: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M12.777834,13.2840909 L5.29187745,13.2840909 C5.07272002,13.2840909 4.88528274,13.4323864 4.87663179,13.6267045 C4.86509719,13.83125 5.04965082,14 5.28034285,14 L12.7662994,14 C12.9854568,14 13.1728941,13.8517045 13.181545,13.6573864 C13.190196,13.4528409 13.0056424,13.2840909 12.777834,13.2840909 Z M13.6285109,5.984375 C13.6313945,5.70823864 13.5073975,5.45 13.2767055,5.25823864 C13.0690827,5.08948864 12.7951359,5 12.5125381,5 L4.6199869,5 C4.33450551,5 4.05190777,5.09204545 3.84428494,5.26590909 C3.61070925,5.46278409 3.48671228,5.73125 3.50113053,6.01505682 C3.57033814,7.35227273 3.79814653,8.52840909 4.18743934,9.50767045 C4.50464089,10.315625 4.93142115,10.9931818 5.45336188,11.525 C6.37036272,12.4607955 7.43731338,12.7727273 7.69972557,12.7727273 L9.43279948,12.7727273 C9.59140026,12.7727273 10.1537121,12.5886364 10.707373,12.2741477 C11.3533107,11.9059659 11.9300408,11.3357955 12.3827739,10.6224432 C12.4404469,10.625 12.4981199,10.6275568 12.5529093,10.6275568 C13.3372622,10.6275568 14.0754767,10.3795455 14.6320212,9.92698864 C15.1914494,9.471875 15.5,8.86846591 15.5,8.22414773 C15.4971163,7.22954545 14.7531345,6.34488636 13.6285109,5.984375 L13.6285109,5.984375 Z M12.7720667,9.89886364 C13.181545,9.01676136 13.4526082,7.95568182 13.5737215,6.74375 C13.5737215,6.74375 13.5737215,6.74119318 13.5766052,6.74375 C13.8736212,6.87159091 14.1273824,7.05568182 14.320587,7.278125 C14.5628136,7.55681818 14.6896942,7.88409091 14.6896942,8.22414773 C14.6896942,9.09346591 13.8476683,9.81193182 12.7720667,9.89886364 L12.7720667,9.89886364 Z',
    Restaurant: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M6.83904182,9.65217391 L8.34782609,8.14255227 L4.61536994,4.43478261 C3.79487669,5.25570249 3.79487669,6.60652208 4.61536994,7.4274169 L6.83904182,9.65217391 Z M10.7310607,8.63230326 C11.5845106,9.01777118 12.7680901,8.74251136 13.6213117,7.86165389 C14.667242,6.8156926 14.8876582,5.30168546 14.061865,4.50332781 C13.2635001,3.67754834 11.7495881,3.89799057 10.7036324,4.9439779 C9.82272875,5.82483537 9.54748125,7.0084526 9.93294954,7.83423207 C8.72166264,9.07297939 4.56521739,13.2293506 4.56521739,13.2293506 L5.33597635,14 L9.13458463,10.2014145 L12.9331422,14 L13.703825,13.2293506 L9.9052421,9.43068695 L10.7310607,8.63230326 Z',
    Vista: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M8.9033039,4 C6.42302331,4 4.46718017,5.58125 2.12880618,8.165625 C1.95913525,8.35625 1.95605032,8.640625 2.12572125,8.83125 C4.12783829,11.071875 5.89241602,13 8.9033039,13 C11.8771727,13 14.1075742,10.571875 15.6932262,8.8125 C15.8567273,8.63125 15.8659821,8.35625 15.7086509,8.165625 C14.0921496,6.18125 11.8555782,4 8.9033039,4 Z M9.03904065,11.309375 C7.40402981,11.384375 6.05900203,10.021875 6.13612519,8.36875 C6.20090863,6.925 7.354671,5.75625 8.77990686,5.690625 C10.4149177,5.615625 11.7599455,6.978125 11.6828223,8.63125 C11.6180389,10.075 10.4642765,11.24375 9.03904065,11.309375 L9.03904065,11.309375 Z M8.7497438,7.08377341 C8.7497438,6.90294582 8.78289552,6.73115961 8.84317139,6.57444236 C8.81303345,6.57444236 8.78289552,6.57142857 8.7497438,6.57142857 C7.63765412,6.57142857 6.74255755,7.51775963 6.82694375,8.64793207 C6.89927479,9.59124933 7.65875067,10.3507252 8.60206793,10.4230562 C9.73224037,10.5074425 10.6785714,9.61234588 10.6785714,8.5002562 C10.6785714,8.46107689 10.6755576,8.42189758 10.6755576,8.38271827 C10.5067852,8.4580631 10.3229438,8.5002562 10.1270473,8.5002562 C9.3675714,8.5002562 8.7497438,7.86434584 8.7497438,7.08377341 L8.7497438,7.08377341 Z',
    Bar: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M6.39010989,6.61018084 C6.39010989,6.34293369 6.58853022,6.12793034 6.83516484,6.12793034 L11.0910027,6.12793034 C11.1818681,6.12793034 11.2690247,6.158071 11.3413462,6.21634293 C11.3784341,6.24648359 11.4322115,6.21634293 11.4303571,6.16610851 C11.4285027,6.05157401 11.4266484,5.97923644 11.4266484,5.73208305 C11.4266484,5.31413262 11.1076923,4.96249163 10.7201236,4.96249163 L10.7164148,4.96249163 C10.6107143,4.95445412 10.5161401,4.88211654 10.4771978,4.77561956 C10.3103022,4.32150033 9.87822802,4 9.43131868,4 C9.0418956,4 8.79711538,4.1406564 8.61538462,4.36771601 C8.53379121,4.46818486 8.39656593,4.48626926 8.29271978,4.41594106 C8.1573489,4.32350971 7.99416209,4.27327528 7.8198489,4.27327528 C7.55281593,4.27327528 7.3154533,4.41594106 7.15597527,4.6229069 C7.08179945,4.72136638 6.96311813,4.7635633 6.8481456,4.74146015 C6.75171703,4.72136638 6.61449176,4.70529136 6.4271978,4.70529136 C5.9635989,4.70529136 5.5,5.03884796 5.5,5.55726725 L5.5,5.63764233 C5.5,6.21634293 5.7967033,6.09778969 5.7967033,6.47756196 L5.7967033,7.49832552 C5.7967033,7.76758205 5.58901099,7.8861353 5.58901099,8.20562626 C5.58901099,8.38245144 5.73736264,8.54320161 5.90054945,8.54320161 L6.39010989,8.54320161 L6.39010989,6.61018084 Z M11.4711538,12.4373744 L6.35302198,12.4373744 C6.21023352,12.4373744 6.09340659,12.5639652 6.09340659,12.7186872 C6.09340659,12.8734092 6.21023352,13 6.35302198,13 L11.4711538,13 C11.6139423,13 11.7307692,12.8734092 11.7307692,12.7186872 C11.7307692,12.5639652 11.6139423,12.4373744 11.4711538,12.4373744 Z M11.6014709,7.55454967 L11.0537336,7.55454967 L11.0537336,7.08335833 C11.0537336,6.91058817 10.9304927,6.76923077 10.7798649,6.76923077 L7.21957222,6.76923077 C7.06894446,6.76923077 6.94570356,6.91058817 6.94570356,7.08335833 L6.94570356,11.2808878 C6.94570356,11.5184468 6.92687509,11.6382079 6.89092982,11.8718403 L6.88921814,11.8816568 C6.87552471,11.9739318 6.8926415,12.06817 6.93714516,12.1467019 C6.99534225,12.2468301 7.09290797,12.3076923 7.19903207,12.3076923 L10.8603138,12.3076923 C10.9304927,12.3076923 10.9989598,12.2802061 11.0503102,12.2271971 C11.1307591,12.1467019 11.1615694,12.0249775 11.1393175,11.9130696 C11.0931022,11.6814005 11.062292,11.5636027 11.0571569,11.3260437 L11.6014709,11.3260437 C12.0533542,11.3260437 12.4230769,10.9019715 12.4230769,10.383661 L12.4230769,8.49889565 C12.4230769,7.97862187 12.0533542,7.55454967 11.6014709,7.55454967 Z M11.9438068,10.3816977 C11.9438068,10.5976604 11.7897556,10.7743572 11.6014709,10.7743572 L11.0537336,10.7743572 L11.0537336,8.1042729 L11.6014709,8.1042729 C11.7897556,8.1042729 11.9438068,8.28096965 11.9438068,8.49693235 L11.9438068,10.3816977 Z',
    Other: 'M9,25 C9,25 0,14.1116795 0,9.09090909 C0,4.07013864 4.02943725,0 9,0 C13.9705627,0 18,4.07013864 18,9.09090909 C18,14.1116795 9,25 9,25 Z M7.9204893,13 L12.0891837,13 C12.4696982,13 12.7823503,12.775 12.9180753,12.4515625 L14.3019849,9.278125 C14.3431871,9.175 14.365,9.0671875 14.365,8.95 L14.365,8.0453125 C14.365,7.55078125 13.9529779,7 13.4488567,7 L10.5598545,7 L10.9961132,5.08984375 L11.0106552,4.94921875 C11.0106552,4.7640625 10.9330981,4.5953125 10.8094915,4.4734375 L10.3199122,4 L7.26610123,6.98359375 C7.10129238,7.1453125 6.99949868,7.3703125 6.99949868,7.61875 L6.99949868,12.11875 C6.99949868,12.6132812 7.41636812,13 7.9204893,13 Z M4.285,7.75 L4.285,13 L5.8361421,13 L5.8361421,7.75 L4.285,7.75 Z'
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
