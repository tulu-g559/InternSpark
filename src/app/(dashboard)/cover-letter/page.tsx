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
import { FileDropzone } from '@/components/file-dropzone';
import { FileText, Wand2 } from 'lucide-react';

import { generateCoverLetter, type CoverLetterOutput } from '@/ai/flows/cover-letter-generator';

const formSchema = z.object({
  roleTitle: z.string().min(3, { message: 'Role title is required.' }),
  companyName: z.string().min(2, { message: 'Company name is required.' }),
  resumeDataUri: z.string().refine((s) => s.startsWith('data:'), {
    message: 'Please upload your resume.',
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
      resumeDataUri: '',
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>AI Cover Letter Generator</CardTitle>
          <CardDescription>Create a professional cover letter tailored to the company and role you're applying for, based on your resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="resumeDataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload your Resume</FormLabel>
                    <FormControl>
                      <FileDropzone 
                        onFileRead={(content) => field.onChange(content)} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full transition ease-in-out hover:scale-105">
                {isLoading ? <Loader /> : <> <Wand2 className="mr-2 h-4 w-4" /> Generate Cover Letter </>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {isLoading && (
          <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Loader className="h-12 w-12" />
              <p className="mt-4 text-lg font-semibold">Generating your cover letter...</p>
              <p className="text-muted-foreground">Our AI is crafting the perfect message. Hang tight.</p>
            </div>
          </Card>
        )}

        {!isLoading && !result && (
           <Card className="flex min-h-[400px] items-center justify-center rounded-xl shadow-lg">
             <div className="text-center text-muted-foreground">
               <FileText className="mx-auto h-16 w-16" />
               <h3 className="mt-4 text-lg font-semibold text-foreground">Awaiting Details</h3>
               <p className="mt-1">Your generated cover letter will appear here.</p>
             </div>
           </Card>
         )}

        {result && (
          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle>Generated Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border bg-background p-4 font-serif">
                <p className="whitespace-pre-wrap">{result.coverLetter}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
