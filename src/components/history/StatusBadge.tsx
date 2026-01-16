'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  consumed: number;
  limit: number;
}

export function StatusBadge({ consumed, limit }: Props) {
  const isOverLimit = consumed > limit;

  return (
    <Badge
      variant={isOverLimit ? 'destructive' : 'secondary'}
      className='gap-1.5 px-3 py-1 font-medium'
    >
      {isOverLimit ? (
        <>
          <AlertCircle className='h-3.5 w-3.5' />
          Превышение
        </>
      ) : (
        <>
          <CheckCircle2 className='h-3.5 w-3.5 text-green-500' />В норме
        </>
      )}
    </Badge>
  );
}
