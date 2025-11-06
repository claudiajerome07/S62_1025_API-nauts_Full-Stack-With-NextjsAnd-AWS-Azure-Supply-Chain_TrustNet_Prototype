// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log("Clearing existing data...");
  await prisma.uPI_Transaction.deleteMany();
  await prisma.businessAnalytics.deleteMany();
  await prisma.endorsement.deleteMany();
  await prisma.review.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { phone: "+919876543210" },
    update: {},
    create: {
      phone: "+919876543210",
      name: "Raj Sharma",
      email: "raj@example.com",
      role: "BUSINESS_OWNER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: "+919876543211" },
    update: {},
    create: {
      phone: "+919876543211",
      name: "Priya Patel",
      email: "priya@example.com",
      role: "BUSINESS_OWNER",
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { phone: "+919876543212" },
    update: {},
    create: {
      phone: "+919876543212",
      name: "Amit Kumar",
      email: "amit@example.com",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { phone: "+919876543213" },
    update: {},
    create: {
      phone: "+919876543213",
      name: "Neha Singh",
      email: "neha@example.com",
      role: "CUSTOMER",
    },
  });

  console.log(`Created users: ${user1.name}, ${user2.name}, ${customer1.name}, ${customer2.name}`);

  // Create sample businesses - REMOVE the hardcoded IDs, let Prisma generate them
  const business1 = await prisma.business.create({
    data: {
      name: "Raj Chai Corner",
      description: "Best masala chai in the neighborhood",
      category: "FOOD_RESTAURANT",
      address: "Near Metro Station, Delhi",
      phone: "+919876543210",
      location: "Delhi",
      trustScore: 85.5,
      isVerified: true,
      verificationMethod: "PHONE_OTP",
      upiVerified: true,
      upiId: "rajchaicorner@upi",
      upiVerificationDate: new Date(),
      transactionCount: 150,
      ownerId: user1.id,
    },
  });

  const business2 = await prisma.business.create({
    data: {
      name: "Priya Handmade Crafts",
      description: "Beautiful handmade jewelry and crafts",
      category: "ARTISAN",
      address: "Local Market, Bangalore",
      phone: "+919876543211",
      location: "Bangalore",
      trustScore: 92.0,
      isVerified: true,
      verificationMethod: "COMMUNITY_ENDORSEMENT",
      upiVerified: false,
      transactionCount: 75,
      ownerId: user2.id,
    },
  });

  console.log(`Created businesses: ${business1.name}, ${business2.name}`);

  // Create sample reviews
  const review1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: "Amazing chai and great service!",
      isVerified: true,
      businessId: business1.id,
      reviewerId: customer1.id,
    },
  });

  const review2 = await prisma.review.create({
    data: {
      rating: 4,
      comment: "Good quality products, reasonable prices",
      isVerified: true,
      businessId: business2.id,
      reviewerId: customer1.id,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      rating: 5,
      comment: "Love their special masala chai!",
      isVerified: false,
      businessId: business1.id,
      reviewerId: customer2.id,
    },
  });

  console.log(`Created ${[review1, review2, review3].length} reviews`);

  // Create sample endorsements
  const endorsement1 = await prisma.endorsement.create({
    data: {
      relationship: "CUSTOMER",
      message: "Regular customer for 2 years, always satisfied",
      businessId: business1.id,
      endorserId: customer1.id,
    },
  });

  const endorsement2 = await prisma.endorsement.create({
    data: {
      relationship: "NEIGHBOR",
      message: "Known this business for 5 years, very reliable",
      businessId: business1.id,
      endorserId: customer2.id,
    },
  });

  const endorsement3 = await prisma.endorsement.create({
    data: {
      relationship: "CUSTOMER",
      message: "Beautiful handmade products, authentic craftsmanship",
      businessId: business2.id,
      endorserId: customer2.id,
    },
  });

  console.log(`Created ${[endorsement1, endorsement2, endorsement3].length} endorsements`);

  // Create analytics
  const analytics1 = await prisma.businessAnalytics.create({
    data: {
      totalReviews: 2,
      averageRating: 4.5,
      totalEndorsements: 2,
      monthlyVisits: 45,
      upiTransactionVolume: 12500.5,
      customerRetentionRate: 0.75,
      businessId: business1.id,
    },
  });

  const analytics2 = await prisma.businessAnalytics.create({
    data: {
      totalReviews: 1,
      averageRating: 4.0,
      totalEndorsements: 1,
      monthlyVisits: 30,
      upiTransactionVolume: 8500.0,
      customerRetentionRate: 0.65,
      businessId: business2.id,
    },
  });

  console.log(`Created analytics for ${business1.name} and ${business2.name}`);

  // Create sample UPI transactions
  const upiTransaction1 = await prisma.uPI_Transaction.create({
    data: {
      upiId: "customer1@upi",
      amount: 250.75,
      timestamp: new Date("2024-01-15T10:30:00Z"),
      transactionType: "PURCHASE",
      customerPattern: "RETURNING",
      businessId: business1.id,
    },
  });

  const upiTransaction2 = await prisma.uPI_Transaction.create({
    data: {
      upiId: "customer2@upi",
      amount: 120.5,
      timestamp: new Date("2024-01-16T14:45:00Z"),
      transactionType: "PURCHASE",
      customerPattern: "NEW",
      businessId: business1.id,
    },
  });

  const upiTransaction3 = await prisma.uPI_Transaction.create({
    data: {
      upiId: "customer3@upi",
      amount: 450.0,
      timestamp: new Date("2024-01-17T16:20:00Z"),
      transactionType: "SERVICE",
      customerPattern: "RETURNING",
      businessId: business2.id,
    },
  });

  console.log(`Created ${[upiTransaction1, upiTransaction2, upiTransaction3].length} UPI transactions`);

  console.log("Seeding finished successfully!");
  console.log("Summary:");
  console.log(`- Users: 4 (2 business owners, 2 customers)`);
  console.log(`- Businesses: 2`);
  console.log(`- Reviews: 3`);
  console.log(`- Endorsements: 3`);
  console.log(`- Analytics: 2`);
  console.log(`- UPI Transactions: 3`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });