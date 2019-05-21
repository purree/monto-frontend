import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../api.service';



@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.page.html',
  styleUrls: ['./create-review.page.scss'],
})
export class CreateReviewPage implements OnInit {

  reviewForm: FormGroup;
  routeId: number;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage) {
    this.reviewForm = this.formBuilder.group({
      rating: [3, Validators.required],
      comment: ['']
    });
  }

  ngOnInit() {
    this.routeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit() {
    if (this.reviewForm.invalid) {
      return;
    }
    this.storage.get('userHref').then((userHref) => {
      let reviewData = {
        "rating": this.reviewForm.value.rating,
        "comment": this.reviewForm.value.comment
      }
      this.api.createReview(this.routeId, userHref, reviewData).subscribe(() => this.navCtrl.back());
    });
  }
}
