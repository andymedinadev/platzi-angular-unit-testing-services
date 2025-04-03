import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  center = { lat: 0, long: 0 };

  constructor() {}

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((response) => {
      const { latitude, longitude } = response.coords;

      this.center = { lat: latitude, long: longitude };
    });
  }
}
