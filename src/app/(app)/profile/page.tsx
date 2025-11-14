"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { currentUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Loader2 } from 'lucide-react';
import type { SuggestProfileImprovementsOutput } from '@/ai/flows/suggest-profile-improvements';
import { suggestProfileImprovements } from '@/ai/flows/suggest-profile-improvements';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(18, "You must be at least 18."),
  bio: z.string().max(500, "Bio can't be more than 500 characters.").min(10, "Bio should be at least 10 characters."),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestProfileImprovementsOutput | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      age: currentUser.age,
      bio: currentUser.bio,
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved.",
    });
  }

  async function handleGetSuggestions() {
    setLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestProfileImprovements({ profileText: form.getValues('bio') });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get profile suggestions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={currentUser.profilePictureUrl}
                alt={`Profile picture of ${currentUser.name}`}
                fill
                className="object-cover"
                data-ai-hint={currentUser.profilePictureHint}
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold">{form.watch('name')}</h2>
            <p className="text-muted-foreground">{form.watch('age')} years old</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {currentUser.interests.map((interest) => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile Improvement AI</CardTitle>
            <CardDescription>Get AI-powered tips to make your profile shine.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetSuggestions} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Analyze My Profile
            </Button>
            {suggestions && (
              <div className="mt-4 space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>AI Suggestions</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc space-y-1 pl-5">
                      {suggestions.textSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Your age" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
