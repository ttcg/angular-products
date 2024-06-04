import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  var totalRequests = 0;

  const loaderService = inject(LoaderService);

  totalRequests++;
  loaderService.setLoading(true);

  return next(req)
    .pipe(delay(300))
    .pipe(
      finalize(() => {
        totalRequests--;
        if (totalRequests == 0) {
          loaderService.setLoading(false);
        }
      }));
};
