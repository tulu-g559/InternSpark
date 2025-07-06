
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';

const signupSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { user, signup, login, loading: isAuthLoading } = useAuth();

  const formSchema = isLoginView ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/resume-review');
    }
  }, [user, router]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isLoginView) {
        await login(values.email, values.password);
        toast({ title: 'Success', description: 'Logged in successfully.' });
        router.push('/resume-review');
      } else {
        await signup(values.email, values.password, (values as any).name);
        toast({ title: 'Success', description: 'Account created successfully.' });
        router.push('/resume-review');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (isAuthLoading || user) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-16 w-16" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
       <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                 <div className="flex items-center justify-center gap-x-3">
                    <Icons.InternSparkLogo className="h-14 w-14" />
                    <h1 className="text-4xl font-bold text-white">InternSpark⚡</h1>
                </div>
                 <p className={cn('mt-2 bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-lg font-semibold text-transparent')}>
                    Prep smart. Stand out. Land your dream internship
                </p>
            </div>

          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle>{isLoginView ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
              <CardDescription>
                {isLoginView ? 'Log in to continue your journey.' : 'Sign up to get started.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {!isLoginView && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Arnab Ghosh" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isAuthLoading} className="w-full transition ease-in-out hover:scale-105">
                    {isAuthLoading ? <Loader /> : (isLoginView ? 'Login' : 'Sign Up')}
                  </Button>
                </form>
              </Form>
              <div className="mt-6 text-center text-sm">
                <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="text-primary">
                  {isLoginView ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
