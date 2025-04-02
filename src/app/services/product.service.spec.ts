import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { TokenService } from './token.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { environment } from 'src/environments/environment';
import {
  generateManyProducts,
  generateOneProduct,
} from '../models/product.mock';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models';

describe('Product Service tests', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);

      spyOn(tokenService, 'getToken').and.returnValue('123');

      //Act
      productService.getAllSimple().subscribe((data) => {
        //Assert
        expect(data).toEqual(mockData);
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);

      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');

      req.flush(mockData);
    });
  });

  describe('Tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);

      //Act
      productService.getAll().subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (doneFn) => {
      //Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * 0.19 = 19 tax
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * 0.19 = 38 tax
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 * 0.19 = 0 tax
        },
        {
          ...generateOneProduct(),
          price: -100, // -100 * 0.19 = -38 tax || impossible, fix service logic
        },
      ];

      //Act
      productService.getAll().subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19); // calculated taxes
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0); // it fails -> should fix logic in service
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;

      //Act
      productService.getAll(limit, offset).subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;

      const req = httpController.expectOne(url);

      req.flush(mockData);

      const params = req.request.params;

      //Assert
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('Tests for getOne', () => {
    it('should return a product', (doneFn) => {
      const mockData: Product = generateOneProduct();

      const productId = '1';
      productService.getOne(productId).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      });

      // HTTP config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return a 409 error', (doneFn) => {
      const productId = '1';
      const msgError = 'Algo esta fallando en el server';

      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual(msgError);
          doneFn();
        },
      });

      // HTTP config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return a 404 error', (doneFn) => {
      const productId = '1';
      const msgError = 'El producto no existe';

      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual(msgError);
          doneFn();
        },
      });

      // HTTP config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return an unauthorized error', (doneFn) => {
      const productId = '1';
      const msgError = 'No estas permitido';

      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual(msgError);
          doneFn();
        },
      });

      // HTTP config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });

  describe('Tests for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();

      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'some description',
        categoryId: 12,
      };

      // Act
      productService.create({ ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

      // Assert
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Tests for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();

      const dto: UpdateProductDTO = {
        title: 'new title update',
      };

      const productId = '1';

      // Act
      productService.update(productId, { ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('Tests for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const productId = '1';

      // Act
      productService.delete(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // HTTP Config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.method).toEqual('DELETE');
    });
  });
});
