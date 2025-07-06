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

// A single schema for both login and signup.
// Name is optional at the base level, and we'll enforce it for signup using superRefine.
const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

// A helper function to create a dynamic schema based on the view.
const getDynamicSchema = (isLogin: boolean) => {
  return authSchema.superRefine((data, ctx) => {
    // If it's the signup view, the name field is required.
    if (!isLogin && (!data.name || data.name.length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: 'Name must be at least 3 characters.',
      });
    }
  });
};

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { user, signup, login, loading: isAuthLoading } = useAuth();

  const form = useForm<AuthFormValues>({
    // The resolver now uses the dynamic schema, which is re-evaluated on each render.
    resolver: zodResolver(getDynamicSchema(isLoginView)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // When the view toggles, reset the form to clear validation errors from the previous view.
    form.reset();
  }, [isLoginView, form]);

  useEffect(() => {
    if (user) {
      router.push('/resume-review');
    }
  }, [user, router]);
  
  const onSubmit = async (values: AuthFormValues) => {
    try {
      if (isLoginView) {
        await login(values.email, values.password);
        toast({ title: 'Success', description: 'Logged in successfully.' });
        router.push('/resume-review');
      } else {
        // Our validation ensures `values.name` is a valid string in the signup flow.
        await signup(values.email, values.password, values.name!);
        toast({ title: 'Success', description: 'Account created successfully.' });
        router.push('/resume-review');
      }
    } catch (error: any) {
      console.error(error);
      let description = 'An unexpected error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          description = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/email-already-in-use':
          description = 'This email is already registered. Please log in or use a different email.';
          break;
        default:
          description = error.message || description;
          break;
      }

      toast({
        title: 'Authentication Error',
        description,
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
              <CardTitle>{isLoginView ? 'Welcome !!!' : 'Create an Account'}</CardTitle>
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
                            <Input placeholder="Arnab Ghosh" {...field} value={field.value ?? ''} />
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
