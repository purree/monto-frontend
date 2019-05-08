import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private attractions: any;
  private searchTerm: String = '';

  constructor(private api: ApiService) {
    this.getDefualtAttractions();
  }

  ngOnInit() {
  }

  searchAttractions() {
    if (this.searchTerm == '') {
      this.getDefualtAttractions();
      return;
    }
    this.api.findAttractionsByTitle(this.searchTerm).subscribe(data => {
      let attractionsResponse = <any>data;
      this.attractions = attractionsResponse._embedded.attractions;
      this.setAttractions();
    });
  }

  getDefualtAttractions() {
    this.api.getAttractions().subscribe(data => {
      let attractionsResponse = <any>data;
      this.attractions = attractionsResponse._embedded.attractions;
      this.setAttractions();
    });
  }

  setAttractions() {
    this.attractions.forEach(attraction => {
      let selfLink = attraction._links.self.href;
      attraction.id = selfLink.substring(selfLink.lastIndexOf('/'), selfLink.length);
    });
  }
}
