/**
 * Database Seed Script
 * Populates the database with 1 demo user and 12 curated community events
 * (mix of upcoming and past events across various categories)
 */
const bcrypt = require('bcryptjs');
const { db, initializeDatabase } = require('../config/db');

async function seed(exitOnComplete = true) {
  console.log('🌱 Starting database seeding process...');
  try {
    await initializeDatabase();

    // Clear existing data (in reverse order of foreign keys)
    await db.run('DELETE FROM bookings');
    await db.run('DELETE FROM events');
    await db.run('DELETE FROM users');
    
    // Reset autoincrement counters if sqlite_sequence exists
    try {
      await db.run('DELETE FROM sqlite_sequence WHERE name IN ("users", "events", "bookings")');
    } catch (e) {
      // Ignore if table doesn't exist yet
    }

    console.log('🧹 Cleared existing database tables.');

    // 1. Seed Demo User
    const demoPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(demoPassword, salt);

    const userResult = await db.run(
      `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
      ['Alex Johnson', 'demo@community.com', passwordHash]
    );
    const demoUserId = userResult.lastID;
    console.log(`👤 Created Demo User (ID: ${demoUserId}): demo@community.com / ${demoPassword}`);

    // Helper to calculate future/past dates relative to current date
    const now = new Date();
    const getDate = (daysOffset, hour = 18, minute = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() + daysOffset);
      d.setHours(hour, minute, 0, 0);
      return d.toISOString().replace('T', ' ').substring(0, 19);
    };

    // 2. Seed 12 Realistic Sample Events
    const sampleEvents = [
      {
        title: 'Community Web3 & AI Developer Summit 2026',
        description: 'Join industry pioneers, open-source contributors, and local builders for an intensive day of tech talks, live demonstrations, hands-on workshops, and networking.',
        category: 'Technology',
        location: 'Innovation Hub Auditorium, 400 Tech Plaza',
        event_date: getDate(5, 9, 30), // Upcoming in 5 days
        price: 25.00,
        total_seats: 120,
        available_seats: 84,
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Sunset Acoustic Jazz & Indie Music Night',
        description: 'An intimate evening featuring stellar local acoustic ensembles, jazz trios, and indie vocalists under the stars with artisan refreshments.',
        category: 'Music',
        location: 'Riverside Amphitheater, Pier 14',
        event_date: getDate(12, 19, 0), // Upcoming in 12 days
        price: 15.50,
        total_seats: 80,
        available_seats: 42,
        image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Artisan Sourdough & French Pastry Masterclass',
        description: 'Learn authentic European baking fundamentals, starter maintenance, dough shaping, and lamination techniques from award-winning pastry chefs.',
        category: 'Food & Drink',
        location: 'Culinary Arts Studio, 88 Baker Street',
        event_date: getDate(18, 11, 0), // Upcoming in 18 days
        price: 45.00,
        total_seats: 25,
        available_seats: 8,
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Morning Yoga, Sound Bath & Mindful Meditation',
        description: 'Recharge body and soul with certified instructors guiding a gentle vinyasa flow followed by Tibetan singing bowl sound therapy.',
        category: 'Wellness & Fitness',
        location: 'Emerald Park Pavilion, West Meadow',
        event_date: getDate(3, 7, 30), // Upcoming in 3 days
        price: 10.00,
        total_seats: 50,
        available_seats: 19,
        image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Neighborhood Tree Planting & Green City Drive',
        description: 'Make a lasting positive impact on our local urban ecosystem. All equipment, gloves, saplings, and lunch provided for volunteers.',
        category: 'Community & Charity',
        location: 'Greenwood Botanical Reserve',
        event_date: getDate(8, 9, 0), // Upcoming in 8 days
        price: 0.00,
        total_seats: 100,
        available_seats: 65,
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Startup Founders & Angel Investor Mixer',
        description: 'Pitch your early-stage ideas, discover co-founders, and connect directly with active angel syndicates and venture mentors over drinks.',
        category: 'Business',
        location: 'Nexus Rooftop Lounge, 750 Market Street',
        event_date: getDate(22, 18, 30), // Upcoming in 22 days
        price: 30.00,
        total_seats: 60,
        available_seats: 2,
        image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Modern Ceramic Wheel Throwing & Glazing Workshop',
        description: 'Hands-on pottery workshop suitable for all levels. Create two custom glazed stoneware pieces fired and ready for pickup.',
        category: 'Arts & Crafts',
        location: 'Clay Craft Guild, 12 Art District',
        event_date: getDate(15, 14, 0), // Upcoming in 15 days
        price: 38.00,
        total_seats: 16,
        available_seats: 0, // SOLD OUT TEST CASE
        image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Charity 5K Fun Run & Community Health Fair',
        description: 'Run, jog, or walk for youth sports scholarships. Includes timed bib, commemorative medal, healthy snacks, and family carnival.',
        category: 'Wellness & Fitness',
        location: 'Harbor View Promenade',
        event_date: getDate(30, 8, 0), // Upcoming in 30 days
        price: 20.00,
        total_seats: 200,
        available_seats: 158,
        image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'International Street Food Fiesta & Cultural Carnival',
        description: 'Experience over 30 authentic food stalls from Latin America, Southeast Asia, the Mediterranean, and the Caribbean with live dance troupes.',
        category: 'Food & Drink',
        location: 'Civic Center Plaza',
        event_date: getDate(27, 12, 0), // Upcoming in 27 days
        price: 5.00,
        total_seats: 350,
        available_seats: 290,
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
      },
      // --- Past Events (for testing Past Bookings & date filtering) ---
      {
        title: 'Winter Chamber Music & Candlelight Symphony',
        description: 'A classical evening honoring baroque and romantic concertos performed by the Metropolitan String Quartet by candlelight.',
        category: 'Music',
        location: 'St. Claire Heritage Hall',
        event_date: getDate(-14, 19, 30), // Past event (14 days ago)
        price: 28.00,
        total_seats: 100,
        available_seats: 0,
        image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Full-Stack React & Node.js Architecture Bootcamp',
        description: 'Deep dive into microservices, asynchronous queues, security best practices, and scalable database designs for modern web apps.',
        category: 'Technology',
        location: 'Tech Hub Classroom B',
        event_date: getDate(-30, 10, 0), // Past event (30 days ago)
        price: 50.00,
        total_seats: 40,
        available_seats: 5,
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80'
      },
      {
        title: 'Community Clothes Swap & Sustainable Fashion Forum',
        description: 'Bring clean, pre-loved garments and refresh your wardrobe sustainably while learning circular fashion practices.',
        category: 'Community & Charity',
        location: 'EcoCenter Atrium',
        event_date: getDate(-45, 13, 0), // Past event (45 days ago)
        price: 0.00,
        total_seats: 80,
        available_seats: 22,
        image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80'
      }
    ];

    const insertedEvents = [];
    for (const event of sampleEvents) {
      const res = await db.run(
        `INSERT INTO events (title, description, category, location, event_date, price, total_seats, available_seats, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.category,
          event.location,
          event.event_date,
          event.price,
          event.total_seats,
          event.available_seats,
          event.image_url
        ]
      );
      insertedEvents.push({ id: res.lastID, ...event });
    }
    console.log(` Inserted ${insertedEvents.length} sample events.`);

    // 3. Seed Sample Bookings for Demo User (1 Active, 1 Past)
    // Active Booking (Summit - 2 tickets)
    await db.run(
      `INSERT INTO bookings (user_id, event_id, tickets, total_price, status, booked_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', '-2 days'))`,
      [demoUserId, insertedEvents[0].id, 2, insertedEvents[0].price * 2, 'confirmed']
    );

    // Active Booking (Yoga - 1 ticket)
    await db.run(
      `INSERT INTO bookings (user_id, event_id, tickets, total_price, status, booked_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', '-1 day'))`,
      [demoUserId, insertedEvents[3].id, 1, insertedEvents[3].price * 1, 'confirmed']
    );

    // Past Booking (Winter Chamber Music - 2 tickets)
    await db.run(
      `INSERT INTO bookings (user_id, event_id, tickets, total_price, status, booked_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', '-20 days'))`,
      [demoUserId, insertedEvents[9].id, 2, insertedEvents[9].price * 2, 'confirmed']
    );

    console.log('🎫 Seeded initial active & past bookings for Demo User.');
    console.log('✅ Seeding completed successfully!');
    if (exitOnComplete) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
    throw error;
  }
}

// Execute script if run directly
if (require.main === module) {
  seed();
}

module.exports = seed;
