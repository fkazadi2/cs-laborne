
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
          Cette page est en cours de construction pour une gestion plus détaillée.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center py-12">
        <Construction className="h-16 w-16 text-muted-foreground mb-6" />
        <p className="text-lg text-muted-foreground mb-2">
          Les fonctionnalités avancées de gestion du minerval, incluant la configuration des frais, le suivi détaillé des paiements sur plusieurs périodes, la génération de reçus, et la gestion des soldes sera implémentée ici.
        </p>
        <p className="text-sm text-muted-foreground">
          Pour l'instant, utilisez le formulaire ci-dessus pour une gestion basique.
        </p>
      </CardContent>
    </Card>
  );
}
