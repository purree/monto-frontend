import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';
import { apiUrl } from '../../../environments/environment';



@Component({
  selector: 'app-create-userspot',
  templateUrl: './create-userspot.component.html',
  styleUrls: ['./create-userspot.component.scss'],
})
export class CreateUserspotComponent implements OnInit {

  @Input() activeRoute: any;
  @Input() userPosition: any;
  @Output() userSpotCreated: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();


  category: any;
  description: any = '';


  userSpotCategoryOptions = [
    { name: "Café", defaultDescription: "Check out this cozy café" },
    { name: "Vista", defaultDescription: "The view from this spot is amazing!" },
    { name: "Bar", defaultDescription: "Cheap beers and fast service" },
    { name: "Restaurant", defaultDescription: "The foie gras here is to die for" },
    { name: "Fact", defaultDescription: "Add a fact about this location!" },
    { name: "Other", defaultDescription: "Sweet spot" }
  ];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.category = '';
    this.description = '';
  }

  categoryChange() {
    console.log(this.category);
    if (this.description == '') {
      this.description = this.userSpotCategoryOptions.find(usco => usco.name == this.category).defaultDescription;
    }
  }

  closeCreateUserSpotPopup() {
    this.close.emit();
  }

  saveSpot() {
    const category = (this.category === 'Fact') ? 3 : 2;
    let spotData = {
      'title': this.category,
      'titleEnglish': this.category,
      'description': this.description,
      'category': `${apiUrl}/categories/${category}`
    };
    this.api.saveUserSpot(spotData).subscribe(spotResponse => {
      let spotData = <any>spotResponse;
      const positionPostData = {
        'latitude': this.userPosition.position.lat(),
        'longitude': this.userPosition.position.lng()
      }
      this.api.addPosition(positionPostData).subscribe(posResponse => {
        let positionData = <any>posResponse;
        this.api.addPositionToAttraction(spotData.id, positionData.id).subscribe(posAttractionResponse => console.log(posAttractionResponse));
        this.api.addAttractionToRoute(this.activeRoute.id, spotData.id).subscribe(attractionRouteResponse => { console.log(attractionRouteResponse); });
        this.userSpotCreated.emit({
          ...spotData, 'position': positionPostData, 'category': { 'id': category }
        });
      });
    });
  }

}
