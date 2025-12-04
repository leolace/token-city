import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/primitives/select";
import { useTotems } from "@app/hooks/totems";
import type { SelectProps } from "@radix-ui/react-select";

interface Props extends SelectProps {
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CitySelect = ({
  selected,
  onChange,
  placeholder,
  ...props
}: Props) => {
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
    <Select value={selected} onValueChange={onChange} {...props}>
      <SelectTrigger className="w-full min-h-12">
        <SelectValue placeholder={placeholder || "Cidade"} />
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
