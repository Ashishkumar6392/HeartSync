"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { provideSafeDatingGuidance } from '@/ai/flows/provide-safe-dating-guidance';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  situation: z.string().min(10, "Please describe your situation."),
});

export default function SafetyGuidancePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      situation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setGuidance(null);
    try {
      const result = await provideSafeDatingGuidance(values);
      setGuidance(result.guidance);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get safety guidance. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Safe Dating Guidance</CardTitle>
          <CardDescription>
            Feeling unsure about a situation? Describe it below to get real-time safety tips from our AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the Situation</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'My match is asking for my phone number right away...'" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Get Safety Tips
              </Button>
            </form>
          </Form>

          {guidance && (
            <div className="mt-6">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Safety Guidance</AlertTitle>
                <AlertDescription>
                  <p className="mt-2 whitespace-pre-wrap">{guidance}</p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
