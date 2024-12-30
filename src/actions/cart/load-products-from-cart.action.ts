import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";


export const loadProductsFromCart = defineAction({
    accept: "json",
    // input: z.string(),
    handler: async (_, { cookies }) => {


        const cart = JSON.parse(cookies.get("cart")?.value ?? '[]') as CartItem[];




        return;
    }
});