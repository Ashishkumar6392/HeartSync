import { matches } from '@/lib/data';
import { MatchCard } from '@/components/match-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MatchesPage() {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Recommended For You</h2>
        <p className="text-muted-foreground">Based on your profile, here are some people you might like.</p>
      </div>
      
      <div className="relative flex justify-center">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
        >
          <CarouselContent>
            {matches.map((match) => (
              <CarouselItem key={match.id} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <MatchCard user={match} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
      </div>
    </div>
  );
}
