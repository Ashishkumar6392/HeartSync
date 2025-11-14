'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertTriangle } from 'lucide-react';
import { matches, currentUser } from '@/lib/data';
import Image from 'next/image';

export default function CallPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const matchId = searchParams.get('with');
  const match = matches.find(m => m.id === matchId);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    const getPermissions = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        setHasCameraPermission(true);
        setHasMicPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          variant: 'destructive',
          title: 'Permissions Denied',
          description: 'Camera and microphone access are required for video calls.',
        });
        setHasCameraPermission(false);
        setHasMicPermission(false);
      }
    };

    getPermissions();

    return () => {
      // Make sure to stop all tracks when the component unmounts
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCamera = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  }, [stream, isCameraOn]);

  const toggleMic = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  }, [stream, isMicOn]);
  
  const endCall = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      toast({ title: 'Call Ended' });
      window.history.back();
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Match Not Found</AlertTitle>
          <AlertDescription>The person you're trying to call could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center">Video Call with {match.name}</CardTitle>
        </CardHeader>
        <CardContent className="relative aspect-video bg-muted rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Remote Video */}
            <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                { hasCameraPermission && hasMicPermission ? (
                    <>
                        <Image src={match.profilePictureUrl} alt={match.name} fill className="object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">{match.name}</div>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <VideoOff className="h-16 w-16 mx-auto mb-2" />
                        {hasCameraPermission === null ? <p>Requesting permissions...</p> : <p>Waiting for permissions to start call...</p>}
                    </div>
                )}
            </div>

            {/* Local Video */}
            <div className="relative w-full h-full bg-slate-900 md:absolute md:w-1/4 md:h-1/4 md:bottom-4 md:right-4 md:rounded-lg md:border-2 md:border-white">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {!isCameraOn && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <VideoOff className="h-8 w-8 text-white" />
                    </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">{currentUser.name}</div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center gap-4 mt-4">
          <Button onClick={toggleMic} variant={isMicOn ? 'secondary' : 'destructive'} size="icon" className="rounded-full w-14 h-14" disabled={!hasMicPermission}>
            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          <Button onClick={toggleCamera} variant={isCameraOn ? 'secondary' : 'destructive'} size="icon" className="rounded-full w-14 h-14" disabled={!hasCameraPermission}>
            {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>
          <Button onClick={endCall} variant="destructive" size="icon" className="rounded-full w-16 h-14">
            <PhoneOff className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
      {(hasCameraPermission === false || hasMicPermission === false) && (
        <Alert variant="destructive" className="mt-4 max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Permissions Required</AlertTitle>
            <AlertDescription>
            Please allow camera and microphone access in your browser to start the video call.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
