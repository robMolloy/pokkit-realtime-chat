import { CustomIcon } from "@/components/CustomIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";

import { useRef, useState } from "react";

export const MessageForm = (p: {
  onSubmit: (p: { text: string; images: File[] }) => Promise<{ success: boolean }>;
}) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formElementRef = useRef<HTMLFormElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imageFiles]);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    multiple: true,
    noClick: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      className="relative"
      ref={formElementRef}
      onSubmit={async (e) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const resp = await p.onSubmit({ text, images });

        if (resp.success) {
          setText("");
          setImages([]);
        }

        setIsLoading(false);
      }}
    >
      {/* Image previews */}
      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="group relative">
              <img
                src={URL.createObjectURL(image)}
                alt={image.name}
                className="h-16 w-16 rounded border object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn("relative", isDragActive && "ring-2 ring-blue-500 ring-opacity-50")}
      >
        <input {...getInputProps()} />
        <Textarea
          placeholder="Type your message here or drop images..."
          value={text}
          onInput={(e) => {
            if (isLoading) return;

            const value = (e.target as HTMLTextAreaElement).value;
            setText(value);
          }}
          onKeyDown={async (e) => {
            const isSubmitKeyCombo = e.key === "Enter" && (e.ctrlKey || e.metaKey);
            if (isSubmitKeyCombo) formElementRef.current?.requestSubmit();
          }}
          className={`min-h-[90px] ${cn(isDragActive && "border-blue-500 bg-blue-50 dark:bg-blue-950/20")}`}
        />
        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-blue-500/10">
            <div className="font-medium text-blue-600 dark:text-blue-400">Drop images here...</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 right-0 flex gap-1">
        <Button
          className="p-2"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
        >
          <CustomIcon size="sm" iconName="ImagePlus" />
        </Button>
        <Button type="submit" className="p-2" size="sm">
          <CustomIcon
            size="sm"
            iconName={isLoading ? "Loader" : "Upload"}
            className={cn(isLoading && "animate-spin")}
          />
        </Button>
      </div>
    </form>
  );
};
