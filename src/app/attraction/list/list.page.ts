import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  attractions: any;
  searchTerm: String = '';

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
    });
  }

  getDefualtAttractions() {
    this.api.getAttractions().subscribe(data => {
      let attractionsResponse = <any>data;
      this.attractions = attractionsResponse;
      //this.attractions = attractionsResponse._embedded.attractions;
    });
  }
}
