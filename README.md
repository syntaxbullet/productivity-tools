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
   - Open `src/lib/WidgetRegistry.tsx`.
   - Import your widget at the top, for example:
     ```tsx
     import { MyWidget } from '@/components/widgets/mywidget/MyWidget';
     ```
   - Add an entry to the `widgetRegistry` object:
     ```tsx
     const widgetRegistry = {
       ...
       mywidget: {
         component: MyWidget,
         defaultProps: {
           minWidth: 200,
           minHeight: 200,
           maxWidth: 600,
           maxHeight: 600,
         },
       },
     };
     ```
   - Update the `WidgetType` type to include your widget's key:
     ```tsx
     export type WidgetType = 'clock' | 'pomodoro' | 'youtube' | 'todo' | 'mywidget';
     ```
   - This ensures your widget is recognized by the system and can be spawned by users.

3. **Split into reusable components**  
   - Keep code modular to help others reuse your work.

4. **Verify defaults and types**  
   - Make sure your widget's default properties are set in the registry.
   - If your widget uses custom data, extend the widget data type accordingly.

5. **Test**  
   - Run the app locally and confirm your widget appears and works as expected.

6. **Follow best practices**  
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
