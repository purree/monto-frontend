import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { apiUrl } from '../environments/environment';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userHref: any;

  constructor(private http: HttpClient, private storage: Storage) {
  }

  async getUser() {
    return await this.storage.get('userHref').then((userHref) => userHref);
  }

  findByEmail(username: string) {
    return this.http.get(`${apiUrl}/users/search/findByEmail?email=${username}`);
  }

  createUser(userData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(userData);
    return this.http.post(`${apiUrl}/users/`, userData, httpOptions);
  }

  addToSeenAttractions(userHref, attractionId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = {
      "_links": {
        "attractions": [
          `${apiUrl}/attractions/${attractionId}`
        ]
      }
    }
    return this.http.patch(`${userHref}/seenAttractions`, body, httpOptions);
  }


  saveUserSpot(spotData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${apiUrl}/attractions`, spotData, httpOptions);
  }

  addPositionToAttraction(attractionId, positionId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = {
      "_links": {
        "position": `${apiUrl}/positions/${positionId}`
      }
    }
    return this.http.put(`${apiUrl}/attractions/${attractionId}/position`, body, httpOptions);
  }

  getAttraction(id: any) {
    return this.http.get(`${apiUrl}/attractions-with-meta/${id}`);
  }

  getAttractionPosition(attraction: any) {
    return this.http.get(attraction._links.position.href);
  }

  getAttractions() {
    return this.http.get<any>(`${apiUrl}/attractions-with-meta?size=40`);
  }

  findAttractionsByTitle(searchTerm: String) {
    return this.http.get(`${apiUrl}/attractions/search/findByTitleIgnoreCaseContainingAndCategory_Name?title=${searchTerm}&category=statue`);
  }

  getRoutesByUser(userId) {
    return this.http.get<any>(`${apiUrl}/users/${userId}/routes`);
  }

  getMyRoutes(userHref) {
    return this.http.get(`${userHref}/routes`);
  }

  getRouteWithMeta(routeId) {
    return this.http.get(`${apiUrl}/routes-with-meta/${routeId}`);
  }

  getRoutesWithMeta() {
    return this.http.get(`${apiUrl}/routes-with-meta/`);
  }

  getMyActiveRoute(userHref) {
    return this.http.get(`${userHref}/activeRoute`);
  }

  setMyActiveRoute(userHref, activeRouteId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = {
      "_links": {
        "activeRoute": `${apiUrl}/routes/${activeRouteId}`
      }
    }
    return this.http.put(`${userHref}/activeRoute`, body);
  }

  unsetMyActiveRoute(userHref) {
    return this.http.delete(`${userHref}/activeRoute`);
  }

  getMyActiveRouteAttractions(activeRoute: any) {
    return this.http.get(activeRoute._links.attractions.href);
  }

  getRoutes() {
    return this.http.get(`${apiUrl}/routes-with-meta/public-routes`);
  }

  getRoute(id: any) {
    return this.http.get(`${apiUrl}/routes-with-meta/${id}`);
  }

  deleteRoute(id: any) {
    return this.http.delete(`${apiUrl}/routes/${id}`);
  }

  searchRouteByTitle(searchTerm: string) {
    return this.http.get(`${apiUrl}/routes/search/findByRouteNameIgnoreCaseContaining?routeName=${searchTerm}`)
  }

  getRouteCreator(routeId: any) {
    return this.http.get(`${apiUrl}/routes/${routeId}/routeCreator`);
  }

  getRouteAttractions(route: any) {
    return this.http.get(`${apiUrl}/routes/${route.id}/attractions`);
  }

  getRouteRatings(route: any) {
    return this.http.get(`${apiUrl}/routes/${route.id}/ratings`);
  }

  patchRoute(routeId, routeData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.patch(`${apiUrl}/routes/${routeId}`, routeData, httpOptions);
  }

  createRoute(routeData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${apiUrl}/routes`, routeData, httpOptions);
  }

  addAttractionToRoute(activeRouteId, attractionId) {
    let attractionHref = `${apiUrl}/attractions/${attractionId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = {
      "_links": {
        "attractions": [
          attractionHref
        ]
      }
    }
    return this.http.patch(`${apiUrl}/routes/${activeRouteId}/attractions`, body, httpOptions);
  }

  addPosition(positionData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${apiUrl}/positions`, positionData, httpOptions);
  }

  removeAttractionFromRoute(routeId, attractionId) {
    return this.http.delete(`${apiUrl}/routes/${routeId}/attractions/${attractionId}`);
  }

  getCreators() {
    return this.http.get(`${apiUrl}/creators`);
  }

  getCreator(creatorId) {
    return this.http.get(`${apiUrl}/creators/${creatorId}`);
  }

  getCreatorAttractions(creator) {
    return this.http.get(`${apiUrl}/creators/${creator.id}/attractions`);
  }

  findCreatorsByName(searchTerm: String) {
    return this.http.get(`${apiUrl}/creators/search/findByLastNameOrFirstNameIgnoreCaseContaining?lastName=${searchTerm}&firstName=${searchTerm}`);
  }

  getReview(reviewId) {
    return this.http.get(`${apiUrl}/ratings/${reviewId}`);
  }

  deleteReview(reviewId) {
    return this.http.delete(`${apiUrl}/ratings/${reviewId}`);
  }

  patchReview(reviewId, patchData) {
    return this.http.patch(`${apiUrl}/ratings/${reviewId}`, patchData);
  }

  createReview(routeId, userHref, reviewData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let reviewBody = {
      ...reviewData,
      "route": `${apiUrl}/routes/${routeId}`,
      "ratingCreator": userHref
    }
    console.log(reviewBody);
    return this.http.post(`${apiUrl}/ratings`, reviewBody, httpOptions);
  }



}
