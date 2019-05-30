import { apiUrl } from '../../environments/environment';
import { StorageMock } from './storage';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import predefinedRoutes from '../fixtures/predefinedRoutes';
import creators from '../fixtures/creators';
import reviews from '../fixtures/reviews';

export class ApiServiceMock {

    private userHref: any;
    storage = {
        userHref: '/user/1',
        user: {},
    }

constructor() {

}

async getUser() {
    return await of(this.storage.userHref);
}

patchUserProfilePicture(userHref, picture: string) {
    return of;
}

findByEmail(username: string) { }

createUser(userData) { }

addToSeenAttractions(userHref, attractionId) { }


saveUserSpot(spotData) { }

addPositionToAttraction(attractionId, positionId) { }

getAttraction(id: any) { }

getAttractionPosition(attraction: any) { }

getAttractions() { }

deleteSpot(id) { }

findAttractionsByTitle(searchTerm: String) { }

getRoutesByUser(userId) {
    return of(predefinedRoutes);
}

getMyRoutes(userHref) { }

getRouteWithMeta(routeId) { }

getRoutesWithMeta() { }

getMyActiveRoute(userHref) { }

setMyActiveRoute(userHref, activeRouteId) { }

unsetMyActiveRoute(userHref) { }

getMyActiveRouteAttractions(activeRoute: any) { }

getRoutes() { }

getRoute(id: any) { }

deleteRoute(id: any) { }

searchRouteByTitle(searchTerm: string) { }

getRouteCreator(routeId: any) { }

getRouteAttractions(route: any) { }

getRouteRatings(route: any) { }

patchRoute(routeId, routeData) { }

createRoute(routeData) { }

addAttractionToRoute(activeRouteId, attractionId) { }

addPosition(positionData) { }

removeAttractionFromRoute(routeId, attractionId) { }

getCreators() { return of(creators)}

getCreator(creatorId) { }

getCreatorAttractions(creator) { }

findCreatorsByName(searchTerm: String) { }

getReview(reviewId) { return of(reviews[0])}

deleteReview(reviewId) { }

patchReview(reviewId, patchData) { }

createReview(routeId, userHref, reviewData) { return of({})}



}
