'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Loader } from '@/components/loader';

import { calculateInternshipReadiness, type InternshipReadinessOutput } from '@/ai/flows/internship-readiness-score';

const formSchema = z.object({
  resumeText: z.string().min(100, {
    message: 'Resume text must be at least 100 characters.',
  }),
});

export default function ReadinessTrackerPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InternshipReadinessOutput | null>(null);
  const [progressValue, setProgressValue] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
    },
  });

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
    <div>
      <PageHeader
        title="Internship Readiness Tracker"
        description="Analyze your resume to get an internship readiness score and personalized tips on how to improve your profile."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paste your resume text below</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your full resume here..."
                          className="min-h-[300px] resize-y font-code text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader /> : 'Calculate My Score'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {isLoading && (
            <Card className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Loader className="mx-auto h-12 w-12" />
                <p className="mt-4 text-muted-foreground">Calculating your score...</p>
              </div>
            </Card>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your Readiness Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Progress value={progressValue} className="h-4 flex-1" />
                    <span className="text-2xl font-bold text-primary">{result.score}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {result.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
