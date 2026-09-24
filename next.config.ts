import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// IPs desta máquina na rede local (ex.: 192.168.x.x). Sem eles, o `next dev`
// bloqueia os scripts de desenvolvimento quando a página é aberta pelo celular
// e nada interativo funciona (menu mobile, Juno). Só vale para `next dev`.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses,
  // Fixa a raiz no projeto: há um package-lock.json solto em ~/Downloads que
  // faria o Turbopack inferir a pasta errada como raiz do workspace.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
