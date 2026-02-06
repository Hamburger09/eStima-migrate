// smeta-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SmetaStateService {
  // Cache for expanded works
  // Map of constructionId -> Set of expanded work codes
  expandedWorksCache = new Map<string, Set<string>>();

  constructor() {}
}
