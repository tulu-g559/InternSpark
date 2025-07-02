'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Loader } from '@/components/loader';

import { generateMockHrQuestions, type MockHrQuestionsOutput } from '@/ai/flows/mock-hr-interview';

const formSchema = z.object({
  internshipRole: z.string().min(3, {
    message: 'Internship role must be at least 3 characters.',
  }),
});

export default function MockInterviewPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MockHrQuestionsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      internshipRole: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateMockHrQuestions(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate questions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Mock HR Interview"
        description="Generate personalized HR interview questions based on your target internship role to help you prepare and succeed."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Internship Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="internshipRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter internship role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer Intern, Marketing Intern" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader /> : 'Generate Questions'}
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
                <p className="mt-4 text-muted-foreground">Generating questions...</p>
              </div>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Your Mock Interview Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-4 pl-5 text-sm">
                  {result.questions.map((q, index) => (
                    <li key={index} className="pl-2">{q.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
