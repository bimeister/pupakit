import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExamplesRequestsService {
  private readonly requestsBase: string = '/examples';

  constructor(private readonly httpClient: HttpClient) {}

  public getExampleRawFile(requestPath: string): Observable<string> {
    return this.httpClient
      .get(`${this.requestsBase}/${requestPath}`, { responseType: 'blob' })
      .pipe(switchMap((response: Blob) => from(response.text())));
  }
}
