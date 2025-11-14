"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareHeart, Loader2 } from 'lucide-react';
import { generateConversationStarters } from '@/ai/flows/generate-conversation-starters';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  matchProfile: z.string().min(10, "Please provide some details about your match."),
});

export default function ConversationStartersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchProfile: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setStarters([]);
    try {
      const result = await generateConversationStarters(values);
      setStarters(result.conversationStarters);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate conversation starters. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Generate Icebreakers</CardTitle>
          <CardDescription>
            Stuck on what to say? Paste your match's bio or interests below to get some personalized conversation starters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="matchProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match's Profile / Interests</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Loves hiking, dogs, and trying new coffee shops...'" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareHeart className="mr-2 h-4 w-4" />}
                Generate Starters
              </Button>
            </form>
          </Form>

          {starters.length > 0 && (
            <div className="mt-6">
              <Alert>
                <MessageSquareHeart className="h-4 w-4" />
                <AlertTitle>Here are some ideas!</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc space-y-2 pl-5 mt-2">
                    {starters.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
