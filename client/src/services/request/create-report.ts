export interface CreateReportRequest {
  userid: string;
  content: string;
  category: string;
  totem: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image: string;
}
