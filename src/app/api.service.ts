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
    this.setUser();
  }

  async setUser() {
    await this.storage.get('userHref').then((userHref) => {
      this.userHref = userHref
    });
  }

  getAttraction(id: any) {
    return this.http.get(`${apiUrl}/attractions/${id}`);
  }

  getAttractionCreators(attraction: any) {
    return this.http.get(attraction._links.creators.href);
  }

  getAttractionPosition(attraction: any) {
    return this.http.get(attraction._links.position.href);
  }

  getAttractionCategory(attraction: any) {
    return this.http.get(attraction._links.category.href);
  }

  getAttractions() {
    return this.http.get(`${apiUrl}/attractions?size=40`);
  }

  findAttractionsByTitle(searchTerm: String) {
    return this.http.get(`${apiUrl}/attractions/search/findByTitleIgnoreCaseContaining?title=${searchTerm}`);
  }

  getMyRoutes() {
    return this.http.get(`${this.userHref}/routes`);
  }

  getMyActiveRoute() {
    return this.storage.get('userHref').then(userHref => {
      return this.http.get(`${this.userHref}/activeRoute`);
    })
  }

  setMyActiveRoute(activeRoute) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let body = {
      "_links": {
        "activeRoute": activeRoute
      }
    }
    return this.http.put(`${this.userHref}/activeRoute`, body);
  }

  getMyActiveRouteAttractions(activeRoute:any) {
    return this.http.get(activeRoute._links.attractions.href);
  }

  getRoutes() {
    return this.http.get(`${apiUrl}/routes`);
  }

  getRoute(id: any) {
    return this.http.get(`${apiUrl}/routes/${id}`);
  }

  getRouteCreator(route: any) {
    return this.http.get(route._links.routeCreator.href);
  }

  getRouteAttractions(route: any) {
    return this.http.get(route._links.attractions.href);
  }

  getRouteRatings(route: any) {
    return this.http.get(route._links.ratings.href);
  }

  createRoute(routeData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${apiUrl}/routes`, routeData, httpOptions);
  }

  addAttractionToRoute(activeRoutesHref, attractionHref) {
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
    return this.http.patch(activeRoutesHref, body, httpOptions);
  }

  removeAttractionFromRoute(routeId, attractionId) {
    return this.http.delete(`${apiUrl}/routes/${routeId}/attractions/${attractionId}`);
  }

}
