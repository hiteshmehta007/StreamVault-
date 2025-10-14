import { useTranslation } from '../hooks/useTranslation';
import { LanguageSelector } from './LanguageSelector';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Play, Heart, Share, Download } from 'lucide-react';

export function TranslationDemo() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Translation System Demo</span>
            <LanguageSelector variant="select" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">{t('home')}</Button>
              <Button variant="outline" size="sm">{t('trending')}</Button>
              <Button variant="outline" size="sm">{t('subscriptions')}</Button>
              <Button variant="outline" size="sm">{t('library')}</Button>
              <Button variant="outline" size="sm">{t('history')}</Button>
              <Button variant="outline" size="sm">{t('liked')}</Button>
              <Button variant="outline" size="sm">{t('downloads')}</Button>
              <Button variant="outline" size="sm">{t('settings')}</Button>
            </div>
          </div>

          {/* Video Player Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Video Player Controls</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                {t('play')}
              </Button>
              <Button variant="outline" size="sm">{t('pause')}</Button>
              <Button variant="outline" size="sm">{t('mute')}</Button>
              <Button variant="outline" size="sm">{t('fullscreen')}</Button>
              <Button variant="outline" size="sm">{t('quality')}</Button>
              <Button variant="outline" size="sm">{t('captions')}</Button>
            </div>
          </div>

          {/* Video Actions Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Video Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                {t('likes')}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                {t('share')}
              </Button>
              <Button variant="outline" size="sm">{t('subscribe')}</Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('save')}
              </Button>
            </div>
          </div>

          {/* Creator Tools Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Creator Tools</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">{t('uploadVideo')}</Button>
              <Button variant="outline" size="sm">{t('dashboard')}</Button>
              <Button variant="outline" size="sm">{t('analytics')}</Button>
              <Button variant="outline" size="sm">{t('createChannel')}</Button>
              <Button variant="outline" size="sm">{t('earnings')}</Button>
            </div>
          </div>

          {/* Common Actions Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Common Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">{t('create')}</Button>
              <Button variant="outline" size="sm">{t('edit')}</Button>
              <Button variant="outline" size="sm">{t('update')}</Button>
              <Button variant="outline" size="sm">{t('delete')}</Button>
              <Button variant="outline" size="sm">{t('cancel')}</Button>
              <Button variant="outline" size="sm">{t('confirm')}</Button>
            </div>
          </div>

          {/* Language Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Translation System Features:</h4>
            <ul className="text-sm space-y-1">
              <li>• 39+ languages supported including Hindi (हिन्दी), Spanish (Español), French (Français)</li>
              <li>• Automatic RTL (Right-to-Left) support for Arabic and Urdu</li>
              <li>• Persistent language selection stored in localStorage</li>
              <li>• Fallback to English if translation not found</li>
              <li>• Context-aware translations throughout the platform</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}