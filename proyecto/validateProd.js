const productKey = ['title', 'description', 'price', 'stock', 'code', 'thumbnail'];

export async function validateProd(maybeProd, arrayProducts) {
    if (!maybeProd.title || !maybeProd.description || !maybeProd.price || !maybeProd.stock || !maybeProd.code) {
        console.error('Error! Product information incomplete.');
        return;
    } else {
        const searchCode = arrayProducts.find((prod) => prod.code === maybeProd.code);
        if (searchCode) {
            console.error('Error! Repeated code.');
            return;
        } else {
            return true;
        }
    }
}

export function validatePartialProd(maybyPartialProd) {
    const maybeKeysProd = Object.keys(maybyPartialProd);
    return (
        maybeKeysProd.length <= productKey.length &&
        maybeKeysProd.every((key) => productKey.includes(key))
    );
}  