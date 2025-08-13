export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      media: {
        Row: {
          [x: string]: any;
          alt: string | null;
          created_at: string;
          id: number;
          name: string | null;
          url: string;
          uuid: string;
        };
        Insert: {
          alt?: string | null;
          created_at?: string;
          id?: number;
          name?: string | null;
          url: string;
          uuid?: string;
        };
        Update: {
          alt?: string | null;
          created_at?: string;
          id?: number;
          name?: string | null;
          url?: string;
          uuid?: string;
        };
        Relationships: [];
      };
      'order-time': {
        Row: {
          created_at: string;
          id: number;
          orders_close_day: number | null;
          orders_close_time: string | null;
          orders_close_timestamp: string | null;
          orders_open_day: number | null;
          orders_open_time: string | null;
          orders_open_timestamp: string | null;
          use_recurring_time: boolean | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          orders_close_day?: number | null;
          orders_close_time?: string | null;
          orders_close_timestamp?: string | null;
          orders_open_day?: number | null;
          orders_open_time?: string | null;
          orders_open_timestamp?: string | null;
          use_recurring_time?: boolean | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          orders_close_day?: number | null;
          orders_close_time?: string | null;
          orders_close_timestamp?: string | null;
          orders_open_day?: number | null;
          orders_open_time?: string | null;
          orders_open_timestamp?: string | null;
          use_recurring_time?: boolean | null;
        };
        Relationships: [];
      };
      product: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          link: string | null;
          name: string | null;
          price: string | null;
          published: boolean | null;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          link?: string | null;
          name?: string | null;
          price?: string | null;
          published?: boolean | null;
          uuid?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          link?: string | null;
          name?: string | null;
          price?: string | null;
          published?: boolean | null;
          uuid?: string;
        };
        Relationships: [];
      };
      product_media: {
        Row: {
          created_at: string;
          id: number;
          media_id: string;
          product_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          media_id?: string;
          product_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          media_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_media_media_id_fkey';
            columns: ['media_id'];
            isOneToOne: true;
            referencedRelation: 'media';
            referencedColumns: ['uuid'];
          },
          {
            foreignKeyName: 'product_media_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product';
            referencedColumns: ['uuid'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
