import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-list-creator',
  templateUrl: './list-creator.page.html',
  styleUrls: ['./list-creator.page.scss'],
})
export class ListCreatorPage implements OnInit {

  creators: any;
  searchTerm: String = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getDefualtCreators();
  }

  searchCreators() {
    if (this.searchTerm == '') {
      this.getDefualtCreators();
      return;
    }
    this.api.findCreatorsByName(this.searchTerm).subscribe(data => {
      let creatorsResponse = <any>data;
      this.creators = creatorsResponse._embedded.creators;
    });
  }


  getDefualtCreators() {
    this.api.getCreators().subscribe(data => {
      let creatorsResponse = <any>data;
      this.creators = creatorsResponse._embedded.creators;
    });
  }
}
