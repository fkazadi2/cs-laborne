
// src/components/tuition-management-placeholder.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Construction } from "lucide-react";

export function TuitionManagementPlaceholder() {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <DollarSign className="mr-2 h-6 w-6" />
          Module de Gestion du Minerval
        </CardTitle>
        <CardDescription>
          Cette fonctionnalité est en cours de développement.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center py-12">
        <Construction className="h-16 w-16 text-muted-foreground mb-6" />
        <p className="text-lg text-muted-foreground mb-2">
          La gestion détaillée du minerval, incluant le suivi des paiements, la génération de reçus, et la gestion des soldes sera implémentée ici.
        </p>
        <p className="text-sm text-muted-foreground">
          Revenez bientôt pour découvrir cette fonctionnalité !
        </p>
      </CardContent>
    </Card>
  );
}
