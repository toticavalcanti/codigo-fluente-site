import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';

async function main() {
  await dbConnect();
  const db = mongoose.connection.db!;
  const result = await db.collection('posts').updateMany(
    { status: 'publish' },
    { $set: { status: 'published' } }
  );
  console.log(`✅ ${result.modifiedCount} posts → published`);
}
main().catch(console.error).finally(() => process.exit());
