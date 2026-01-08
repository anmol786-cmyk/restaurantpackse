type NavProps = {
  className?: string;
  children?: React.ReactNode;
  id?: string;
};

// SVG module declarations for TypeScript
declare module "*.svg" {
  import { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}
