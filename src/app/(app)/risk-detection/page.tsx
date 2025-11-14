"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, Loader2 } from 'lucide-react';
import type { DetectRiskyBehaviorOutput } from '@/ai/flows/detect-risky-behavior';
import { detectRiskyBehavior } from '@/ai/flows/detect-risky-behavior';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters."),
});

export default function RiskDetectionPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectRiskyBehaviorOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await detectRiskyBehavior(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to detect risk. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Message Risk Detector</CardTitle>
          <CardDescription>
            Check if a message contains any toxic or risky language. This tool helps you identify potentially harmful interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to Analyze</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the message here..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                Analyze Message
              </Button>
            </form>
          </Form>

          {result && (
            <div className="mt-6">
              <Alert variant={result.isRisky ? "destructive" : "default"}>
                <UserCheck className="h-4 w-4" />
                <AlertTitle>{result.isRisky ? "Risky Behavior Detected" : "Message Seems Safe"}</AlertTitle>
                <AlertDescription>
                  {result.isRisky ? (
                    <>
                      <p className="mt-2">{result.explanation}</p>
                      <div className="mt-4">
                        <p className="font-semibold mb-2">Risk Factors:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.riskFactors.map((factor, i) => (
                            <Badge key={i} variant="destructive">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2">Our analysis did not find any clear signs of risky or toxic behavior in this message. However, always trust your instincts.</p>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
