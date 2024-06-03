import { Routes } from '@angular/router';
import { AuthGuard } from './oauth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent  },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]  },
    { path: 'products/:productId', component: ProductDetailComponent, canActivate: [AuthGuard] },
    { path: 'products/create', component: ProductDetailComponent, canActivate: [AuthGuard] },
];
