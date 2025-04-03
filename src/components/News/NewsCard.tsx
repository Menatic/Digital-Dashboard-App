
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { NewsItem } from '@/store/slices/newsSlice';
import { formatDistanceToNow } from 'date-fns';
import { Newspaper } from 'lucide-react';

interface NewsCardProps {
  article: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { title, description, url, source, imageUrl, publishedAt } = article;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-0">
        {imageUrl ? (
          <div className="h-40 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
              onError={(e) => {
                // Replace broken image with a placeholder background
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.style.display = 'none';
                target.parentElement!.classList.add('bg-muted', 'flex', 'items-center', 'justify-center');
                const icon = document.createElement('div');
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path><path d="M2 18V6a2 2 0 0 1 2-2h16"></path><path d="M18 14h-8"></path><path d="M18 10h-8"></path><path d="M18 6h-8"></path></svg>';
                target.parentElement!.appendChild(icon);
              }}
            />
          </div>
        ) : (
          <div className="h-40 bg-muted flex items-center justify-center">
            <Newspaper className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-xs font-medium text-accent">{source}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
          </span>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mb-2"
        >
          <h3 className="text-base font-semibold hover:text-primary transition-colors">
            {title}
          </h3>
        </a>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;
