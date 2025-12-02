import { useState } from "react";
import { CitySelect } from "./components/city-select";
import { Card, CardContent } from "@app/components/primitives/card";
import { Badge } from "@app/components/primitives/badge";
import { Item, ItemContent, ItemHeader } from "@app/components/primitives/item";
import dayjs from "dayjs";
import { useGetMostRecentsReportsByCity } from "./hooks";

export const UserReports = () => {
  const [city, setCity] = useState<string>("São Paulo-SP");
  const [cityName, cityState] = city.split("-");
  const { reports, isReportsLoading } = useGetMostRecentsReportsByCity({
    city: cityName,
    state: cityState,
  });

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Denúncias por denunciante</h2>
      <CitySelect onChange={setCity} selected={city} />

      {isReportsLoading ? (
        <p className="text-sidebar-foreground/70">Carregando denúncias...</p>
      ) : (
        <div className="space-y-4">
          {reports?.map((userReport) => (
            <Card key={userReport.nomeUsuario}>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-sidebar-foreground">
                      {userReport.nomeUsuario}
                    </h3>
                    <p className="text-sm text-sidebar-foreground/70">
                      {userReport.totalDenuncias}{" "}
                      {userReport.totalDenuncias === 1
                        ? "denúncia"
                        : "denúncias"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  {userReport.denuncias.map((report, idx) => (
                    <Item key={idx} variant="outline">
                      <ItemHeader>
                        <div className="flex justify-between w-full">
                          <p className="font-medium">{report.descricao}</p>
                          <p className="text-sm">
                            {dayjs(report.data).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      </ItemHeader>
                      <ItemContent>
                        <div className="flex gap-2 flex-wrap items-center">
                          <Badge>{report.categoria}</Badge>
                          <Badge variant="secondary">{report.status}</Badge>
                        </div>
                      </ItemContent>
                    </Item>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {reports.length === 0 && (
            <Card>
              <CardContent>
                <p className="text-sidebar-foreground/70 text-center py-8">
                  Nenhuma denúncia encontrada
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
