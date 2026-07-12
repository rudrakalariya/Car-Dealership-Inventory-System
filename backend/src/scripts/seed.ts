import { query } from '../config/db';

async function seed() {
  console.log('Starting seed...');

  // Ensure image_url column exists
  await query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_url TEXT;`);

  // Clear existing vehicles
  await query(`TRUNCATE TABLE vehicles RESTART IDENTITY CASCADE;`);

  const vehicles = [
    {
      make: 'Porsche',
      model: '911 GT3 RS',
      category: 'Coupe',
      description: '518 hp • 3.0s 0-100 km/h • Track focused performance',
      price: 241300,
      quantity: 2,
      image_url:
        'https://images.unsplash.com/photo-1712095315056-beba206d0bcb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      make: 'Audi',
      model: 'R8 V10 Performance',
      category: 'Coupe',
      description: '602 hp • 3.2s 0-100 km/h • V10 naturally aspirated',
      price: 158600,
      quantity: 3,
      image_url:
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      make: 'Mercedes-Benz',
      model: 'G-Class G63 AMG',
      category: 'SUV',
      description: '577 hp • 4.5s 0-100 km/h • Off-road luxury icon',
      price: 179000,
      quantity: 4,
      image_url:
        'https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      make: 'BMW',
      model: 'M5 Competition',
      category: 'Sedan',
      description: '617 hp • 3.1s 0-100 km/h • Ultimate driving machine',
      price: 135800,
      quantity: 6,
      image_url:
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      make: 'Tesla',
      model: 'Model S Plaid',
      category: 'Sedan',
      description: '1020 hp • 2.1s 0-100 km/h • 637 km range',
      price: 89990,
      quantity: 5,
      image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80'
    }
  ];

  for (const v of vehicles) {
    await query(
      `INSERT INTO vehicles (make, model, category, description, price, quantity, image_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [v.make, v.model, v.category, v.description, v.price, v.quantity, v.image_url]
    );
  }

  console.log('Seeded database successfully with ' + vehicles.length + ' vehicles.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed:', err);
  process.exit(1);
});
