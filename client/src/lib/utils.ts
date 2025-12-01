import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCPF(cpf?: string): string {
  if (!cpf) return "";
  // Remove tudo que não é dígito
  const cleaned = cpf.replace(/\D/g, '');
  
  // Formata para XXX.XXX.XXX-XX
  if (cleaned.length !== 11) {
    return cpf; // Retorna original se não tiver 11 dígitos
  }
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
