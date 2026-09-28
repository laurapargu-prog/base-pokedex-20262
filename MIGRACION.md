# Contexto del proyecto: Pokedex Explorer

## Estado actual

Este repositorio contiene una aplicación web de una sola página para consultar Pokémon por nombre o número de Pokédex. Está construida con **React 19**, **React DOM 19** y **Vite 8**. No hay un proyecto HTML/JavaScript legado dentro de este repositorio: la versión actual ya usa React.

La aplicación consulta datos públicos de [PokéAPI](https://pokeapi.co/) desde el navegador, por lo que requiere conexión a Internet para realizar búsquedas.

## Funcionalidad disponible

- Búsqueda de Pokémon por nombre o identificador numérico.
- Normalización del término de búsqueda: elimina espacios externos y convierte el valor a minúsculas.
- Accesos rápidos para Pikachu, Charizard y el Pokémon número 25.
- Estados visuales de inicio, carga, éxito y error.
- Ficha con nombre, imagen frontal, ID, tipos, altura, peso y habilidades.
- Diseño responsive para pantallas de hasta 520 px de ancho.
- Accesibilidad básica: etiqueta asociada al campo de búsqueda, región de resultados con `aria-live` y texto alternativo en la imagen.

## Arquitectura y archivos

```text
my-app/
├── public/
│   ├── favicon.svg             # Icono configurado en index.html
│   └── icons.svg               # Recurso estático no usado actualmente por la app
├── src/
│   ├── assets/                 # Recursos heredados de la plantilla de Vite; no se usan en App.jsx
│   ├── App.jsx                 # Vista, componentes internos y lógica de búsqueda
│   ├── App.css                 # Estilos de la interfaz Pokedex
│   ├── index.css               # Estilos globales
│   └── main.jsx                # Punto de entrada de React
├── index.html                  # Documento HTML base de Vite
├── package.json                # Scripts y dependencias
├── vite.config.js              # Vite con @vitejs/plugin-react
└── MIGRACION.md                # Este documento
```

### Punto de entrada

`src/main.jsx` crea la raíz React sobre el elemento `#root` y renderiza `App` dentro de `StrictMode`.

### Componente principal

`src/App.jsx` concentra por ahora toda la aplicación:

- `App`: mantiene el estado, define `searchPokemon` y compone la página.
- `SearchForm`: formulario controlado para introducir el término de búsqueda.
- `ResultPanel`: selecciona la interfaz según el estado de la consulta.
- `PokemonCard`: muestra la información recibida de PokéAPI.
- `quickSearches`: constante con los accesos rápidos.

No hay enrutamiento, estado global, backend propio, base de datos ni autenticación.

## Estado y flujo de datos

`App` usa `useState` para tres valores:

| Estado | Valor inicial | Uso |
| --- | --- | --- |
| `searchTerm` | `''` | Valor controlado del campo de búsqueda. |
| `pokemon` | `null` | Respuesta completa de PokéAPI del Pokémon encontrado. |
| `status` | `'idle'` | Estado de la vista: `idle`, `loading`, `success` o `error`. |

Al enviar el formulario o pulsar un acceso rápido, `searchPokemon`:

1. Normaliza el término recibido.
2. Establece el estado `loading` y limpia el resultado anterior.
3. Hace un `fetch` a `https://pokeapi.co/api/v2/pokemon/{termino}`.
4. Si la respuesta es correcta, guarda el JSON y muestra la ficha.
5. Si la petición falla o la API devuelve un estado no exitoso, muestra el mensaje de error genérico.

Además, un `useEffect` fija el título del documento como `Pokedex Explorer` al montar el componente. El título inicial de `index.html` todavía es `my-app`, aunque React lo reemplaza al cargar la aplicación.

## Dependencias y scripts

### Dependencias de producción

- `react` `^19.2.8`
- `react-dom` `^19.2.8`

### Dependencias de desarrollo

- `vite` `^8.3.0`
- `@vitejs/plugin-react` `^6.1.1`
- `oxlint` `^1.81.0`
- `@types/react` y `@types/react-dom` `^19.2.x`

### Comandos

```bash
npm install      # Instala dependencias
npm run dev      # Inicia Vite en modo desarrollo
npm run build    # Genera la compilación de producción en dist/
npm run preview  # Sirve localmente la compilación de producción
npm run lint     # Ejecuta Oxlint
```

## Estilos y recursos

- `src/index.css` define la tipografía global, el fondo, el modelo de caja y estilos base.
- `src/App.css` contiene la composición visual: barra superior, encabezado, formulario, botones, panel de resultado, tarjeta y reglas responsive.
- La imagen del Pokémon procede de `pokemon.sprites.front_default`.
- Los iconos visibles se han escrito como emoji en `App.jsx`; los archivos de `src/assets/` y `public/icons.svg` no participan en la interfaz actual.

## Limitaciones conocidas

- Los errores de red, respuestas inválidas y Pokémon inexistentes se muestran con el mismo mensaje.
- Las peticiones anteriores no se cancelan. Dos búsquedas rápidas consecutivas podrían mostrar un resultado antiguo si su respuesta llega después.
- No hay validación adicional aparte de que el campo sea obligatorio y que el término no quede vacío tras limpiarlo.
- La interfaz depende directamente de la estructura de respuesta de PokéAPI.
- Si `sprites.front_default` es `null`, la imagen no cuenta con una alternativa visual.
- No existen pruebas automatizadas configuradas.
- El repositorio conserva recursos de la plantilla inicial de Vite que no se usan actualmente.

## Próximas mejoras sugeridas

1. Extraer `SearchForm`, `ResultPanel`, `PokemonCard` y los estados de carga/error a archivos propios si la pantalla crece.
2. Crear un hook `usePokemonSearch` con `AbortController` para evitar resultados fuera de orden.
3. Diferenciar errores de conectividad, datos no encontrados y errores de la API.
4. Incorporar una imagen de respaldo y un modelo de datos normalizado para la UI.
5. Añadir pruebas con Vitest y React Testing Library.
6. Actualizar `index.html` con idioma `es` y el título `Pokedex Explorer` para que el HTML inicial también represente la aplicación.
7. Eliminar los recursos de plantilla que no se utilicen, solo después de confirmar que no se necesitan.
