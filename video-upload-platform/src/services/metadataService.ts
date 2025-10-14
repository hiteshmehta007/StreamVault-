import { VideoMetadata } from '../types/video';

class MetadataService {
  private metadataStore: VideoMetadata[] = [];

  addMetadata(metadata: VideoMetadata) {
    this.metadataStore.push(metadata);
  }

  getMetadata(videoId: string): VideoMetadata | undefined {
    return this.metadataStore.find(metadata => metadata.id === videoId);
  }

  updateMetadata(videoId: string, updatedMetadata: Partial<VideoMetadata>) {
    const index = this.metadataStore.findIndex(metadata => metadata.id === videoId);
    if (index !== -1) {
      this.metadataStore[index] = { ...this.metadataStore[index], ...updatedMetadata };
    }
  }

  deleteMetadata(videoId: string) {
    this.metadataStore = this.metadataStore.filter(metadata => metadata.id !== videoId);
  }

  getAllMetadata(): VideoMetadata[] {
    return this.metadataStore;
  }
}

export const metadataService = new MetadataService();