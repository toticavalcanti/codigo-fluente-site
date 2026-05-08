import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';

async function main() {
  await dbConnect();
  const db = mongoose.connection.db!;
  
  const values = await db.collection('posts').aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]).toArray();
  
  console.log('Valores de status no banco:');
  values.forEach(v => console.log(`  ${v._id}: ${v.count} posts`));
}
main().catch(console.error).finally(() => process.exit());
