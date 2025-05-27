export const useSupabaseAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // Connexion avec Google (équivalent Firebase)
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error("Erreur connexion Google:", error);
      return { user: null, error };
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirection vers la page d'accueil
      await navigateTo("/");
      return { error: null };
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      return { error };
    }
  };

  // Récupérer les données utilisateur depuis la table users
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Erreur récupération profil:", error);
      return { data: null, error };
    }
  };

  // Créer ou mettre à jour le profil utilisateur
  const upsertUserProfile = async (userData: {
    id: string;
    email: string;
    name: string;
    photo_url?: string;
    role?: "USER" | "CONTRIBUTOR" | "ADMIN";
  }) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .upsert({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      return { data: null, error };
    }
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = computed(() => {
    return user.value?.user_metadata?.role === "ADMIN";
  });

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = computed(() => {
    return !!user.value;
  });

  return {
    user,
    signInWithGoogle,
    signOut,
    getUserProfile,
    upsertUserProfile,
    isAdmin,
    isAuthenticated,
  };
};
