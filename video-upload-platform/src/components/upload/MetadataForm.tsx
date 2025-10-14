import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';
import TextArea from '../ui/textarea';

interface MetadataFormProps {
  onSubmit: (metadata: { title: string; description: string; tags: string[] }) => void;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTags(value.split(',').map(tag => tag.trim()));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title && description) {
      onSubmit({ title, description, tags });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          label="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <TextArea
          label="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="text"
          label="Tags (comma separated)"
          onChange={handleTagChange}
        />
      </div>
      <Button type="submit">Submit Metadata</Button>
    </form>
  );
};