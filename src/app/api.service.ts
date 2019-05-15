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

  getAttraction(id: any) {
    return this.http.get(`${apiUrl}/attractions-with-meta/${id}`);
  }

  getAttractionPosition(attraction: any) {
    return this.http.get(attraction._links.position.href);
  }

  getAttractions() {
    return this.http.get(`${apiUrl}/attractions-with-meta?size=40`);
  }

  findAttractionsByTitle(searchTerm: String) {
    return this.http.get(`${apiUrl}/attractions/search/findByTitleIgnoreCaseContainingAndCategory_Name?title=${searchTerm}&category=statue`);
  }

  getMyRoutes(userHref) {
    return this.http.get(`${userHref}/routes`);
  }

  getMyActiveRoute(userHref) {
    return this.http.get(`${userHref}/activeRoute`);
  }

  setMyActiveRoute(userHref, activeRoute) {
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
    return this.http.put(`${userHref}/activeRoute`, body);
  }

  getMyActiveRouteAttractions(activeRoute: any) {
    return this.http.get(activeRoute._links.attractions.href);
  }

  getRoutes() {
    return this.http.get(`${apiUrl}/routes`);
  }

  getRoute(id: any) {
    return this.http.get(`${apiUrl}/routes-with-meta/${id}`);
  }

  searchRouteByTitle(searchTerm:string) {
    return this.http.get(`${apiUrl}/routes/search/findByRouteNameIgnoreCaseContaining?routeName=${searchTerm}`)
  }

  getRouteCreator(route: any) {
    return this.http.get(`${apiUrl}/routes/${route.id}/routeCreator`);
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
}
