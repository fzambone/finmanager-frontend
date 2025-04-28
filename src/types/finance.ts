// Interface for the simplified Category representation used in nesting
// Matches the SimpleCategorySerializer output
export interface SimpleCategory {
  id: number;
  name: string;
}

// Interface for the main Category model representation from the API
// Matches the CategorySerializer output
export interface Category {
  id: number;
  name: string;
  parent_category: SimpleCategory | null;
  sub_categories: SimpleCategory[];
  family_group: number;
  created_at: string;
  updated_at: string;
}

// Interface for the Account model representation from the API
// Matches the AccountSerializer output
export interface Account {
  id: number;
  name: string;
  account_type: string;
  currency: string;
  starting_balance: string;
  family_group: string;
  created_at: string;
  updated_at: string;
}

// Interface for the Transaction model representation from the API
// Matches the TransactionSerializer output
export interface Transaction {
  id: number;
  transaction_type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: string;
  date_time: string;
  account: number;
  category: number | null;
  payee_payer: string;
  description: string;
  is_recurring: boolean;
  family_group: number;
  created_at: string;
  updated_at: string;
}

// Interface for the FamilyGroup model representation from the API
// Matches the FamilyGroupSerializer output
export interface FamilyGroup {
  id: number;
  name: string;
  primary_currency: string;
}
