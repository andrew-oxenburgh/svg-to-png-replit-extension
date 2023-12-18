import { fs } from "@replit/extensions";

export const svgPrefix = "data:image/svg+xml;utf8,";

export const saveToDirectory = "aa-svg-tx-icons";

export const saveToFileName = (dir: string, n: number) => {
  return `${dir}/icon-${n}x${n}.png`;
};

export const dataUrlBlank = (width: number, height = width: number) => {
  return svgEncode(
  `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" aria-label="blank">
  </svg>
  `)
}
export const svgEncode = (content) => {
  return svgPrefix + content.replace(/\s+/g, " ").replaceAll("#", "%23");
};

export function base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export const saveTo = async (filename: string, img: string) => {
  await fs.createDir(saveToDirectory);;
  var data = img.split(",")[1];
  await fs.writeFile(filename, base64ToArrayBuffer(data.trim()));
  console.log("saved " + filename);
};

export {};
