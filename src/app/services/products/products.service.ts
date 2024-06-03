import { Injectable } from '@angular/core';
import { Brand, BrandParams, CreateProductCommand, CreateProductVariantCommand, Product, ProductCommandResult, ProductParams, ProductVariant, ProductVariantCommandResult, ProductsFilterQueryResult, UpdateProductCommand, UpdateProductVariantCommand } from './product-models';
import { Observable, catchError } from 'rxjs';
import { AppConfig } from '../../config/appConfig';
import { HttpClient, HttpParams } from '@angular/common/http';
import { handleError } from '../utility';
import { ToastsService } from '../../toasts/toasts.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient,
    private toastsService: ToastsService) { }

  filterProducts(params?: ProductParams): Observable<ProductsFilterQueryResult> {

    const url = `${AppConfig.apiUrl}/products`;
    const httpParams = new HttpParams({ fromObject: { ...params } });

    return this.http.get<ProductsFilterQueryResult>(url,      
      {
        params: httpParams
      })
      .pipe(
        catchError(handleError<ProductsFilterQueryResult>('filterProducts'))
      );
  }

  filterBrands(params?: BrandParams): Observable<Brand[]> {

    const url = `${AppConfig.apiUrl}/brands`;

    return this.http.get<Brand[]>(url,
      {
        params: new HttpParams({ fromObject: { ...params } })
      })
      .pipe(
        catchError(handleError<Brand[]>('filterProducts'))
      );
  }

  deleteProduct(productId: string): Observable<any> {

    const url = `${AppConfig.apiUrl}/products/${productId}`;

    return this.http.delete<any>(url)
      .pipe(
        catchError(handleError<any>('deleteProduct'))
      );
  }

  getProductById(id: string): Observable<Product> {

    const url = `${AppConfig.apiUrl}/products/${id}`;

    return this.http.get<Product>(url)
      .pipe(
        catchError(handleError<Product>('getProductById'))
      );
  }

  createProduct(command: CreateProductCommand): Observable<ProductCommandResult> {
    const url = `${AppConfig.apiUrl}/products`;

    return this.http.post<ProductCommandResult>(url,
      command)
      .pipe(
        catchError(handleError<ProductCommandResult>('createProduct'))
      );
  }

  updateProduct(id: string, command: UpdateProductCommand): Observable<ProductCommandResult> {
    const url = `${AppConfig.apiUrl}/products/${id}`;

    return this.http.put<ProductCommandResult>(url,
      command)
      .pipe(
        catchError(handleError<ProductCommandResult>('updateProduct'))
      );
  }

  createProductVariant(command: CreateProductVariantCommand): Observable<ProductVariantCommandResult> {
    const url = `${AppConfig.apiUrl}/product-variants/`;

    return this.http.post<ProductVariantCommandResult>(url,
      command)
      .pipe(
        catchError(_ => {
          this.toastsService.showError();
          throw handleError<ProductVariantCommandResult>('createProductVariant'); 
        })        
      );
  }

  updateProductVariant(productVariantId: string, command: UpdateProductVariantCommand): Observable<ProductVariantCommandResult> {
    const url = `${AppConfig.apiUrl}/product-variants/${productVariantId}`;

    return this.http.put<ProductVariantCommandResult>(url,
      command)
      .pipe(
        catchError(_ => {
          this.toastsService.showError();
          throw handleError<ProductVariantCommandResult>('updateProductVariant'); 
        })        
      );
  }

  filterProductVariants(productId: string): Observable<ProductVariant[]> {

    const url = `${AppConfig.apiUrl}/product-variants`;
    const httpParams = new HttpParams({ fromObject: { productId: productId } });

    return this.http.get<ProductVariant[]>(url,
      {
        params: httpParams
      })
      .pipe(
        catchError(handleError<ProductVariant[]>('filterProductVariants'))
      );
  }
}
