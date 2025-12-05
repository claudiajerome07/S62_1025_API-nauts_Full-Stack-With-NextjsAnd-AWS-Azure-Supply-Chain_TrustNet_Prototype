import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 12);
  const businessPassword = await bcrypt.hash("business123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  // 1. CREATE ADMIN USER (THIS IS MISSING IN YOUR SEED)
  const adminUser = await prisma.user.upsert({
    where: { phone: "+1234567890" },
    update: {},
    create: {
      phone: "+1234567890",
      name: "Admin User",
      password: adminPassword,
      email: "admin@trustnet.com",
      role: UserRole.ADMIN,
    },
  });

  // Create sample users WITH PASSWORDS
  const user1 = await prisma.user.upsert({
    where: { phone: "+919876543210" },
    update: {},
    create: {
      phone: "+919876543210",
      name: "Raj Sharma",
      password: businessPassword,
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
      password: businessPassword,
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
      password: customerPassword,
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
      password: customerPassword,
      email: "neha@example.com",
      role: "CUSTOMER",
    },
  });

  console.log(`
  Created users:
  1. ADMIN: ${adminUser.name} (Phone: ${adminUser.phone}, Password: admin123)
  2. Business Owner: ${user1.name} (Phone: ${user1.phone}, Password: business123)
  3. Business Owner: ${user2.name} (Phone: ${user2.phone}, Password: business123)
  4. Customer: ${customer1.name} (Phone: ${customer1.phone}, Password: customer123)
  5. Customer: ${customer2.name} (Phone: ${customer2.phone}, Password: customer123)
  `);

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

  console.log(
    `Created ${[endorsement1, endorsement2, endorsement3].length} endorsements`
  );

  // Create analytics - remove unused variable declarations
  await prisma.businessAnalytics.create({
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

  await prisma.businessAnalytics.create({
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

  // Create sample UPI transactions - remove unused variable declarations
  await prisma.uPI_Transaction.create({
    data: {
      upiId: "customer1@upi",
      amount: 250.75,
      timestamp: new Date("2024-01-15T10:30:00Z"),
      transactionType: "PURCHASE",
      customerPattern: "RETURNING",
      businessId: business1.id,
    },
  });

  await prisma.uPI_Transaction.create({
    data: {
      upiId: "customer2@upi",
      amount: 120.5,
      timestamp: new Date("2024-01-16T14:45:00Z"),
      transactionType: "PURCHASE",
      customerPattern: "NEW",
      businessId: business1.id,
    },
  });

  await prisma.uPI_Transaction.create({
    data: {
      upiId: "customer3@upi",
      amount: 450.0,
      timestamp: new Date("2024-01-17T16:20:00Z"),
      transactionType: "SERVICE",
      customerPattern: "RETURNING",
      businessId: business2.id,
    },
  });

  console.log(`Created 3 UPI transactions`);

  console.log(`
  ===========================================
  🎉 SEEDING FINISHED SUCCESSFULLY!
  ===========================================
  
  📋 TEST CREDENTIALS:
  
  1. ADMIN USER:
     Phone: +1234567890
     Password: admin123
     Role: ADMIN
     Email: admin@trustnet.com
  
  2. BUSINESS OWNER 1:
     Phone: +919876543210
     Password: business123
     Name: Raj Sharma
  
  3. BUSINESS OWNER 2:
     Phone: +919876543211
     Password: business123
     Name: Priya Patel
  
  4. CUSTOMER 1:
     Phone: +919876543212
     Password: customer123
     Name: Amit Kumar
  
  5. CUSTOMER 2:
     Phone: +919876543213
     Password: customer123
     Name: Neha Singh
  
  ===========================================
  Summary:
  - Users: 5 (1 admin, 2 business owners, 2 customers)
  - Businesses: 2
  - Reviews: 3
  - Endorsements: 3
  - Analytics: 2
  - UPI Transactions: 3
  ===========================================
  `);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
