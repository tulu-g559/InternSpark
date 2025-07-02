import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/resume-review');
  return null;
}
