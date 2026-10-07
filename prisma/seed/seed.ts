import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts-edge";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminEmail = "admin@panther.com";
  const adminPassword = hashSync("PantherAdmin2024!", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create default customer for testing
  const customerEmail = "customer@panther.com";
  const customerPassword = hashSync("Customer123!", 10);

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      email: customerEmail,
      name: "Test Customer",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Test customer created:", customer.email);

  // Create Panther Oversized T-Shirt
  const product = await prisma.product.upsert({
    where: { slug: "panther-oversized-tee" },
    update: {},
    create: {
      name: "PANTHER OVERSIZED T-SHIRT",
      slug: "panther-oversized-tee",
      description: "Heavyweight premium cotton. Oversized silhouette. Built for training and the streets. One shirt. One standard.",
      price: 89.00,
      status: "PUBLISHED",
      featured: true,
    },
  });
  console.log("✅ Product created:", product.name);

  // Create product images
  const images = [
    { url: "/images/list1.png", alt: "Front View", position: 0 },
    { url: "/images/list2.png", alt: "Back View", position: 1 },
    { url: "/images/list3.png", alt: "Side View", position: 2 },
  ];

  for (const image of images) {
    await prisma.productImage.upsert({
      where: { id: `img-${product.id}-${image.position}` },
      update: { url: image.url, alt: image.alt, position: image.position },
      create: {
        id: `img-${product.id}-${image.position}`,
        productId: product.id,
        url: image.url,
        alt: image.alt,
        position: image.position,
      },
    });
  }
  console.log("✅ Product images created");

  // Create product variants
  const variants = [
    { size: "S", sku: "PANTHER-TEE-S", stock: 12, price: 89.00 },
    { size: "M", sku: "PANTHER-TEE-M", stock: 24, price: 89.00 },
    { size: "L", sku: "PANTHER-TEE-L", stock: 31, price: 89.00 },
    { size: "XL", sku: "PANTHER-TEE-XL", stock: 18, price: 89.00 },
    { size: "XXL", sku: "PANTHER-TEE-XXL", stock: 5, price: 89.00 },
  ];

  for (const variant of variants) {
    await prisma.productVariant.upsert({
      where: { sku: variant.sku },
      update: { stock: variant.stock },
      create: {
        productId: product.id,
        size: variant.size,
        sku: variant.sku,
        stock: variant.stock,
        price: variant.price,
      },
    });
  }
  console.log("✅ Product variants created");

  // Create size guide
  const sizeGuide = [
    { size: "S", chest: 104, length: 72, shoulder: 52 },
    { size: "M", chest: 110, length: 74, shoulder: 54 },
    { size: "L", chest: 116, length: 76, shoulder: 56 },
    { size: "XL", chest: 122, length: 78, shoulder: 58 },
    { size: "XXL", chest: 128, length: 80, shoulder: 60 },
  ];

  for (const size of sizeGuide) {
    await prisma.sizeGuide.upsert({
      where: { size: size.size },
      update: {},
      create: size,
    });
  }
  console.log("✅ Size guide created");

  // Create site settings
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandName: "PANTHER",
      instagramUrl: "https://instagram.com/panther",
      contactEmail: "contact@panther.com",
      contactPhone: "+33 1 23 45 67 89",
      shippingPrice: 9.99,
      currency: "TND",
      storeStatus: true,
      maintenanceMode: false,
    },
  });
  console.log("✅ Site settings created");

  // Create marquee messages
  const marqueeMessages = [
    "PANTHER — BUILT FOR THOSE WHO REFUSE TO BLEND IN",
    "PREMIUM OVERSIZED FIT",
    "HEAVYWEIGHT PREMIUM COTTON",
    "BUILT FOR TRAINING. DESIGNED FOR THE STREET.",
    "ONE SHIRT. ONE STANDARD.",
    "WEAR THE PANTHER.",
  ];

  for (let i = 0; i < marqueeMessages.length; i++) {
    await prisma.marqueeMessage.upsert({
      where: { id: `marquee-${i}` },
      update: {},
      create: {
        id: `marquee-${i}`,
        text: marqueeMessages[i],
        enabled: true,
        position: i,
      },
    });
  }
  console.log("✅ Marquee messages created");

  // Create athletes
  const athletes = [
    {
      name: "Marcus Steele",
      instagram: "https://instagram.com/marcussteele",
      description: "Powerlifter. 3x National Champion. Built different.",
      image: "/images/crew1.png",
      featured: true,
      position: 0,
    },
    {
      name: "Elena Voss",
      instagram: "https://instagram.com/elenavoss",
      description: "CrossFit Games Athlete. Strength in silence.",
      image: "/images/crew2.png",
      featured: true,
      position: 1,
    },
    {
      name: "Kai Romano",
      instagram: "https://instagram.com/kairomano",
      description: "Street Workout Champion. Movement is life.",
      image: "/images/crew3.png",
      featured: true,
      position: 2,
    },
  ];

  for (const athlete of athletes) {
    await prisma.athlete.upsert({
      where: { id: `athlete-${athlete.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: { image: athlete.image, description: athlete.description, featured: athlete.featured, position: athlete.position },
      create: {
        id: `athlete-${athlete.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...athlete,
      },
    });
  }
  console.log("✅ Athletes created");

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });