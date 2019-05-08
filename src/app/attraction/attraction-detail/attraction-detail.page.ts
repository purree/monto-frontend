import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';

declare var google;

@Component({
  selector: 'app-attraction-detail',
  templateUrl: './attraction-detail.page.html',
  styleUrls: ['./attraction-detail.page.scss'],
})
export class AttractionDetailPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  private attraction: any;
  private activeRoute: any;
  private inActiveRoute: boolean = true;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let attractionId = this.route.snapshot.paramMap.get('id');
    this.api.getAttraction(attractionId).subscribe(data => {
      this.attraction = data;
      this.attraction.id = attractionId;
      this.api.getAttractionPosition(this.attraction).subscribe(data => {
        this.attraction.position = data;
        this.loadMap();
      });
      this.api.getAttractionCategory(this.attraction).subscribe(data => {
        let categoryResponse = <any>data;
        this.attraction.category = categoryResponse.name;
      });
      this.api.getAttractionCreators(this.attraction).subscribe(data => {
        let creatorResponse = <any>data;
        this.attraction.creators = creatorResponse._embedded.creators;
      });
      this.api.getMyActiveRoute().then(val => val.subscribe(data => {
        this.activeRoute = data;
        let selfLink = this.activeRoute._links.self.href;
        this.activeRoute.id = selfLink.substring(selfLink.lastIndexOf('/') + 1, selfLink.length);
        this.api.getMyActiveRouteAttractions(this.activeRoute).subscribe(data => {
          let activeRouteAttractionsRes = <any>data;
          this.activeRoute.attractions = activeRouteAttractionsRes._embedded.attractions;
          this.inActiveRoute = !!this.activeRoute.attractions.find(x => x._links.self.href == this.attraction._links.self.href);
        });
      }));
    });
  }

  addAttractionToRoute() {
    this.api.addAttractionToRoute(this.activeRoute._links.attractions.href, this.attraction._links.self.href).subscribe(data => {
      this.activeRoute.attractions.push(this.attraction);
      this.inActiveRoute = true;
    });
  }

  removeAttractionFromRoute(attractionId) {
    this.api.removeAttractionFromRoute(this.activeRoute.id, attractionId).subscribe(data => {
      if (!data) {
        this.activeRoute.attractions = this.activeRoute.attractions.filter(x => x.id !== attractionId);
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
