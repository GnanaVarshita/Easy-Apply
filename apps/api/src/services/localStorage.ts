import { CompanyCareerLink, ApplicationRecord } from '@velmurugan/shared';

let memoryCompanyLinks: CompanyCareerLink[] = [];
let memoryApplications: ApplicationRecord[] = [];

export function loadLocalCompanyLinks(): CompanyCareerLink[] {
  return memoryCompanyLinks;
}

export function saveLocalCompanyLinks(links: CompanyCareerLink[]): void {
  memoryCompanyLinks = links;
}

export function loadLocalApplications(): ApplicationRecord[] {
  return memoryApplications;
}

export function saveLocalApplications(apps: ApplicationRecord[]): void {
  memoryApplications = apps;
}
