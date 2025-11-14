import type { User } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, X } from 'lucide-react';

interface MatchCardProps {
  user: User;
}

export function MatchCard({ user }: MatchCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={user.profilePictureUrl}
            alt={`Profile picture of ${user.name}`}
            fill
            className="object-cover"
            data-ai-hint={user.profilePictureHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 bg-card">
        <CardTitle className="text-2xl font-bold">
          {user.name}, <span className="font-normal">{user.age}</span>
        </CardTitle>
        <p className="mt-2 text-muted-foreground line-clamp-3 h-[4.5rem]">{user.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {user.interests.slice(0, 5).map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 p-4 bg-card">
        <Button variant="outline" size="icon" className="h-14 w-full rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <X className="h-7 w-7" />
        </Button>
        <Button variant="outline" size="icon" className="h-14 w-full rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
            <Heart className="h-7 w-7" />
        </Button>
        <Button variant="outline" size="icon" className="h-14 w-full rounded-full border-accent/50 text-accent hover:bg-accent/10 hover:text-accent">
            <MessageCircle className="h-7 w-7" />
        </Button>
      </CardFooter>
    </Card>
  );
}
