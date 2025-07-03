'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { FileDropzone } from '@/components/file-dropzone';
import { FileText, Wand2 } from 'lucide-react';
import { usePersistentResume } from '@/hooks/use-persistent-resume';

import { resumeReview, type ResumeReviewOutput } from '@/ai/flows/resume-review';

const formSchema = z.object({
  resumeDataUri: z.string().refine((s) => s.startsWith('data:'), {
    message: 'Please upload your resume.',
  }),
});

// Helper function to render text with markdown-style bolding
const renderWithBold = (text: string) => {
    // Split the text by the bold markers (e.g., **text**)
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
    return parts.map((part, index) => {
      // If the part is bolded, wrap it in a <strong> tag
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      // Otherwise, return the text part
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};


export default function ResumeReviewPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeReviewOutput | null>(null);
  const { storedResume, saveResume, isLoaded } = usePersistentResume();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeDataUri: '',
    },
  });

  useEffect(() => {
    if (isLoaded && storedResume) {
      form.setValue('resumeDataUri', storedResume.dataUri, { shouldValidate: true });
    }
  }, [isLoaded, storedResume, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await resumeReview(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to review resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>AI Resume Review</CardTitle>
            <CardDescription>Upload your resume (PDF or image) to get a detailed analysis with improvement suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="resumeDataUri"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Upload Your Resume</FormLabel>
                      <FormControl>
                        <FileDropzone
                          storedResume={storedResume}
                          onFileAccepted={(file) => {
                            saveResume(file);
                            field.onChange(file.dataUri);
                          }}
                          onFileRemoved={() => {
                            saveResume(null);
                            field.onChange('');
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full transition ease-in-out hover:scale-105">
                  {isLoading ? <Loader /> : <> <Wand2 className="mr-2 h-4 w-4" /> Review My Resume </>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8 md:col-span-2">
        {isLoading && (
          <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Loader className="h-12 w-12" />
              <p className="mt-4 text-lg font-semibold">Analyzing your resume...</p>
              <p className="text-muted-foreground">Our AI is working its magic. This may take a moment.</p>
            </div>
          </Card>
        )}

        {!isLoading && !result && (
           <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
             <div className="text-center text-muted-foreground">
               <FileText className="mx-auto h-16 w-16" />
               <h3 className="mt-4 text-lg font-semibold text-foreground">Awaiting Resume</h3>
               <p className="mt-1">Your review results will appear here.</p>
             </div>
           </Card>
         )}

        {result && (
          <div className="space-y-6">
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{renderWithBold(result.summary)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle>Suggestions for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
                  {result.suggestions.split('\n').map((item, index) => {
                    const cleanedItem = item.trim().replace(/^\s*(\d+\.|-)\s*/, '');
                    if (!cleanedItem) return null;
                    return <li key={index} className="pl-2">{renderWithBold(cleanedItem)}</li>
                  })}
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
