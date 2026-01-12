export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  experience: string;
  ingredients: string[];
  sensorialExperience: string;
  imageUrl: string;
  category: ProductCategory;
  // New fields for enhanced product information
  curatedLine: string;
  occasions: string[];
  affinity: ProductAffinity;
  servingSuggestion: string;
}

export interface ProductAffinity {
  temperament: string[];
  palate: string[];
  genderAffinity: string;
}

export enum ProductCategory {
  PREMIUM = 'premium',
  CLASSIC = 'classic',
  EXCLUSIVE = 'exclusive'
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROCESS = 'in_process',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface PaymentInfo {
  bankAccount: string;
  accountType: string;
  accountNumber: string;
  bankName: string;
}

export interface CustomerData {
  readonly firstName: string;
  readonly lastName: string;
  readonly identificationType: IdentificationType;
  readonly identificationNumber: string;
  readonly department: string;
  readonly municipality: string;
  readonly address: Readonly<AddressDetails>;
  readonly email: string;
  readonly phone: string;
  readonly acceptsDataProcessing: boolean;
}

export interface AddressDetails {
  readonly urbanization?: string;
  readonly houseNumber: string;
  readonly apartmentNumber?: string;
  readonly tower?: string;
  readonly block?: string;
  readonly additionalInfo?: string;
}

export enum IdentificationType {
  CC = 'Cédula de Ciudadanía',
  CE = 'Cédula de Extranjería',
  TI = 'Tarjeta de Identidad',
  PP = 'Pasaporte'
}

export interface Department {
  id: string;
  name: string;
  municipalities: Municipality[];
}

export interface Municipality {
  id: string;
  name: string;
  departmentId: string;
}

export interface CheckoutData {
  customer: CustomerData;
  cart: Cart;
  paymentInstructions: PaymentInstructions;
}

export interface PaymentInstructions {
  breAccount: string;
  whatsappNumber: string;
  steps: PaymentStep[];
}

export interface PaymentStep {
  stepNumber: number;
  title: string;
  description: string;
}