import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../services/products/products.service';
import { Brand, BrandParams, CreateProductCommand, NetContent, Product, UpdateProductCommand } from '../services/products/product-models';

import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceDataItem } from '../services/reference-data/reference-data-models';
import { ReferenceDataService } from '../services/reference-data/reference-data.service';
import { ToastsService } from '../toasts/toasts.service';
import { ProductVariantsComponent } from '../product-variants/product-variants.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgbNavModule, ReactiveFormsModule, CommonModule, ProductVariantsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private referenceDataService: ReferenceDataService,
    private toastService: ToastsService) { }

  activeTab = 1;

  productForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    brandId: new FormControl(''),
    isBaseUnit: new FormControl<boolean>(false),
    isConsumerUnit: new FormControl<boolean>(false),
    gtin: new FormControl('')
  });

  brands: Brand[] = [];
  netContents: ReferenceDataItem[] = [];
  companyId: string | undefined;
  selectedNetContents: UnitOfMeasureItem[] = []
  isCreateMode: boolean = true;
  productId: string | undefined;

  ngOnInit(): void {
    this.filterBrands();
    this.bindRoutingParams();

    this.referenceDataService.getUnitOfMeasures().subscribe(
      netContents => {
        this.netContents = netContents;

        if (this.isCreateMode == false) {
          this.getProductDetail(this.productId!);
        }
      });


  }

  private bindRoutingParams() {
    const productId = this.route.snapshot.paramMap.get('productId');
    this.isCreateMode = productId?.toUpperCase() == 'CREATE';

    if (this.isCreateMode == false) {
      this.productId = productId?.valueOf();
    }
  }

  filterBrands() {
    const params: BrandParams = {
    };

    this.productsService.filterBrands(params).subscribe(result => {
      this.brands = result;
    });
  }

  getProductDetail(id: string) {

    this.productsService.getProductById(id).subscribe(result => {
      this.productForm.patchValue({
        name: result.productName,
        brandId: result.brandId,
        gtin: result.gtin
      });

      result.netContents?.forEach(x => {
        this.addNetContent(x.value, x.unitId, undefined);
      });
    });
  }

  onSubmitProductForm() {
    if (this.productForm?.valid) {

      if (this.isCreateMode) {
        this.createProduct();
      }
      else {
        this.updateProduct();
      }
    }
  }

  private createProduct() {
    var form = this.productForm.value;

    var command: CreateProductCommand = {
      productName: form.name!,
      companyId: this.companyId!,
      brandId: form.brandId,
      gtin: form.gtin,
      netContents: this.selectedNetContents.map(x => ({
        value: x.value,
        unitId: x.code,
      }) as NetContent
      )
    };

    this.productsService.createProduct(command).subscribe(result => {
      this.router.navigate(['/products', result.id]).then(_ => {
        this.toastService.showSuccess("Product has been created successfully");
        this.ngOnInit();
      });
    });
  }

  private updateProduct() {
    var form = this.productForm.value;

    var command: UpdateProductCommand = {
      productName: form.name!,
      brandId: form.brandId,
      gtin: form.gtin,
      netContents: this.selectedNetContents.map(x => ({
        value: x.value,
        unitId: x.code,
      }) as NetContent
      )
    };

    this.productsService.updateProduct(this.productId!, command).subscribe(_ => {
      this.toastService.showSuccess("Product has been updated successfully");
    });
  }

  addNetContent(value: string, code: string, input?: HTMLInputElement) {
    var item = this.netContents.find(x => x.code == code);
    this.selectedNetContents.push({ value, code: code, text: item!.text });

    if (input != undefined) {
      input.value = '';
    }
  }

  removeNetContent(code: string) {
    this.selectedNetContents.splice(this.selectedNetContents.findIndex(a => a.code === code), 1);
  }
}

class UnitOfMeasureItem {
  value?: string;
  code!: string;
  text!: string;
}
