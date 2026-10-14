export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      articles: {
        Row: {
          category: string | null;
          content: string | null;
          cover_image: string | null;
          created_at: string;
          excerpt: string | null;
          featured: boolean;
          id: string;
          kind: string;
          published: boolean;
          published_at: string | null;
          reading_time: number;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          category?: string | null;
          content?: string | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          featured?: boolean;
          id?: string;
          kind?: string;
          published?: boolean;
          published_at?: string | null;
          reading_time?: number;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          category?: string | null;
          content?: string | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          featured?: boolean;
          id?: string;
          kind?: string;
          published?: boolean;
          published_at?: string | null;
          reading_time?: number;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          attachment: string | null;
          budget: string | null;
          company: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          project_type: string | null;
        };
        Insert: {
          attachment?: string | null;
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          project_type?: string | null;
        };
        Update: {
          attachment?: string | null;
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          project_type?: string | null;
        };
        Relationships: [];
      };
      experiments: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          id: string;
          published: boolean;
          status: string;
          title: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          code?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          published?: boolean;
          status?: string;
          title: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          published?: boolean;
          status?: string;
          title?: string;
          updated_at?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      now_items: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          published: boolean;
          sort_order: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
          published?: boolean;
          sort_order?: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          published?: boolean;
          sort_order?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          approach: string | null;
          category: string | null;
          client: string | null;
          created_at: string;
          description: string | null;
          design_direction: string | null;
          development: string | null;
          featured: boolean;
          featured_image: string | null;
          gallery: string[];
          id: string;
          layout: string;
          location: string | null;
          outcome: string | null;
          overview: string | null;
          problem: string | null;
          published: boolean;
          reflection: string | null;
          slug: string;
          sort_order: number;
          technologies: string[];
          title: string;
          updated_at: string;
          url: string | null;
          year: string | null;
        };
        Insert: {
          approach?: string | null;
          category?: string | null;
          client?: string | null;
          created_at?: string;
          description?: string | null;
          design_direction?: string | null;
          development?: string | null;
          featured?: boolean;
          featured_image?: string | null;
          gallery?: string[];
          id?: string;
          layout?: string;
          location?: string | null;
          outcome?: string | null;
          overview?: string | null;
          problem?: string | null;
          published?: boolean;
          reflection?: string | null;
          slug: string;
          sort_order?: number;
          technologies?: string[];
          title: string;
          updated_at?: string;
          url?: string | null;
          year?: string | null;
        };
        Update: {
          approach?: string | null;
          category?: string | null;
          client?: string | null;
          created_at?: string;
          description?: string | null;
          design_direction?: string | null;
          development?: string | null;
          featured?: boolean;
          featured_image?: string | null;
          gallery?: string[];
          id?: string;
          layout?: string;
          location?: string | null;
          outcome?: string | null;
          overview?: string | null;
          problem?: string | null;
          published?: boolean;
          reflection?: string | null;
          slug?: string;
          sort_order?: number;
          technologies?: string[];
          title?: string;
          updated_at?: string;
          url?: string | null;
          year?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          url: string | null;
          position: string | null;
          description: string | null;
          cta: string | null;
          image: string | null;
          visual: string | null;
          status: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          url?: string | null;
          position?: string | null;
          description?: string | null;
          cta?: string | null;
          image?: string | null;
          visual?: string | null;
          status?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          url?: string | null;
          position?: string | null;
          description?: string | null;
          cta?: string | null;
          image?: string | null;
          visual?: string | null;
          status?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          availability_status: string | null;
          current_focus: string | null;
          email: string | null;
          github_url: string | null;
          id: number;
          instagram_url: string | null;
          linkedin_url: string | null;
          location: string | null;
          site_name: string | null;
          twitter_url: string | null;
          updated_at: string;
          youtube_url: string | null;
        };
        Insert: {
          availability_status?: string | null;
          current_focus?: string | null;
          email?: string | null;
          github_url?: string | null;
          id?: number;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          location?: string | null;
          site_name?: string | null;
          twitter_url?: string | null;
          updated_at?: string;
          youtube_url?: string | null;
        };
        Update: {
          availability_status?: string | null;
          current_focus?: string | null;
          email?: string | null;
          github_url?: string | null;
          id?: number;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          location?: string | null;
          site_name?: string | null;
          twitter_url?: string | null;
          updated_at?: string;
          youtube_url?: string | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          company: string | null;
          country: string | null;
          created_at: string;
          featured: boolean;
          id: string;
          image: string | null;
          name: string;
          published: boolean;
          quote: string;
          role: string | null;
          updated_at: string;
        };
        Insert: {
          company?: string | null;
          country?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          image?: string | null;
          name: string;
          published?: boolean;
          quote: string;
          role?: string | null;
          updated_at?: string;
        };
        Update: {
          company?: string | null;
          country?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          image?: string | null;
          name?: string;
          published?: boolean;
          quote?: string;
          role?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      youtube_videos: {
        Row: {
          created_at: string;
          description: string | null;
          featured: boolean;
          id: string;
          published: boolean;
          thumbnail: string | null;
          title: string;
          updated_at: string;
          video_url: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          published?: boolean;
          thumbnail?: string | null;
          title: string;
          updated_at?: string;
          video_url: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          published?: boolean;
          thumbnail?: string | null;
          title?: string;
          updated_at?: string;
          video_url?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "editor" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const;
