# Portafolio 3D - Juan Alejandro Cárdenas

Escena 3D de mi portafolio, hecha con Three.js. El monitor del escritorio muestra
[JACUSys](https://github.com/OtroMigala/jacusys), el sistema operativo 2D con mi
información, cargado mediante un iframe.

Sitio publicado: https://otromigala.github.io/portafolio/

## Créditos

Este proyecto es una adaptación de
[portfolio-website](https://github.com/henryjeff/portfolio-website) de
[Henry Heffernan](https://henryheffernan.com/), publicado bajo licencia MIT
(ver [LICENSE.md](LICENSE.md)). Modelos 3D: Mickael Boitte (computador) y Sean
Nicolas (entorno).

## Desarrollo

```bash
npm install
npm run dev
```

Para ver el sistema operativo local dentro del monitor, corre JACUSys en
`localhost:3000` y abre el sitio con `?dev` (por ejemplo
`http://localhost:8080/?dev`).

## Despliegue

Cada push a `main` compila el sitio (`npm run build`, salida en `public/`) y lo
publica en GitHub Pages mediante `.github/workflows/deploy.yml`.

La URL del sistema operativo que carga el monitor está en `OS_URL`, al inicio de
`src/Application/World/MonitorScreen.ts`.
