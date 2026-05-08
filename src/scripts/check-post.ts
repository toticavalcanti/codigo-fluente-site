import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
    const { default: dbConnect } = await import("@/lib/mongodb");
    const { Post } = await import("@/models/Post");

    await dbConnect();

    const slug = "aula-20-python-biblioteca-padrao-modulo-io";

    const post = await Post.findOne({ slug }).lean();

    if (!post) {
        console.log("POST NÃO ENCONTRADO:", slug);
        process.exit(0);
    }

    console.log("POST ENCONTRADO");
    console.log("title:", post.title);
    console.log("slug:", post.slug);
    console.log("excerpt length:", post.excerpt?.length || 0);
    console.log("content length:", post.content?.length || 0);
    console.log("content preview:");
    console.log((post.content || "").slice(0, 1000));
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });