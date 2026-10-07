import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  phone: z.string().optional(),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(2, "La ville est requise"),
  address: z.string().min(5, "L'adresse est requise"),
  postalCode: z.string().min(3, "Le code postal est requis"),
});

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(2, "La ville est requise"),
  address: z.string().min(5, "L'adresse est requise"),
  postalCode: z.string().min(3, "Le code postal est requis"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  description: z.string().optional(),
  price: z.number().min(0, "Le prix doit être positif"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().optional(),
});

export const variantSchema = z.object({
  size: z.string().min(1, "La taille est requise"),
  sku: z.string().min(1, "Le SKU est requis"),
  stock: z.number().min(0, "Le stock doit être positif ou nul"),
  price: z.number().min(0).optional(),
});

export const athleteSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  instagram: z.string().url("URL Instagram invalide").optional().or(z.literal("")),
  description: z.string().optional(),
  image: z.string().url("URL d'image invalide").optional().or(z.literal("")),
  featured: z.boolean().optional(),
  position: z.number().optional(),
});

export const settingsSchema = z.object({
  brandName: z.string().min(1, "Le nom de marque est requis"),
  logo: z.string().url("URL de logo invalide").optional().or(z.literal("")),
  instagramUrl: z.string().url("URL Instagram invalide").optional().or(z.literal("")),
  contactEmail: z.string().email("Email invalide"),
  contactPhone: z.string().optional(),
  shippingPrice: z.number().min(0, "Le prix de livraison doit être positif ou nul"),
  currency: z.string().min(3, "La devise est requise"),
  storeStatus: z.boolean(),
  maintenanceMode: z.boolean(),
});

export const marqueeSchema = z.object({
  text: z.string().min(1, "Le texte est requis"),
  enabled: z.boolean(),
  position: z.number().optional(),
});

export const sizeGuideSchema = z.object({
  size: z.string().min(1, "La taille est requise"),
  chest: z.number().min(0, "Le tour de poitrine doit être positif"),
  length: z.number().min(0, "La longueur doit être positive"),
  shoulder: z.number().min(0, "L'épaule doit être positive"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
export type AthleteInput = z.infer<typeof athleteSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type MarqueeInput = z.infer<typeof marqueeSchema>;
export type SizeGuideInput = z.infer<typeof sizeGuideSchema>;