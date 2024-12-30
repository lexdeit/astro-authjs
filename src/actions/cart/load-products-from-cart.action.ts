import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";


export const loadProductsFromCart = defineAction({
    accept: "json",
    // input: z.string(),
    handler: async (_, ctx) => {

        const { cookies } = ctx;

        const cart = JSON.parse(cookies.get("cart")?.value ?? '[]') as CartItem[];
        if (cart.length === 0) return [];

        const productIds = cart.map(product => product.productId);

        const dbProducts = await db.select().from(Product).innerJoin(ProductImage, eq(Product.id, ProductImage.productId)).where(inArray(Product.id, productIds));

        const items = cart.map(item => {


            const dbProduct = dbProducts.find(p => p.Product.id === item.productId);

            if (!dbProduct) {
                throw new Error(`Product not found with id ${item.productId}`);
            }

            const { title, price, slug } = dbProduct.Product;
            const image = dbProduct.ProductImage.image;

            return {
                productId: item.productId,
                title: title,
                size: item.size,
                quantity: Number(item.quantity),
                image: image.startsWith('http') ? image : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
                price: price,
                slug: slug
            }
        });

        return items;
    }
});