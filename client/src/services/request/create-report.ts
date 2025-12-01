export interface CreateReportRequest {
  userid: string;
  content: string;
  category: string;
  totem: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
  image: string;
}
