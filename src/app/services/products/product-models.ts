export interface Product {
    id: string;
    companyId: string;
    productName: string;
    gtin: string;
    brandId: string;
    brandName: string;
    isActive: string;
    netContents: NetContent[];
    modifiedBy: string;
    modifiedAt: Date;
    createdBy: string;
    createdAt: Date;
}

export interface NetContent {
    value: string;
    unitId: string;
}

export interface ProductsFilterQueryResult {
    data: Product[],
    first: number,
    prev: number,
    next: number,
    last: number,
    pages: number,
    items: number
}

export class ProductParams {
    brandId?: string;
    searchText?: string;
    _page?: number = 0;
    _per_page?: number = 10;
}

export interface Brand {
    id: string;
    companyId: string;
    brandName: string;
}

export interface PaginationStats {
    first: number,
    prev: number,
    next: number,
    last: number,
    pages: number,
    items: number
}

export class BrandParams {
    companyId?: string;
    brandName?: string
}

export class CreateProductCommand {
    companyId!: string;
    productName!: string;
    gtin?: string | null;
    brandId?: string | null;
    netContents!: NetContent[];  
}

export class UpdateProductCommand {    
    productName!: string;
    gtin?: string | null;
    brandId?: string | null;
    netContents!: NetContent[];
}

export interface ProductCommandResult {
    id: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    supplierCompanyId: string;
    ownerCompanyId: string;
    productVariantName: string;
    countriesOfOrigin: string[];
}

export class CreateProductVariantCommand {
    productId!: string;
    supplierCompanyId!: string;
    productVariantName?: string | null;
    countriesOfOrigin!: string[];
}

export class UpdateProductVariantCommand {    
    productId!: string;
    supplierCompanyId!: string;
    productVariantName?: string | null;
    countriesOfOrigin!: string[];
}

export interface ProductVariantCommandResult {
    id: string;
}