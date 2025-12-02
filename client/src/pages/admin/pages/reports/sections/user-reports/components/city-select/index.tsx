import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/primitives/select";
import { useTotems } from "@app/hooks/totems";

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

export const CitySelect = ({ selected, onChange }: Props) => {
  const { totems } = useTotems();

  const cities = Array.from(
    new Map(
      totems.map((totem) => [
        `${totem.nomecidade}-${totem.estado}`,
        { city: totem.nomecidade, state: totem.estado },
      ]),
    ).values(),
  );

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Cidade" />
      </SelectTrigger>
      <SelectContent>
        {cities.map(({ city, state }) => (
          <SelectItem value={`${city}-${state}`}>
            {city}/{state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
