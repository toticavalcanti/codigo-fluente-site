import dbConnect from '../lib/mongodb';
import { Category } from '../models/Category';

async function check() {
  await dbConnect();
  const cat = await Category.findOne({ slug: 'programacao-web' }).lean();
  console.log('Category:', JSON.stringify(cat, null, 2));
  process.exit();
}

check();
