export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          firebase_uid: string;
          email: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          firebase_uid: string;
          email: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          firebase_uid?: string;
          email?: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          species: Database['public']['Enums']['pet_species'];
          breed: string | null;
          birthday: string | null;
          weight: number | null;
          gender: Database['public']['Enums']['pet_gender'];
          profile_image_url: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          species: Database['public']['Enums']['pet_species'];
          breed?: string | null;
          birthday?: string | null;
          weight?: number | null;
          gender: Database['public']['Enums']['pet_gender'];
          profile_image_url?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          species?: Database['public']['Enums']['pet_species'];
          breed?: string | null;
          birthday?: string | null;
          weight?: number | null;
          gender?: Database['public']['Enums']['pet_gender'];
          profile_image_url?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      hospitals: {
        Row: {
          id: string;
          name: string;
          road_address: string | null;
          region: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          road_address?: string | null;
          region?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          road_address?: string | null;
          region?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      health_records: {
        Row: {
          id: string;
          pet_id: string;
          hospital_id: string | null;
          visit_date: string;
          total_amount: number;
          memo: string | null;
          receipt_image_url: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          hospital_id?: string | null;
          visit_date: string;
          total_amount: number;
          memo?: string | null;
          receipt_image_url?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          hospital_id?: string | null;
          visit_date?: string;
          total_amount?: number;
          memo?: string | null;
          receipt_image_url?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'health_records_pet_id_fkey';
            columns: ['pet_id'];
            isOneToOne: false;
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'health_records_hospital_id_fkey';
            columns: ['hospital_id'];
            isOneToOne: false;
            referencedRelation: 'hospitals';
            referencedColumns: ['id'];
          },
        ];
      };
      health_items: {
        Row: {
          id: string;
          health_record_id: string;
          item_name: string;
          price: number;
          quantity: number;
          category_tag: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          health_record_id: string;
          item_name: string;
          price: number;
          quantity?: number;
          category_tag?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          health_record_id?: string;
          item_name?: string;
          price?: number;
          quantity?: number;
          category_tag?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'health_items_health_record_id_fkey';
            columns: ['health_record_id'];
            isOneToOne: false;
            referencedRelation: 'health_records';
            referencedColumns: ['id'];
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
      pet_species: 'dog' | 'cat' | 'etc';
      pet_gender: 'male' | 'female' | 'neutered_male' | 'spayed_female';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database['public'];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
