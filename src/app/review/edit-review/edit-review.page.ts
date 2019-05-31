import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.page.html',
  styleUrls: ['./edit-review.page.scss'],
})
export class EditReviewPage implements OnInit {

  reviewForm: FormGroup;
  ratingId: number;
  review:any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private navCtrl: NavController,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.ratingId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getReview(this.ratingId).subscribe((response) => {
      let review = <any>response;
      this.reviewForm = this.formBuilder.group({
        rating: [review.rating, Validators.required],
        comment: [review.comment]
      });
    });
  }

  onDelete() {
    this.api.deleteReview(this.ratingId).subscribe(() => this.navCtrl.back());
  }

  onSubmit() {
    let patchData = { "rating": this.reviewForm.value.rating, "comment": this.reviewForm.value.comment };
    this.api.patchReview(this.ratingId, patchData).subscribe(() => this.navCtrl.back());
  }

}
