import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantsComponent } from './product-variants.component';

describe('ProductVariantsComponent', () => {
  let component: ProductVariantsComponent;
  let fixture: ComponentFixture<ProductVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVariantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
