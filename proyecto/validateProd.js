export async function validateProd(maybeProd, arrayProducts) {
    if (!maybeProd.title || !maybeProd.description || !maybeProd.price || !maybeProd.stock || !maybeProd.code) {
        return false;
    } else {
        const searchCode = arrayProducts.find((prod) => prod.code === maybeProd.code);
        if(searchCode){
            return false;
        } else {
            return true;
        }
    }
}