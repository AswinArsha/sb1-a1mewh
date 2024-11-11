// src/components/ClientCard.tsx

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Client } from '@/types';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientCardProps {
  client: Client;
  onApprove: (clientId: string) => void;
}

export function ClientCard({ client, onApprove }: ClientCardProps) {
  const navigate = useNavigate();

  const handleViewLedger = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/ledger/${client.id}`);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove(client.id);
  };

  // Calculate completed sub-stages
  const completedCount = (client.subStages || []).filter((s) => s.completed).length;
  const totalSubStages = (client.subStages || []).length;

  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-medium">{client.name}</h4>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>

        {totalSubStages > 0 && (
          <div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${(completedCount / totalSubStages) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedCount} of {totalSubStages} tasks completed
            </p>
          </div>
        )}

        {client.stage === 'design-planning' && !client.approved && (
          <Button size="sm" className="w-full" onClick={handleApprove}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve Client
          </Button>
        )}

        {client.approved && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleViewLedger}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Ledger
          </Button>
        )}
      </div>
    </Card>
  );
}
