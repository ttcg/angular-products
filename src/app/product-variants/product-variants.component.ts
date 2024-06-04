import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from '../services/companies/companies.service';
import { CreateProductVariantCommand, ProductVariant, UpdateProductVariantCommand } from '../services/products/product-models';
import { ProductsService } from '../services/products/products.service';
import { ReferenceDataService } from '../services/reference-data/reference-data.service';
import { ReferenceDataItem } from '../services/reference-data/reference-data-models';
import { ToastsService } from '../toasts/toasts.service';
import { Company } from '../services/companies/company-models';

@Component({
  selector: 'app-product-variants',
  standalone: true,
  imports: [NgbAccordionModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product-variants.component.html',
  styleUrl: './product-variants.component.css'
})
export class ProductVariantsComponent {

  constructor(private fb: FormBuilder,
    private companiesService: CompaniesService,
    private referenceDataService: ReferenceDataService,
    private productService: ProductsService,
    private toastService: ToastsService) { }

  @Input()
  productId!: string;

  getNewVariantForm = () => this.fb.group({
    keyId: new FormControl(this.generateGuid()),
    name: new FormControl(''),
    supplierCompanyId: new FormControl('', [Validators.required]),
    isCreateMode: new FormControl(true),
  });

  variantForm = this.fb.group({
    variants: this.fb.array([
      this.getNewVariantForm()
    ])
  })

  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  get variantForms(): any {
    return this.variantForm.get('variants') as FormArray;
  }

  get canAddNewVariantForm() {
    var count = this.variantForms.value.filter((x: { isCreateMode: boolean; }) => x.isCreateMode).length;

    return count < 1;
  }

  addNewVariantForm() {
    this.variantForms.push(this.getNewVariantForm());
  }

  companies: Company[] = [];
  countries: ReferenceDataItem[] = [];
  selectedCountries: CountryItem[] = [];
  selectedCountriesDictionary: Record<string, CountryItem[]> = {};
  variants: ProductVariant[] = [];

  hasProductVariant = () => this.variants.length > 0;

  ngOnInit(): void {
    this.filterCompanies();

    this.getCountries().subscribe(
      countries => {
        this.countries = countries;

        this.filterProductVariants();
      });
  }

  filterCompanies() {

    this.companiesService.filterCompanies("Supplier").subscribe(result => {
      this.companies = result;
    });
  }

  getProductVariantName(form: any) {
    let item = form.getRawValue();

    const company = this.companies.find(x => x.id == item.supplierCompanyId);

    let name = 'New Product Variant';

    if (item.name !== '' && company != null) {
      name = `${item.name} (${company.name})`;
    }
    else if (company != null) {
      name = company.name;
    }
    else if (item.name !== '') {
      name = item.name;
    }

    return name;
  }

  filterProductVariants() {
    this.productService.filterProductVariants(this.productId).subscribe(result => {
      this.variants = result;

      this.filterCompanies();

      this.variantForm = this.fb.group({
        variants: this.fb.array(this.variants.map(r => this.fb.group({
          keyId: new FormControl(r.id),
          name: new FormControl(r.productVariantName),
          supplierCompanyId: new FormControl(r.supplierCompanyId, [Validators.required]),
          isCreateMode: new FormControl(false)
        })))
      })

      this.variants.forEach(x => x.countriesOfOrigin.forEach(y => this.addCountry(x.id, y)));

      // if it's empty, push the first one
      if (!this.hasProductVariant()) {
        this.addNewVariantForm()
      }
    });
  }

  getCountries() {
    return this.referenceDataService.getCountries();
  }

  addCountry(key: string, code: string) {

    if (code === '')
      return;

    var item = this.countries.find(x => x.code == code);

    if (this.selectedCountriesDictionary[key] == null) {
      this.selectedCountriesDictionary[key] = [];
    }

    if (this.selectedCountriesDictionary[key].findIndex(a => a.id === code) < 0) {
      this.selectedCountriesDictionary[key].push({ id: code, text: item!.text, code: item!.code });
    }

    //console.log(this.selectedCountriesDictionary);
  }

  removeCountry(key: string, code: string) {
    this.selectedCountriesDictionary[key].splice(this.selectedCountriesDictionary[key].findIndex(a => a.id === code), 1);
  }

  getSelectedCountries(key: string) {
    return this.selectedCountriesDictionary[key] ?? [];
  }

  onSubmitForm(formIndex: number) {
    var currentForm = this.variantForms.at(formIndex);

    if (currentForm.valid) {
      if (currentForm.value.isCreateMode) {
        this.createProductVariant(currentForm.value);
      }
      else {
        this.updateProductVariant(currentForm.value);
      }
    }
  }

  private createProductVariant(form: any) {

    var command: CreateProductVariantCommand = {
      productId: this.productId,
      supplierCompanyId: form.supplierCompanyId!,
      productVariantName: form.name,
      countriesOfOrigin: this.getSelectedCountries(form.keyId).map(x => x.code)
    };

    this.productService.createProductVariant(command).subscribe(result => {
      this.toastService.showSuccess("Product variant has been added successfully");
      this.filterProductVariants();
    });
  }

  private updateProductVariant(form: any) {

    var command: UpdateProductVariantCommand = {
      productId: this.productId,
      supplierCompanyId: form.supplierCompanyId!,
      productVariantName: form.name,
      countriesOfOrigin: this.getSelectedCountries(form.keyId).map(x => x.code)
    };

    this.productService.updateProductVariant(form.keyId, command).subscribe(result => {
      this.toastService.showSuccess("Product variant has been updated successfully");
    });
  }
}

class CountryItem {
  id!: string;
  text!: string;
  code!: string;
}
