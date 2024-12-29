import { defineAction } from "astro:actions";
import { count, db, eq, Product, ProductImage, sql } from "astro:db";
import { z } from "astro:schema";
import type { ProductWithImages } from "@/interfaces";



export const getProductBySlug = defineAction({
    accept: "json",
    input: z.string(),
    handler: async (slug) => {

        const [product] = await db.select().from(Product).where(eq(Product.slug, slug));

        if (!product) {
            throw new Error(`Product not found with ${slug}`);
        }


        const images = await db.select().from(ProductImage).where(eq(ProductImage.productId, product.id));



        return {
            product: {
                ...product,
                images: images.map(i => i.image)
            },
            message: "Product found",
            status: 200
        }

    }
});