import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';
import { Product } from '../models';

fdescribe('Product Service tests', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = [
        {
          id: '123',
          title: 'title',
          description: '',
          price: 12,
          category: {
            id: 123,
            name: 'categoryName',
          },
          images: ['img', 'img'],
        },
      ];

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
      req.flush(mockData);
      httpController.verify();
    });
  });
});
