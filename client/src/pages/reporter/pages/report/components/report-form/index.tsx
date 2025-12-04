import { Button } from "@app/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/primitives/card";
import { Textarea } from "@app/components/primitives/textarea";
import { Toggle } from "@app/components/primitives/toggle";
import { useLocationStore } from "@app/stores/location";
import { useForm } from "@tanstack/react-form";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router";
import type { CreateReportForm } from "./types";
import { useUserStore } from "@app/stores/user";
import { useReportCreateMutation } from "./hooks";
import { Input } from "@app/components/primitives/input";
import { useQuery } from "@tanstack/react-query";
import { client } from "@app/services/client";
import { endpoints } from "@app/services/endpoints";
import { Spinner } from "@app/components/primitives/spinner";

const defaultValues: CreateReportForm = {
  content: "",
  category: "",
  image: "",
};

export const ReportForm = () => {
  const navigate = useNavigate();
  const { reporter } = useUserStore();
  const { latitude, longitude } = useLocationStore();
  const { reportCreateMutate } = useReportCreateMutation();

  const totemId = "TOTEM004"; // TODO: Determinar totem baseado na localização

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories", "totem", totemId],
    queryFn: async () => {
      const data = await client.get(endpoints.department.categoriesByTotem(totemId)).json<Array<{ nome: string }>>();
      return data;
    },
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log({ ...value, latitude, longitude, userid: reporter?.cpf });

      if (
        !reporter ||
        !latitude ||
        !longitude ||
        !value.content ||
        !value.category
      )
        return;

      await reportCreateMutate(
        {
          coordinates: { latitude, longitude },
          userid: reporter.cpf,
          category: value.category,
          content: value.content,
          image: value.image,
          totem: totemId,
        },
        {
          onSuccess: () => {
            navigate("/report/success");
          },
        }
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(e);
      }}
      className="space-y-6 h-full w-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl">Denúncia</CardTitle>
        </CardHeader>
        <CardContent className="grid h-full gap-6">
          <form.Field
            name="content"
            children={(field) => (
              <div className="w-full grid grid-cols-[1fr_auto] gap-3">
                <Textarea
                  placeholder="Descrição adicional"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="min-h-32 m md:text-xl"
                />
                <Button size="xl" className="h-full">
                  <Mic size={32} />
                </Button>
              </div>
            )}
          />

          <form.Field
            name="category"
            children={(field) => (
              <div className="flex flex-wrap gap-2">
                {loadingCategories ? (
                  <div className="flex justify-center w-full py-4">
                    <Spinner />
                  </div>
                ) : (
                  categories?.map((category) => (
                    <Toggle
                      key={category.nome}
                      variant="outline"
                      pressed={field.state.value === category.nome}
                      onPressedChange={() => field.handleChange(category.nome)}
                      size="xl"
                    >
                      {category.nome}
                    </Toggle>
                  ))
                )}
              </div>
            )}
          />

          <form.Field
            name="image"
            children={(field) => (
              <Input
                placeholder="URL da imagem"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <div className="flex gap-3 w-full self-end">
            <Button
              type="button"
              variant="outline"
              size="2xl"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>

            <form.Subscribe
              children={(state) => (
                <Button
                  type="submit"
                  className="flex-1"
                  size="2xl"
                  disabled={!state.canSubmit}
                >
                  Enviar denúncia
                </Button>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
