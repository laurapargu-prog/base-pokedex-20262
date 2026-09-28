# Pokedex Explorer en React

Migracion del buscador original de Pokémon a React con Vite. La aplicación permite buscar por nombre o número de Pokedex y consultar tipos, habilidades, altura y peso desde PokéAPI.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite en el navegador.

## Arquitectura

- `src/App.jsx`: componentes funcionales, estado con `useState`, título con `useEffect`, eventos JSX e integración con `fetch`.
- `src/App.css`: estilos responsive de la aplicación.
- `src/main.jsx`: punto de entrada con `createRoot` y `StrictMode`.

La vista se mantiene como una pantalla única, por lo que no requiere routing. La API necesita conexión a Internet.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
