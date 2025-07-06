
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Footer } from '@/components/footer';
import { ArrowRight, ClipboardList, FileText, Gauge, Mail, MessagesSquare } from 'lucide-react';

function Doodles() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 -translate-x-1/4 -translate-y-0"
        width="800"
        height="600"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-50 550C-50 550 150 250 350 350C550 450 450 200 650 150"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        <path
          d="M200 450C200 450 250 500 300 450C350 400 300 350 250 350C200 350 150 400 200 450Z"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0 translate-x-1/4 -translate-y-0"
        width="800"
        height="600"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M850 550C850 550 650 250 450 350C250 450 350 200 150 150"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Resume Reviewer',
      description: 'Get AI-powered feedback on your resume to highlight your strengths and fix weaknesses.',
    },
    {
      icon: <MessagesSquare className="h-8 w-8 text-primary" />,
      title: 'Mock HR Questions',
      description: 'Generate realistic HR interview questions for any role and practice your answers.',
    },
    {
      icon: <Gauge className="h-8 w-8 text-primary" />,
      title: 'Readiness Tracker',
      description: 'Receive a data-driven readiness score and actionable tips to improve your profile.',
    },
    {
      icon: <Mail className="h-8 w-8 text-primary" />,
      title: 'Cover Letter Generator',
      description: 'Create professional, tailored cover letters that catch the eye of recruiters.',
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      title: 'JD Simplifier',
      description: 'Decode complex job descriptions into clear summaries and required skill sets.',
    },
     {
      icon: <Icons.InternAISVG className="h-8 w-8 text-primary" />,
      title: 'More On the Way',
      description: 'We are constantly working on new features to help you succeed in your internship search.',
    }
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.InternSparkLogo className="h-8 w-auto" />
            <span className="text-lg font-bold">InternSpark</span>
          </Link>
          <nav>
            <Button asChild>
              <Link href="/auth">
                Login / Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container relative py-20 text-center sm:py-32">
          <Doodles />
          
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI Copilot for{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
              Internship Success
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            From resume reviews to mock interviews, InternSpark leverages AI to
            help you stand out and land your dream tech internship.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="transition ease-in-out hover:scale-105">
              <Link href="/auth">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-12 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              All-in-One Preparation Toolkit
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to go from applicant to interviewee, powered by Gemini.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-card/50 py-12 sm:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get Ready in 3 Simple Steps
              </h2>
              <p className="mt-4 text-muted-foreground">
                A clear path to sharpening your competitive edge.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/20">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Upload Your Resume</h3>
                <p className="text-muted-foreground">
                  Securely upload your resume to create your baseline profile. This is the foundation for all AI analysis.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/20">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Use AI Tools</h3>
                <p className="text-muted-foreground">
                  Leverage our suite of tools, from the readiness tracker to the cover letter generator, to prepare for applications.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/20">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Apply with Confidence</h3>
                <p className="text-muted-foreground">
                  With AI-driven insights and practice, you'll be fully prepared to impress recruiters and land the job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="container py-20 text-center sm:py-32">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Land Your Dream Internship?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Stop guessing and start preparing with data-driven insights. Sign up now and take the first step towards a successful career.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="transition ease-in-out hover:scale-105">
              <Link href="/auth">Start Your Journey Today</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
