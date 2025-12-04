import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@app/components/primitives/card";
import { Button } from "@app/components/primitives/button";
import { Input } from "@app/components/primitives/input";
import { Label } from "@app/components/primitives/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/primitives/dialog";
import { useTotems } from "@app/hooks/totems";
import { coreService } from "@app/services";
import { Plus, Trash2 } from "lucide-react";
import type { CreateTotemRequest } from "@app/services/request/create-totem";
import type { DeleteTotemRequest } from "@app/services/request/delete-totem";
import { TotemMap } from "@app/components/totem-map";
import { TotemMark } from "@app/components/totem-mark";
import { getCords } from "@app/utils/get-cords";
import { CitySelect } from "@app/components/city-select";

const defaultForm = {
  numero_serie: "",
  nome_cidade: "",
  estado: "",
  latitude: 0,
  longitude: 0,
  status: "Ativo",
  data_instalacao: new Date().toISOString().split("T")[0],
};

export const TotemPage = () => {
  const { totems } = useTotems();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [totemToDelete, setTotemToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTotemRequest>(defaultForm);

  const createMutation = useMutation({
    mutationFn: (data: CreateTotemRequest) => coreService.totem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["totems"] });
      setIsOpen(false);
      setFormData(defaultForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: DeleteTotemRequest) => coreService.totem.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["totems"] });
      setDeleteDialogOpen(false);
      setTotemToDelete(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (
    field: keyof CreateTotemRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (numero_serie: string) => {
    setTotemToDelete(numero_serie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (totemToDelete) {
      deleteMutation.mutate({ numero_serie: totemToDelete });
    }
  };

  return (
    <div className="grid gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Totems</h1>
          <p className="text-sidebar-foreground/70 mt-1">
            Visualize e gerencie todos os totems do sistema
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Totem
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[800px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Totem</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_serie">Número de Série</Label>
                  <Input
                    id="numero_serie"
                    value={formData.numero_serie}
                    onChange={(e) =>
                      handleChange("numero_serie", e.target.value)
                    }
                    placeholder="TOTEM001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    placeholder="Ativo"
                    required
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="cidade">Cidade</Label>
                  <CitySelect
                    selected={`${formData.nome_cidade}-${formData.estado}`}
                    onChange={(value) => {
                      const [city, state] = value.split("-");

                      handleChange("nome_cidade", city);
                      handleChange("estado", state);
                    }}
                    placeholder="Selecione uma cidade"
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Coordenadas</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="latitude"
                        className="text-sm text-muted-foreground"
                      >
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) =>
                          handleChange("latitude", parseFloat(e.target.value))
                        }
                        placeholder="-23.550520"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="longitude"
                        className="text-sm text-muted-foreground"
                      >
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) =>
                          handleChange("longitude", parseFloat(e.target.value))
                        }
                        placeholder="-46.633309"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clique no mapa abaixo para selecionar a localização
                  </p>
                  <div className="w-full h-[300px] rounded-lg overflow-hidden border">
                    <TotemMap
                      initialViewState={{
                        zoom: 5,
                        latitude: formData.latitude || -23.55052,
                        longitude: formData.longitude || -46.633308,
                      }}
                      onClick={(e) => {
                        if (e.lngLat) {
                          handleChange("latitude", e.lngLat.lat);
                          handleChange("longitude", e.lngLat.lng);
                        }
                      }}
                      style={{ cursor: "crosshair" }}
                    >
                      {formData.latitude !== 0 && formData.longitude !== 0 && (
                        <TotemMark
                          latitude={formData.latitude}
                          longitude={formData.longitude}
                          tooltip={{
                            content: "Localização selecionada",
                            options: { defaultOpen: false },
                          }}
                        />
                      )}
                    </TotemMap>
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="data_instalacao">Data de Instalação</Label>
                  <Input
                    id="data_instalacao"
                    type="date"
                    value={formData.data_instalacao}
                    onChange={(e) =>
                      handleChange("data_instalacao", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          {totems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sidebar-foreground/70">
                Nenhum totem cadastrado
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      Número de Série
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Cidade
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Coordenadas
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {totems.map((totem) => (
                    <tr
                      key={totem.numero_serie}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">
                        {totem.numero_serie}
                      </td>
                      <td className="py-3 px-4">{totem.nomecidade}</td>
                      <td className="py-3 px-4">{totem.estado}</td>
                      <td className="py-3 px-4 font-mono text-sm">
                        {totem.coordenadas}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(totem.numero_serie)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <TotemMap
          initialViewState={{
            zoom: 5,
            latitude: -23.55052,
            longitude: -46.633308,
          }}
        >
          {totems.map((totem, index) => (
            <TotemMark
              key={index}
              tooltip={{
                content: totem.numero_serie,
                options: { defaultOpen: false },
              }}
              {...getCords(totem.coordenadas)}
            />
          ))}
        </TotemMap>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sidebar-foreground/70">
            Tem certeza que deseja deletar o totem{" "}
            <span className="font-semibold">{totemToDelete}</span>? Esta ação
            não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deletando..." : "Deletar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
