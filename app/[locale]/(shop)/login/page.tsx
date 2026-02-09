import { LoginForm } from '@/components/auth/login-form';
import { Section, Container } from '@/components/craft';
import { Link } from '@/i18n/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTranslations } from 'next-intl/server';

function LoginFormSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

export default async function LoginPage() {
    const t = await getTranslations('auth');

    return (
        <Section className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-neutral-50 dark:bg-neutral-900/50">
            <Container>
                <div className="mx-auto max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
                            {t('welcomeBack')}
                        </h1>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            {t('signInSubtitle')}
                        </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                        <Suspense fallback={<LoginFormSkeleton />}>
                            <LoginForm />
                        </Suspense>
                    </div>

                    <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                        {t('noAccount')}{' '}
                        <Link href="/register" className="font-semibold text-secondary-600 hover:underline dark:text-secondary-500">
                            {t('createOne')}
                        </Link>
                    </p>
                </div>
            </Container>
        </Section>
    );
}
