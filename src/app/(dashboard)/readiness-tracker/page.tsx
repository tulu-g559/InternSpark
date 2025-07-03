'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { FileDropzone } from '@/components/file-dropzone';
import { FileText, Wand2, Star, CheckCircle } from 'lucide-react';
import { usePersistentResume } from '@/hooks/use-persistent-resume';

import { calculateInternshipReadiness, type InternshipReadinessOutput } from '@/ai/flows/internship-readiness-score';

const formSchema = z.object({
  resumeDataUri: z.string().refine((s) => s.startsWith('data:'), {
    message: 'Please upload your resume.',
  }),
});

export default function ReadinessTrackerPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InternshipReadinessOutput | null>(null);
  const [progressValue, setProgressValue] = useState(0);
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
    setProgressValue(0);
    try {
      const response = await calculateInternshipReadiness(values);
      setResult(response);
      // Animate progress bar
      setTimeout(() => setProgressValue(response.score), 100);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to calculate readiness score. Please try again.',
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
            <CardTitle>Internship Readiness</CardTitle>
            <CardDescription>Analyze your resume to get an internship readiness score and personalized tips.</CardDescription>
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
                  {isLoading ? <Loader /> : <> <Wand2 className="mr-2 h-4 w-4" /> Calculate My Score </>}
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
              <p className="mt-4 text-lg font-semibold">Calculating your score...</p>
              <p className="text-muted-foreground">Our AI is crunching the numbers. Please wait.</p>
            </div>
          </Card>
        )}

        {!isLoading && !result && (
           <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
             <div className="text-center text-muted-foreground">
               <FileText className="mx-auto h-16 w-16" />
               <h3 className="mt-4 text-lg font-semibold text-foreground">Awaiting Resume</h3>
               <p className="mt-1">Your readiness score will appear here.</p>
             </div>
           </Card>
         )}

        {result && (
          <div className="space-y-6">
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="text-yellow-400" />
                  Your Readiness Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={progressValue} className="h-4 flex-1" />
                  <span className="text-2xl font-bold text-primary">{result.score}%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" />
                  Personalized Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-none space-y-3 text-sm text-muted-foreground">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
