import { getProducts } from '../lib/woocommerce/products-direct';

async function main() {
    try {
        const res = await getProducts({ per_page: 1 });
        console.log('TOTAL_PRODUCTS_COUNT:', res.total);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
