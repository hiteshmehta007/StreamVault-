
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useColor } from './ColorProvider';

export function ThemeToggle() {
  const { backgroundTheme, setBackgroundTheme } = useColor();

  const themes = [
    {
      name: 'Light',
      value: 'light' as const,
      icon: Sun,
      description: 'Light background'
    },
    {
      name: 'Dark',
      value: 'dark' as const,
      icon: Moon,
      description: 'Dark background'
    },
    {
      name: 'System',
      value: 'default' as const,
      icon: Monitor,
      description: 'System preference'
    }
  ];

  const currentTheme = themes.find(t => t.value === backgroundTheme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Toggle background theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setBackgroundTheme(themeOption.value)}
              className={`flex items-center space-x-2 ${
                backgroundTheme === themeOption.value ? 'bg-accent' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{themeOption.name}</div>
                <div className="text-xs text-muted-foreground">
                  {themeOption.description}
                </div>
              </div>
              {backgroundTheme === themeOption.value && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

