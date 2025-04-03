import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { Auth } from '../models';

describe('AuthService Tests', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenService],
    });

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('Tests for login method', () => {
    it('should return a token', (doneFn) => {
      // Arrange
      const mockData: Auth = {
        access_token: '123456',
      };

      const mockEmail = 'user@mail.com';
      const mockPassword = 'strongPassword';

      // Act
      authService.login(mockEmail, mockPassword).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // HTTP config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should save the token', (doneFn) => {
      // Arrange
      const mockData: Auth = {
        access_token: '123456',
      };

      const mockEmail = 'user@mail.com';
      const mockPassword = 'strongPassword';

      spyOn(tokenService, 'saveToken').and.callThrough();

      // Act
      authService.login(mockEmail, mockPassword).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith(
          mockData.access_token
        );
        doneFn();
      });

      // HTTP config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });
});
