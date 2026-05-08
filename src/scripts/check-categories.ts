// src/scripts/check-categories.ts
import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';

interface Category {
    _id: mongoose.Types.ObjectId;
    slug: string;
    name: string;
    parent_id?: mongoose.Types.ObjectId;
}

interface Post {
    _id: mongoose.Types.ObjectId;
    slug: string;
    category_ids: mongoose.Types.ObjectId[];
}

async function main() {
    await dbConnect();
    const db = mongoose.connection.db!;

    const categories = await db.collection('categories').find({}).toArray() as Category[];
    console.log(`\nTotal categorias: ${categories.length}\n`);

    for (const cat of categories) {
        const count = await db.collection('posts').countDocuments({
            category_ids: cat._id
        });
        console.log(`[${String(count).padStart(3)} posts] ${cat.slug}`);
    }

    // Diagnóstico de um post
    const post = await db.collection('posts').findOne({}) as Post | null;
    if (post?.category_ids) {
        const cats = await db.collection('categories')
            .find({ _id: { $in: post.category_ids } })
            .toArray() as Category[];
        console.log('\n── Post exemplo ──');
        console.log('slug:', post.slug);
        console.log('categorias:', cats.map(c => c.slug));
    }

    // Hierarquia
    console.log('\n── Hierarquia ──');
    for (const cat of categories) {
        if (cat.parent_id) {
            const parent = categories.find(c =>
                c._id.toString() === cat.parent_id?.toString()
            );
            console.log(`${parent?.slug ?? '?'} → ${cat.slug}`);
        }
    }
}

main().catch(console.error).finally(() => process.exit());