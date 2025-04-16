# Productivity Tools

A collection of small, customizable productivity and study widgets—built as a modern, client-side React app. Each widget is resizable, draggable, and designed to help you focus, organize, and study more effectively.

## Features

- ⚡ Drag, drop, and resize widgets on your dashboard
- 🧩 Modular widget system—add, remove, or build your own widgets
- 🎨 Beautiful UI with Tailwind CSS and Shadcn UI components
- 🗄️ Persistent state using Zustand (with local storage)
- 🛠️ Built with React + TypeScript for maintainability and extensibility

## Getting Started

1. **Install dependencies**  
   ```sh
   pnpm install
   ```

2. **Run locally**  
   ```sh
   pnpm dev
   ```

3. **Open in your browser**  
   Visit [http://127.0.0.1:5173](http://127.0.0.1:5173)

## Contributing

We welcome contributions! Here’s how you can help:

### 🧑‍💻 Add a New Widget

1. **Create your widget component**  
   - Use the `GenericWidget` component as a base (see `src/components/widgets/GenericWidget.tsx`).
   - Store widget state in the `WidgetStore` (`src/stores/WidgetStore.ts`).

2. **Register your widget**  
   - Add it to the `WidgetRegistry` (`src/lib/WidgetRegistry.tsx`).

3. **Split into reusable components**  
   - Keep code modular to help others reuse your work.

4. **Follow best practices**  
   - Use TypeScript, Tailwind CSS, and Shadcn UI components.
   - Maintain accessibility and responsive design.

### 📝 Report Bugs or Suggest Features

- Open an issue describing the bug or feature request.

### 🤝 Other Ways to Help

- Improve documentation
- Refactor code for clarity and maintainability
- Add tests

## Project Structure

```
src/
  components/widgets/   # Widget components (use GenericWidget as base)
  stores/               # Zustand store for widget state
  lib/                  # Widget registry and utilities
  ...
```

## License

MIT
