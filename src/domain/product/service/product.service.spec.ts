import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product servber unit tests", () => {

    it("Shoud change the prices of all products", () => {
        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("321", "Product 2", 20);

        ProductService.increasePrice([product1,product2], 100);

        expect(product1.price).toBe(20);
        expect(product2.price).toBe(40);
    });
});