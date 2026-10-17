// Virtuelles Modul, das scripts/html/build.mjs aus der Ordnerstruktur von src/app erzeugt.
declare module "yogitier:routes" {
  import type { Metadata } from "next";
  import type { ComponentType, ReactNode } from "react";

  type Params = Promise<Record<string, string>>;

  export type PageModule = {
    default: (props: { params: Params; searchParams: Params }) => ReactNode;
    metadata?: Metadata;
    generateMetadata?: (props: { params: Params }) => Metadata | Promise<Metadata>;
  };
  export type LayoutModule = { default: ComponentType<{ children: ReactNode; params: Params }>; metadata?: Metadata };
  export type ErrorModule = { default: ComponentType<{ error: Error & { digest?: string }; reset: () => void }> };
  export type RouteDef = { segments: string[]; page: PageModule; layouts: LayoutModule[]; error?: ErrorModule; clientPage: boolean };

  export const routes: RouteDef[];
  export const rootLayout: { metadata?: Metadata };
  export const notFoundPage: { default: ComponentType; metadata?: Metadata };
}
