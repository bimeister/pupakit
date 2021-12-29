import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HugeTreeItem } from '../../../../../internal/declarations/interfaces/huge-tree-item.interface';
import { HugeTreeItemsQuery } from '../../../../../internal/declarations/interfaces/huge-tree-items-query.interface';

interface TreeView {
  key: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class HugeTreeDemoRequestsService {
  private readonly requestUrl: string = `https://sb16.bimeister.com/api/Trees`;

  private readonly requestHttpHeaders: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OTY5YjY1NC05NzExLTQ2OWItOGVjZS0yOTcyYjZkMjE0OWEiLCJpc3MiOiJodHRwOi8vd2ViYXBpIiwiaWF0IjoxNjM5NzUzNTMwLCJzaWQiOiJkMGMxZTljZS1lNzI2LTQ2ODctYmZjMi1iYjJmZDY1OTcyY2UiLCJzdWIiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJkaXNwbGF5X25hbWUiOiJTeXN0ZW0gQWRtaW5pc3RyYXRvciIsInRlbmFudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInVzZXJfcm9sZSI6ImFkbWluIiwibmJmIjoxNjM5NzUzNTMwLCJleHAiOjE2NDUwMzM1MzAsImF1ZCI6Imh0dHA6Ly9mcm9udGVuZCJ9.MMT0y15p2h4m39AzU6A1corCt92XcXmsIBLGF73z0Ok`,
  });

  constructor(private readonly httpClient: HttpClient) {}

  public get(): Observable<TreeView[]> {
    return this.httpClient.get<TreeView[]>(this.requestUrl, {
      headers: this.requestHttpHeaders,
    });
  }
  public postTreeItems(
    query: HugeTreeItemsQuery,
    treeKey: string = 'output2.csv'
  ): Observable<HttpResponse<HugeTreeItem[]>> {
    return this.httpClient.post<HugeTreeItem[]>(`${this.requestUrl}/${treeKey}/TreeItems`, query, {
      headers: this.requestHttpHeaders,
      observe: 'response',
    });
  }

  public getParents(entityId: string, treeKey: string = 'output2.csv'): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.requestUrl}/${treeKey}/${entityId}/Parents`, {
      headers: this.requestHttpHeaders,
    });
  }

  public postIndex(entityId: string, expandedItemIds: string[], treeKey: string = 'output2.csv'): Observable<number> {
    return this.httpClient.post<number>(`${this.requestUrl}/${treeKey}/TreeItems/${entityId}/Index`, expandedItemIds, {
      headers: this.requestHttpHeaders,
    });
  }
}
