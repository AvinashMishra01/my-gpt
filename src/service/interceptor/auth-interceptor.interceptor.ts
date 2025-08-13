import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  let key= "your key of grock"

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
