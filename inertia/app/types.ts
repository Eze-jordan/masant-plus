// types.ts
export interface PageProps {
    // Ajoute ici les propriétés spécifiques que tu souhaites transmettre aux pages
    user: string;
    role: string;
    // Par exemple, si tu passes des données spécifiques à chaque page :
    [key: string]: any;  // pour gérer les propriétés dynamiques
  }
  