

export class GeolocationMock {
    latitude = 1;
    longitude = 1;

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            resolve(
                {
                    coords: {
                        latitude: this.latitude,
                        longitude: this.longitude
                    }
                });
        });
    }

    watchPosition: () => {};
}