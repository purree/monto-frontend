import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { assetsPath } from '../../../environments/environment';

declare var google;

@Component({
  selector: 'app-attraction-detail',
  templateUrl: './attraction-detail.page.html',
  styleUrls: ['./attraction-detail.page.scss'],
})
export class AttractionDetailPage implements OnInit {
  assetsPath: string;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  attraction: any;
  activeRoute: any;
  inActiveRoute: boolean = true;
  showFunFact: boolean = false;
  isRouteCreator: boolean = false;

  constructor(private route: ActivatedRoute, private api: ApiService) { this.assetsPath = assetsPath; }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let attractionId = this.route.snapshot.paramMap.get('id');
    this.api.getAttraction(attractionId).subscribe(data => {
      this.attraction = data;
      console.log(this.attraction);
      if (!this.attraction.picture) {
        this.loadMap();
      }
      this.api.getUser().then(userHref => {
        this.api.getMyActiveRoute(userHref).subscribe(data => {
          this.activeRoute = data;
          this.api.getRouteCreator(this.activeRoute.id).subscribe((creator) => this.isRouteCreator = (creator._links.self.href === userHref));
          this.api.getMyActiveRouteAttractions(this.activeRoute).subscribe(data => {
          let activeRouteAttractionsRes = <any>data;
          this.activeRoute.attractions = activeRouteAttractionsRes._embedded.attractions;
          this.inActiveRoute = !!this.activeRoute.attractions.find(x => x.id == this.attraction.id);
        });
      }, error => console.log('No active route!'));
    });
  });
}

toggleFunFact() {
  this.showFunFact = !this.showFunFact;
}

addAttractionToRoute() {
  this.api.addAttractionToRoute(this.activeRoute.id, this.attraction.id).subscribe(data => {
    this.activeRoute.attractions.push(this.attraction);
    //this.activeRoute._embedded.attractions.push(this.attraction);
    this.inActiveRoute = true;
  });
}

removeAttractionFromRoute(attractionId) {
  this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
    if (!data) {
      this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
      // this.activeRoute._embedded.attractions = this.activeRoute._embedded.attractions.filter(x => x.id !== attractionId);
      this.inActiveRoute = false;
    }
  });
}

loadMap() {
  let latLng = new google.maps.LatLng(this.attraction.position.latitude, this.attraction.position.longitude);
  let mapOptions = {
    center: latLng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    panControl: false,
    zoomControl: false,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  }
  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  let marker = new google.maps.Marker({
    position: latLng,
    animation: google.maps.Animation.Bounce,
    map: this.map
  });
}

}
