import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExeService {
  private baseUrl = `${environment.delphiUrl}/setup`;

  constructor(private http: HttpClient) {}

  getExeData(data: any, cancel$: Subject<void>): Observable<Blob> {
    return this.http
      .post<Blob>(this.baseUrl, data, {
        responseType: 'blob' as 'json', // 👈 force Angular to treat it as Blob
      })
      .pipe(
        takeUntil(cancel$) // 👈 cancel when Subject emits
      );
  }
}
