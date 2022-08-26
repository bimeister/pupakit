import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {
  constructor(private readonly http: HttpClient) {}

  public getVersionPupakit(): Observable<string> {
    return this.http.get('./assets/package.json').pipe(map((config: unknown) => config['version']));
  }
}
