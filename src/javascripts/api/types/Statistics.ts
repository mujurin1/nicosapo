import { NicoMeta } from "./Meta";

export interface StatisticsResponse extends NicoMeta {
  data: Statistics;
}

export interface Statistics {
  watchCount: number;
  commentCount: number;
}


