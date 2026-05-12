
import dbConnect from "../lib/mongodb";
import { Post } from "../models/Post";

async function checkFields() {
    await dbConnect();
    const post = await Post.findOne({}).lean();
    console.log("Fields in Post:", Object.keys(post));
    process.exit(0);
}

checkFields();
