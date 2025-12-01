import { cn } from "@app/lib/utils";
import type { Dispatch, SetStateAction } from "react";

interface Props extends React.ComponentProps<"input"> {
  onUpload: (files: FileList) => void;
}

export const FileInput = ({
  onUpload,
  id,
  multiple,
  accept,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer",
        className
      )}
    >
      <input
        type="file"
        id={id}
        multiple={multiple}
        accept={accept}
        className="hidden"
        {...props}
        onChange={(e) => {
          if (e.target.files) {
            onUpload(e.target.files);
          }
        }}
      />
      <label htmlFor={id} className="cursor-pointer">
        <p className="text-muted-foreground">+ Adicionar imagem</p>
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
                setImages((prev) => prev.filter((_, i) => i !== index))
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
