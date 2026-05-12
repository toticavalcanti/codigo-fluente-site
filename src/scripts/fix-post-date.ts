import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';

async function main() {
  await dbConnect();
  const db = mongoose.connection.db!;
  const now = new Date();
  const result = await db.collection('posts').updateOne(
    { slug: 'aula-15-k8s-seguranca-melhores-praticas-e-implementacoes' },
    { $set: { date: now, published_at: now } }
  );
  console.log(`Updated: ${result.modifiedCount}`);
}
main().catch(console.error).finally(() => process.exit());
