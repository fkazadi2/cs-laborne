
// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} C.S. La Borne. Tous droits réservés.</p>
        <p className="text-sm mt-1">Propulsé par Firebase Studio</p>
      </div>
    </footer>
  );
}
