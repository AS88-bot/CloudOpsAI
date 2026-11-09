export interface AIModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "infrastructure" | "security" | "cost" | "devops";
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
