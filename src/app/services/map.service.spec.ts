import { TestBed } from '@angular/core/testing';
import { MapService } from './map.service';

describe('Tests for MapService', () => {
  let mapService: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService],
    });
    mapService = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(mapService).toBeTruthy();
  });

  describe('Tests for getCurrentPosition', () => {
    it('should save center property', () => {
      // Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (successFn) => {
          const mockGeolocation = {
            coords: {
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              latitude: 1000,
              longitude: 2000,
              speed: 0,
              toJSON: () => {},
            },
            timestamp: 0,
            toJSON: () => {},
          };
          successFn(mockGeolocation);
        }
      );
      // Act
      mapService.getCurrentPosition();
      // Assert
      expect(mapService.center.lat).toEqual(1000);
      expect(mapService.center.long).toEqual(2000);
    });
  });
});
