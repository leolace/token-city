import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@app/components/primitives/dialog";
import { Button } from "@app/components/primitives/button";
import { Label } from "@app/components/primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/primitives/select";
import type { Report } from "@app/types/report";
import { updateReportStatus } from "@app/services/request";
import { useOperatorStore } from "@app/stores/operator";

interface Props {
  report: Report;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  Registrada: ["Em Validação", "Rejeitada"],
  "Em Validação": ["Em Andamento", "Rejeitada"],
  "Em Andamento": ["Resolvida", "Rejeitada"],
  Resolvida: [],
  Rejeitada: [],
};

export const UpdateStatusDialog = ({ report, open, onOpenChange }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();
  const { operator } = useOperatorStore();

  const mutation = useMutation({
    mutationFn: updateReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      onOpenChange(false);
      setSelectedStatus("");
      setError("");
      alert("Status atualizado com sucesso!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Erro ao atualizar status";
      setError(errorMessage);
    },
  });

  const handleSubmit = () => {
    if (!selectedStatus || !report.usuario || !operator?.matricula) return;

    mutation.mutate({
      usuario: report.usuario,
      data: report.data,
      coordenadas: report.coordenadas,
      novo_status: selectedStatus,
      matricula_funcionario: operator.matricula,
    });
  };

  const availableStatus = STATUS_TRANSITIONS[report.status] || [];
  const isFinalStatus = availableStatus.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Status da Denúncia</DialogTitle>
          <DialogDescription>
            Status atual: <strong>{report.status}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="status">Novo Status</Label>
            {isFinalStatus ? (
              <p className="text-sm text-muted-foreground">
                Esta denúncia está em um status final e não pode ser alterada.
              </p>
            ) : (
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {availableStatus.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Transições permitidas a partir de "{report.status}":{" "}
              {availableStatus.join(", ")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStatus || mutation.isPending || isFinalStatus}
          >
            {mutation.isPending ? "Atualizando..." : "Atualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
