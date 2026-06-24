import { auth } from '@/lib/auth';
import { checkAcesso } from '@/lib/acesso';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from './sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const acesso = await checkAcesso(session.user.id);

  let trialInfo: string | undefined;
  if (acesso.motivo === 'trialing' && acesso.diasRestantesTrial !== null) {
    trialInfo = `Trial: ${acesso.diasRestantesTrial} dias restantes`;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        userName={session.user.name ?? session.user.email ?? 'Usuário'}
        trialInfo={trialInfo}
      />
      <main className="flex-1 p-4 pt-16 lg:p-8 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
