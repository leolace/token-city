import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/primitives/select";
import { ReportCategory } from "@app/types/report";

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySelect = ({
  selectedCategory,
  onCategoryChange,
}: Props) => {
  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ReportCategory.Iluminacao}>
          {ReportCategory.Iluminacao}
        </SelectItem>
        <SelectItem value={ReportCategory.Buraco}>
          {ReportCategory.Buraco}
        </SelectItem>
        <SelectItem value={ReportCategory.Lixo}>
          {ReportCategory.Lixo}
        </SelectItem>
        <SelectItem value={ReportCategory.Calcada}>
          {ReportCategory.Calcada}
        </SelectItem>
        <SelectItem value="all">Todas</SelectItem>
      </SelectContent>
    </Select>
  );
};
