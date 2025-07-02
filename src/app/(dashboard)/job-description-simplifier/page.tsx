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

import { simplifyJobDescription, type SimplifyJobDescriptionOutput } from '@/ai/flows/job-description-simplifier';

const formSchema = z.object({
  jobDescription: z.string().min(50, {
    message: 'Job description must be at least 50 characters.',
  }),
});

export default function JobDescriptionSimplifierPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimplifyJobDescriptionOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await simplifyJobDescription(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to simplify job description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Job Description Simplifier"
        description="Paste a complex job description to get a clear, easy-to-understand summary of key skills, responsibilities, and preparation tips."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paste the job description below</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the full job description here..."
                          className="min-h-[300px] resize-y text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader /> : 'Simplify Description'}
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
                <p className="mt-4 text-muted-foreground">Simplifying the description...</p>
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
                  <p className="text-sm">{result.summary}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.requiredSkills}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Preparation Tips</CardTitle>
                </CardHeader>
                <CardContent>
                 <p className="text-sm">{result.preparationTips}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
