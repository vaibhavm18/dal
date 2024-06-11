function base64ToBlob(base64: string, contentType: string = ""): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export function base64ToFile(
  base64: string,
  fileName: string = "image.png"
): File {
  const [prefix, base64String] = base64.split(",");
  const mimeType = prefix.match(/:(.*?);/)![1];
  const blob = base64ToBlob(base64String, mimeType);
  return new File([blob], fileName, {
    type: mimeType,
    lastModified: Date.now(),
  });
}
