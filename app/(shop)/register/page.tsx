import { RegisterForm } from '@/components/auth/register-form';
import { Section, Container } from '@/components/craft';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <Section className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-neutral-50 dark:bg-neutral-900/50">
            <Container>
                <div className="mx-auto max-w-lg space-y-6">
                    <div className="text-center">
                        <h1 className="font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
                            Create Account
                        </h1>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            Join us to track orders, save favorites, and get exclusive offers
                        </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                        <RegisterForm />
                    </div>

                    <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-secondary-600 hover:underline dark:text-secondary-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Container>
        </Section>
    );
}
