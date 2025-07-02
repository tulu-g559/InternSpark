'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Loader } from '@/components/loader';

import { resumeReview, type ResumeReviewOutput } from '@/ai/flows/resume-review';

const formSchema = z.object({
  resumeText: z.string().min(100, {
    message: 'Resume text must be at least 100 characters.',
  }),
});

export default function ResumeReviewPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeReviewOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
    },
  });

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
    <div>
      <PageHeader
        title="AI Resume Review"
        description="Upload your resume and get a detailed analysis with improvement suggestions. Our AI will provide a summary and actionable tips."
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
                  {isLoading ? <Loader /> : 'Review My Resume'}
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
                <p className="mt-4 text-muted-foreground">Analyzing your resume...</p>
              </div>
            </Card>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap font-code text-sm">{result.summary}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Suggestions for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {result.suggestions.split('\n').map((item, index) => item.trim() && <li key={index}>{item.replace(/^- /, '')}</li>)}
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
