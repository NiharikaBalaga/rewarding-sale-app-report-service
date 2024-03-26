import type { DirectionsRequest } from '@googlemaps/google-maps-services-js';
import { Client, Language, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';

type Location = {
  longitude: number,
  latitude: number
};
class LocationService {
  private static googleMapsClient = new Client();
  static async getDistanceBetweenUserAndStore(userLocation: Location, storePlaceId: string) {
    try {
      const directionRequest: DirectionsRequest = {
        params: {
          key: process.env.GOOGLE_MAPS_ROUTES_API_KEY || '',
          origin: {
            longitude: userLocation.longitude,
            latitude: userLocation.latitude
          },
          destination: `place_id:${storePlaceId}`,
          mode: TravelMode.walking,
          language: Language.en,
          units: UnitSystem.metric,
          region: 'ca',
        }
      };
      const response = await this.googleMapsClient.directions(directionRequest);

      if (response.data.status !== 'OK')
        throw new Error(`Directions request failed with status: ${response.data.status}`);
      return response.data.routes[0].legs[0].distance.value;
    } catch (error) {
      console.error('getStoreDistance-error', error);
      throw error;
    }
  }
}

export {
  LocationService
};