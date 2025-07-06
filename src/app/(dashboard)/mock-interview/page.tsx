'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { Wand2, MessagesSquare } from 'lucide-react';


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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Mock HR Interview</CardTitle>
          <CardDescription>Generate personalized HR interview questions based on your target internship role to help you prepare and succeed.</CardDescription>
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
              <Button type="submit" disabled={isLoading} className="w-full transition ease-in-out hover:scale-105">
                {isLoading ? <Loader /> : <> <Wand2 className="mr-2 h-4 w-4" /> Generate Questions</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {isLoading && (
          <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
            <div className="text-center">
              <Loader className="mx-auto h-12 w-12" />
              <p className="mt-4 text-muted-foreground">Generating questions...</p>
            </div>
          </Card>
        )}

        {!isLoading && !result && (
           <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
             <div className="text-center text-muted-foreground">
               <MessagesSquare className="mx-auto h-16 w-16" />
               <h3 className="mt-4 text-lg font-semibold text-foreground">Awaiting Role</h3>
               <p className="mt-1">Your generated questions will appear here.</p>
             </div>
           </Card>
         )}

        {result && (
          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle>Your Mock Interview Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-4 pl-5 text-sm text-muted-foreground">
                {result.questions.map((q, index) => (
                  <li key={index} className="pl-2">{q.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
