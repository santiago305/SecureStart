declare module "react-player" {
  import React from "react";
  const ReactPlayer: React.FC<{
    url: string;
    controls?: boolean;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    playing?: boolean;
    light?: boolean | string;
  }>;
  export default ReactPlayer;
}
