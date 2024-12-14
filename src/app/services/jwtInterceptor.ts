import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    console.log('token');
    const reqWithHeader = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(reqWithHeader);
  } else {
    console.log('no token');
  }

  return next(req);
};
