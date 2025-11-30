from typing import Dict, Any
from math import radians, sin, cos, sqrt, atan2

class VerifyDistanceUseCase:
    def __init__(self, totem_repository):
        self.totem_repository = totem_repository

    def _calculate_distance(self, coord1_lat: float, coord1_lon: float, coord2_lat: float, coord2_lon: float) -> float:
        R = 6371.0

        lat1_rad = radians(coord1_lat)
        lon1_rad = radians(coord1_lon)
        lat2_rad = radians(coord2_lat)
        lon2_rad = radians(coord2_lon)

        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad

        a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance = R * c
        return distance

    def execute(self, numero_serie: str, latitude: float, longitude: float) -> Dict[str, Any]:
        totem = self.totem_repository.find_by_id(numero_serie)
        
        totem_lat, totem_lon = map(float, totem['coordenadas'].split(','))
        distance = self._calculate_distance(totem_lat, totem_lon, latitude, longitude)

        return {
            "valid": distance <= 5.0
        }
