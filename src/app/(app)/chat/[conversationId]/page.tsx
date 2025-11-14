'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Send, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { matches, currentUser as localCurrentUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty.'),
});

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const searchParams = useSearchParams();
  const matchId = searchParams.get('with');

  const { user: authUser, isUserLoading: isAuthUserLoading } = useUser();
  const firestore = useFirestore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const match = useMemo(() => matches.find(m => m.id === matchId), [matchId]);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !conversationId) return null;
    return query(
      collection(firestore, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [firestore, conversationId]);

  const { data: messages, isLoading: isMessagesLoading, error } = useCollection<Message>(messagesQuery);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      text: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    if (!authUser || !firestore || !conversationId || !matchId) return;

    const conversationRef = doc(firestore, 'conversations', conversationId);
    const messagesColRef = collection(conversationRef, 'messages');

    // Create message data
    const messageData = {
      text: values.text,
      senderId: authUser.uid,
      timestamp: serverTimestamp(),
    };

    // Add the message non-blockingly
    addDocumentNonBlocking(messagesColRef, messageData);

    // Also update the parent conversation doc for previews (non-blocking)
    setDocumentNonBlocking(conversationRef, {
        participants: [authUser.uid, matchId], // Ensure participants are set
        lastMessage: {
            text: values.text,
            timestamp: serverTimestamp(),
        },
    }, { merge: true });

    form.reset();
  }
  
  const isLoading = isMessagesLoading || isAuthUserLoading;

  if (!match) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Match Not Found</AlertTitle>
          <AlertDescription>The person you're trying to chat with could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4 border-b">
          <Link href="/matches">
            <Button variant="ghost" size="icon" className="md:hidden">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <Avatar>
            <AvatarImage src={match.profilePictureUrl} alt={match.name} />
            <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle>{match.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
                 <Alert variant="destructive" className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error loading messages</AlertTitle>
                    <AlertDescription>You may not have permission to view this conversation.</AlertDescription>
                </Alert>
            </div>
          ) : messages && messages.length === 0 ? (
            <div className="text-center text-muted-foreground pt-10">
                <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            messages?.map((msg) => {
              const isCurrentUser = msg.senderId === authUser?.uid;
              const sender = isCurrentUser ? localCurrentUser : match;
              return (
                <div key={msg.id} className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sender.profilePictureUrl} />
                      <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 text-sm',
                      isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <p>{msg.text}</p>
                  </div>
                   {isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sender.profilePictureUrl} />
                      <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Type a message..." autoComplete="off" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
