import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-detail-creator',
  templateUrl: './detail-creator.page.html',
  styleUrls: ['./detail-creator.page.scss'],
})
export class DetailCreatorPage implements OnInit {

  creator: any;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let creatorId = this.route.snapshot.paramMap.get('id');
    this.api.getCreator(creatorId).subscribe(data => {
      this.creator = data;
      this.api.getCreatorAttractions(this.creator).subscribe(data => {
        let attractionRes = <any>data;
        this.creator.attractions = attractionRes._embedded.attractions;
      });
    });
  }

}
