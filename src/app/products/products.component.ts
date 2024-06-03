import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products/products.service';
import { Brand, BrandParams, Product, PaginationStats, ProductParams } from '../services/products/product-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, fromEvent, map, switchMap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products: Product[] = [];
  brands: Brand[] = [];
  pagination?: PaginationStats;
  currentPage: number = 1;
  recordsPerPage: number = 5;
  filters = {
    searchTerm: '',
    status: ''
  }
  showBrands = false;
  companyId: string | undefined;
  brand?: Brand;
  selectedBrandName: string | undefined;

  @ViewChild('brandSearchInput', { static: false }) brandInput!: ElementRef;


  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.companyId = "501";
    this.filterProducts();
    this.loadBrands();
  }

  ngAfterViewInit() {
    this.brandSearch();
  }

  getProductStatus = (status: string) => status == 'true' ? 'Archived' : 'Active';

  loadBrands() {
    this.filterBrands().subscribe(result => {
      this.brands = result;
    });
  }

  filterBrands(searchTerm: string | null = null): Observable<Brand[]> {

    const params: BrandParams = {
      companyId: this.companyId,
    };

    if (searchTerm !== null) {
      params.brandName = searchTerm;
    }

    return this.productsService.filterBrands(params);
  }

  brandSearch() {

    // Adding keyup Event Listerner on input field
    const search$ = fromEvent(this.brandInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) => this.filterBrands(term))
    );

    search$.subscribe(data => {
      this.brands = data;
    })
  }

  getBrandById(brandId: string) {
    console.log(brandId)
    console.log(this.brands)
    var brand = this.brands.find(x => x.id == brandId);
    return brand?.brandName ?? "";
  }

  filterProducts(currentPage: number | null = null) {

    if (currentPage !== null) {
      this.currentPage = currentPage;
    }    

    var params: ProductParams = {
      _per_page: this.recordsPerPage,
      _page: this.currentPage ?? 1
    };

    if (this.brand !== undefined) {
      params.brandId = this.brand.id;
    };

    this.productsService.filterProducts(params).subscribe(result => {
      this.products = result.data;
      this.pagination = result;
    });
  }

  get totalPages(): number {
    if (!this.pagination) {
      return 0;
    }

    return this.pagination.pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;

      this.filterProducts();
    }
  }

  toggleBrandDropdown() {
    this.showBrands = !this.showBrands;
  }

  selectBrand(selectedBrand: Brand) {
    this.brand = selectedBrand;
    this.toggleBrandDropdown();
  }

  clearFilters() {
    this.brand = undefined;
    this.filters.searchTerm = '';
    this.showBrands = false;
    this.filterProducts();
  }

  deleteProduct(productId: string) {
    this.productsService.deleteProduct(productId).subscribe(_ => {
      this.filterProducts();
    });
  };
}
