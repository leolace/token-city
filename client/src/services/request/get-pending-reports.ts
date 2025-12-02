export interface GetPendingReportsRequest {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  category?: string;
}
