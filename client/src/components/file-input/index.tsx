import { cn } from "@app/lib/utils";
import type { Dispatch, SetStateAction } from "react";

interface Props extends React.ComponentProps<"input"> {
  onUpload: (files: FileList) => void;
  maxFiles?: number;
  images?: File[];
}

export const FileInput = ({
  onUpload,
  id,
  multiple,
  accept,
  className,
  maxFiles = 1,
  images = [],
  ...props
}: Props) => {
  const currentCount = images.length;
  const isDisabled = maxFiles !== undefined && currentCount >= maxFiles;
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-primary/50 cursor-pointer",
        className
      )}
    >
      <input
        type="file"
        id={id}
        multiple={multiple}
        accept={accept}
        className="hidden"
        disabled={isDisabled}
        {...props}
        onChange={(e) => {
          if (e.target.files && !isDisabled) {
            const filesArray = Array.from(e.target.files);
            const availableSlots = maxFiles
              ? maxFiles - currentCount
              : filesArray.length;
            const filesToAdd = filesArray.slice(0, availableSlots);

            if (filesToAdd.length > 0) {
              const dataTransfer = new DataTransfer();
              filesToAdd.forEach((file) => dataTransfer.items.add(file));
              onUpload(dataTransfer.files);
            }
          }
        }}
      />
      <label
        htmlFor={id}
        className={cn(isDisabled ? "cursor-not-allowed" : "cursor-pointer")}
      >
        <p className="text-muted-foreground">
          {isDisabled
            ? `Máximo de ${maxFiles} imagens atingido`
            : "+ Adicionar imagem"}
        </p>
        {maxFiles && !isDisabled && (
          <p className="text-xs text-muted-foreground mt-1">
            {currentCount}/{maxFiles} imagens
          </p>
        )}
      </label>
    </div>
  );
};

interface FilePreviewProps {
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
}

export const FilePreview = ({ images = [], setImages }: FilePreviewProps) => {
  return (
    images.length > 0 && (
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border"
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() =>
                setImages((im) => im.filter((_, i) => i !== index))
              }
              className="absolute top-1 right-1 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )
  );
};
