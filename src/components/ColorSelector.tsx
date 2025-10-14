
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useColor } from './ColorProvider';

export function ColorSelector() {
  const { 
    backgroundTheme, 
    setBackgroundTheme, 
    colorScheme, 
    setColorScheme, 
    availableColorSchemes 
  } = useColor();

  const backgroundThemes = [
    {
      value: 'light' as const,
      name: 'Light',
      icon: Sun,
      description: 'Clean light background'
    },
    {
      value: 'dark' as const,
      name: 'Dark',
      icon: Moon,
      description: 'Dark background theme'
    },
    {
      value: 'default' as const,
      name: 'System',
      icon: Monitor,
      description: 'Follow system preference'
    }
  ];

  const currentBackgroundTheme = backgroundThemes.find(t => t.value === backgroundTheme);
  const CurrentIcon = currentBackgroundTheme?.icon || Palette;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Customize appearance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Customize Appearance</span>
          </DialogTitle>
          <DialogDescription>
            Personalize your StreamVault experience with custom background themes and accent colors.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="colors" className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="background">Background Theme</TabsTrigger>
              <TabsTrigger value="colors">Accent Colors</TabsTrigger>
            </TabsList>
            
            {/* Background Theme Selection */}
            <TabsContent value="background" className="space-y-4 flex-1 overflow-y-auto pt-4">
            <div>
              <h3 className="mb-3">Background Theme</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the overall background appearance of the application.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {backgroundThemes.map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = backgroundTheme === theme.value;
                  
                  return (
                    <Card 
                      key={theme.value}
                      className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 ${
                        isSelected 
                          ? 'ring-2 ring-primary bg-primary/5 border-primary/20 shadow-primary/10' 
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setBackgroundTheme(theme.value)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm sm:text-base truncate">{theme.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {theme.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
            {/* Color Scheme Selection */}
            <TabsContent value="colors" className="space-y-4 flex-1 overflow-y-auto pt-4">
            <div>
              <h3 className="mb-3">Accent Colors</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose accent colors for buttons, links, and interactive elements.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                {availableColorSchemes.map((scheme) => {
                  const isSelected = colorScheme.id === scheme.id;
                  
                  return (
                    <Card 
                      key={scheme.id}
                      className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 ${
                        isSelected 
                          ? 'ring-2 ring-primary bg-primary/5 border-primary/20 shadow-primary/10' 
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setColorScheme(scheme)}
                    >
                      <CardContent className="p-2 sm:p-3">
                        <div className="space-y-2">
                          {/* Color Preview */}
                          <div className="flex space-x-1">
                            <div 
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                              style={{ backgroundColor: scheme.primary }}
                            />
                            <div 
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white shadow-sm mt-1 flex-shrink-0"
                              style={{ backgroundColor: scheme.accent }}
                            />
                            <div 
                              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: scheme.secondary }}
                            />
                          </div>
                          
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-medium truncate">{scheme.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
                                {scheme.description}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </div>
        
        {/* Current Selection Summary */}
        <div className="flex-shrink-0 mt-4 p-4 bg-muted rounded-lg border-t">
          <h4 className="text-sm font-medium mb-2">Current Selection</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <CurrentIcon className="h-4 w-4" />
              <span>Background: {currentBackgroundTheme?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: colorScheme.primary }}
              />
              <span>Colors: {colorScheme.name}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

