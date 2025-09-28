"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Upload, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { detectMaterialStatus, DetectMaterialStatusOutput } from '@/ai/flows/material-status-detection';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function MaterialStatusDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<DetectMaterialStatusOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUsePlaceholder = (imageUrl: string) => {
    setResult(null);
    setError(null);
    // Fetch image and convert to dataURI
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await detectMaterialStatus({ photoDataUri: selectedImage });
      setResult(response);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-accent" /> AI Material Status Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedImage ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground" />
                <Label htmlFor="image-upload" className="mt-4 text-primary font-semibold cursor-pointer hover:underline">
                    Upload an image
                </Label>
                <p className="text-xs text-muted-foreground mt-1">or use a placeholder below</p>
                <Input id="image-upload" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                <div className="flex gap-4 mt-4">
                    {PlaceHolderImages.map(img => (
                        <button key={img.id} onClick={() => handleUsePlaceholder(img.imageUrl)} className="relative group">
                            <Image data-ai-hint={img.imageHint} src={img.imageUrl} alt={img.description} width={100} height={75} className="rounded-md object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs text-center">{img.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="relative">
                    <Image src={selectedImage} alt="Selected component" width={600} height={400} className="rounded-lg w-full h-auto object-cover" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={clearImage}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <Button onClick={analyzeImage} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                    Analyze with AI
                </Button>
            </div>
        )}
        
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {result && (
          <Alert variant={result.isCorrosive ? "destructive" : "default"} className={result.isCorrosive ? "" : "border-green-500"}>
            {result.isCorrosive ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-green-500" />}
            <AlertTitle>{result.isCorrosive ? 'Corrosion Detected' : 'No Corrosion Detected'}</AlertTitle>
            <AlertDescription>
              {result.materialStatusDescription}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
