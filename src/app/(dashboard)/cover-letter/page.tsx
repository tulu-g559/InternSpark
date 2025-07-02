'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Loader } from '@/components/loader';

import { generateCoverLetter, type CoverLetterOutput } from '@/ai/flows/cover-letter-generator';

const formSchema = z.object({
  roleTitle: z.string().min(3, { message: 'Role title is required.' }),
  companyName: z.string().min(2, { message: 'Company name is required.' }),
  resumeText: z.string().min(100, {
    message: 'Resume text must be at least 100 characters.',
  }),
});

export default function CoverLetterPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleTitle: '',
      companyName: '',
      resumeText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateCoverLetter(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate cover letter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Cover Letter Generator"
        description="Create a professional cover letter tailored to the company and role you're applying for, based on your resume."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="roleTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Product Manager Intern" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paste your resume text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your full resume here..."
                          className="min-h-[200px] resize-y font-code text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader /> : 'Generate Cover Letter'}
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
                <p className="mt-4 text-muted-foreground">Generating your cover letter...</p>
              </div>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none rounded-md border bg-secondary/30 p-4 font-serif">
                  <p className="whitespace-pre-wrap">{result.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
