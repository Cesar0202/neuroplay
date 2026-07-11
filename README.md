# NeuroPlay

Plataforma completa de minijuegos cognitivos diseñada para entrenar reflejos, memoria, velocidad y lógica.

## Características

- **Diseño Premium**: Interfaz moderna con tema oscuro, glassmorphism y efectos de neón.
- **28 Minijuegos Completos y Funcionales**:
  - **Reflejos**: Reaction Test, Catch the Circle, Dodge Blocks, Left or Right, Semaphore, Visual Explosion, Double Stimulus.
  - **Lógica**: Find the Different, Hidden Pattern, Find Intruder, Dynamic Maze.
  - **Memoria**: Memory Cards, Simon Says, Flash Memory.
  - **Precisión**: Typing Speed, Exact Time, Human Timer, Safe Path, Safe Zone, Draw Line, Steady Pulse, Parabolic Shot, Orbital Control, Build Tower.
  - **Matemáticas**: Fast Math, Find Max, Order Numbers, Number Sequence.
- **Sistema de Puntuaciones Locales (Top 10)**: Cada minijuego incluye su propio marcador que guarda automáticamente las 10 mejores marcas personales en el navegador (sin necesidad de base de datos).
- **HUD Integrado**: Pantalla de juego dedicada con botón de salida, estadísticas y animaciones fluidas de "Game Over".

## Tecnologías

- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS** (Estilos y Animaciones)
- **Framer Motion** (Transiciones fluidas)
- **Lucide React** (Iconografía)

## Instalación y Uso

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Abrir en el navegador:
   `http://localhost:5173`

## Estructura del Proyecto

- `/src/assets/game_cards`: Imágenes y portadas generadas por IA para cada juego.
- `/src/components`: Componentes reutilizables (GameStats).
- `/src/layouts`: Layouts principales (GameLayout con barra lateral de Top 10).
- `/src/pages`: Vistas principales (Home).
- `/src/games`: Carpeta con los 28 minijuegos (Lógica e interfaz independiente por juego).
- `/src/utils`: Utilidades (scoreStorage.ts para persistencia local).
- `/src/context`: Estado global de los minijuegos.

## Créditos

Desarrollado como parte del proyecto de entrenamiento cognitivo NeuroPlay.
