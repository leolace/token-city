import { FileInput, FilePreview } from "@app/components/file-input";
import { Button } from "@app/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/primitives/card";
import { Textarea } from "@app/components/primitives/textarea";
import { Toggle } from "@app/components/primitives/toggle";
import { useLocationStore } from "@app/stores/location-store";
import { Mic } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const reportCategories = [
  { id: "iluminacao", label: "Iluminação" },
  { id: "asfaltamento", label: "Asfaltamento" },
  { id: "queda-arvore", label: "Queda de árvore" },
  { id: "animal-abandonado", label: "Animal abandonado" },
  { id: "outro", label: "Outro" },
];

export const ReportForm = () => {
  const navigate = useNavigate();
  const { latitude, longitude } = useLocationStore();
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const isSubmitAllowed =
    description.length > 0 && selectedCategories.length > 0;

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleImageUpload = (files: FileList) => {
    setImages([...images, ...Array.from(files)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitAllowed) return;
    // Lógica de envio
    console.log({
      description,
      categories: selectedCategories,
      images,
      latitude,
      longitude,
    });

    navigate("/report/success");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full w-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl">Denúncia</CardTitle>
        </CardHeader>
        <CardContent className="grid h-full gap-6">
          <div className="w-full grid grid-cols-[1fr_auto] gap-3">
            <Textarea
              placeholder="Descrição adicional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 m md:text-xl"
            />
            <Button size="xl" className="h-full">
              <Mic size={32} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {reportCategories.map((category) => (
              <Toggle
                key={category.id}
                variant="outline"
                pressed={selectedCategories.includes(category.id)}
                onPressedChange={() => toggleCategory(category.id)}
                size="xl"
              >
                {category.label}
              </Toggle>
            ))}
          </div>

          <div className="w-full grid gap-3">
            <FileInput
              onUpload={handleImageUpload}
              id="image-upload"
              multiple
              accept="image/*"
            />
            <FilePreview images={images} setImages={setImages} />
          </div>

          <div className="flex gap-3 w-full self-end">
            <Button
              type="button"
              variant="outline"
              size="2xl"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              size="2xl"
              disabled={!isSubmitAllowed}
            >
              Enviar denúncia
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
