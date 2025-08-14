import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  let key= "your api key"

   if(req){
       let cloneRequest = req.clone({
        setHeaders: {
           "Authorization": `Bearer ${key}`,
           'Content-Type': 'application/json'
        } 

        })

        return next(cloneRequest)
   }


  return next(req);

};
