
import { ColorProvider } from './ColorProvider';

// Legacy ThemeProvider wrapper for backward compatibility
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ColorProvider>
      {children}
    </ColorProvider>
  );
}

// Re-export for convenience
export { useColor as useTheme } from './ColorProvider';

