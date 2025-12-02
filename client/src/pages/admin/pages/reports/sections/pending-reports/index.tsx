import { Card, CardContent } from "@app/components/primitives/card";
import { useReports } from "./hooks";
import { Map } from "./components/map";
import { CategorySelect } from "./components/category-select";
import { ReportList } from "../../components/report-list";

export const PendingReports = () => {
  const {
    handleTotemClick,
    pendingReports,
    selectedCategory,
    selectedTotem,
    setSelectedCategory,
    setSelectedTotem,
    totemMap,
  } = useReports();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Denúncias pendentes</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] rounded-lg overflow-hidden border">
        <div className="h-[600px] overflow-hidden">
          <Map
            reports={pendingReports}
            selectedTotem={selectedTotem}
            setSelectedTotem={setSelectedTotem}
            mapRef={totemMap}
          />
        </div>

        <Card className="rounded-l-none border-0">
          <CardContent className="grid gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-sidebar-foreground">
                Totems e Denúncias
              </h3>
              <CategorySelect
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            <ReportList
              handleTotemClick={handleTotemClick}
              selectedTotem={selectedTotem}
              pendingReports={pendingReports}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
