export const cropImage = (
  file: File,
  callback: (croppedBlob: Blob) => void,
) => {
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const maxSize = Math.min(image.width, image.height);
    const offsetX = (image.width - maxSize) / 2;
    const offsetY = (image.height - maxSize) / 2;

    canvas.width = maxSize;
    canvas.height = maxSize;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(
        image,
        offsetX,
        offsetY,
        maxSize,
        maxSize,
        0,
        0,
        maxSize,
        maxSize,
      );

      canvas.toBlob((blob) => {
        if (blob) {
          callback(blob);
        }
      }, file.type);
    }
  };

  image.src = URL.createObjectURL(file);
};
