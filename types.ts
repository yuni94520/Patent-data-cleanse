export interface PatentGroup {
  countryCode: string;
  patents: string[];
}

export interface ProcessingStats {
  totalLines: number;
  validPatents: number;
  uniqueCountries: number;
  unknownCount: number;
}

export interface ProcessResult {
  groups: PatentGroup[];
  stats: ProcessingStats;
  timestamp: number;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}