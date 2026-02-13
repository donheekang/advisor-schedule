import { supabase } from '@/lib/supabase';

type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired';

type SubscriptionRow = {
  status: SubscriptionStatus | null;
  current_period_end: string | null;
  expires_at: string | null;
};

const PREMIUM_ACTIVE_STATUSES: SubscriptionStatus[] = ['active', 'trialing'];

function isExpired(dateValue: string | null): boolean {
  if (!dateValue) {
    return false;
  }

  return new Date(dateValue).getTime() < Date.now();
}

export async function isPremium(firebaseUid?: string | null): Promise<boolean> {
  if (!firebaseUid) {
    return false;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('status,current_period_end,expires_at')
    .eq('user_id', firebaseUid)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

  if (error || !data || !data.status) {
    return false;
  }

  const endsAt = data.current_period_end ?? data.expires_at;

  return PREMIUM_ACTIVE_STATUSES.includes(data.status) && !isExpired(endsAt);
}
