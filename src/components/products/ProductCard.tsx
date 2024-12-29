import { useState } from "react";
import type { ProductWithImages } from "@/interfaces"



interface Props {
    product: ProductWithImages
}



export const ProductCard = ({ product }: Props) => {


    const productImages = product.images.split(",").map(img => img.startsWith('http') ? img : `${import.meta.env.PUBLIC_URL}/images/products/${img}`);


    const [currentImage, setCurrentImage] = useState(productImages[0]);


    return (
        <a href={`/products/${product.slug}`} >
            <div className="border border-neutral-100 bg-neutral-50 rounded-xl flex flex-col justify-center p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">

                    <picture>
                        <img src={currentImage} alt={product.title} className="h-[300px] object-contain rounded-md" onMouseEnter={() => setCurrentImage(productImages[1])} onMouseLeave={() => setCurrentImage(productImages[0])} />
                    </picture>

                    <div className="flex flex-col h-full justify-start">
                        <h4 className="font-bold">{product.title}</h4>
                        <p>${product.price}</p>
                    </div>

                </div>
            </div>
        </a>
    )
}