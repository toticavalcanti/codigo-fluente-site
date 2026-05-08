import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
    const { default: dbConnect } = await import("@/lib/mongodb");
    const { Post } = await import("@/models/Post");

    await dbConnect();

    const posts = await Post.find({
        slug: { $regex: "^aula-", $options: "i" }
    })
        .select("title slug content excerpt")
        .lean();

    const shortPosts = posts
        .map((post) => ({
            title: post.title,
            slug: post.slug,
            contentLength: post.content?.length || 0,
            excerptLength: post.excerpt?.length || 0,
        }))
        .filter((post) => post.contentLength < 1000)
        .sort((a, b) => a.contentLength - b.contentLength);

    console.log("Aulas com conteúdo menor que 1000 caracteres:", shortPosts.length);

    for (const post of shortPosts) {
        console.log("-----");
        console.log("title:", post.title);
        console.log("slug:", post.slug);
        console.log("content length:", post.contentLength);
        console.log("excerpt length:", post.excerptLength);
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });