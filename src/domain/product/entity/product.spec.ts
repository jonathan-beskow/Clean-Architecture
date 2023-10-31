import Product from "./product";

describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            const product = new Product("", "Product 1", 100);

        }).toThrowError("product: Id is required");
    });

    it("should throw error when name is empty", () => {

        expect(() => {
            const product = new Product("1", "", 100);

        }).toThrowError("product: Name is required");
    });

    it("should throw error when id and name is empty", () => {

        expect(() => {
            const product = new Product("", "", 100);

        }).toThrowError("product: Id is required,product: Name is required");
    });

    it("should throw error when price is less than zero", () => {

        expect(() => {
            const product = new Product("2", "Name", -1);

        }).toThrowError("product: Price must be greater than zero");
    });

    it("should change name", () => {
        const product = new Product("2", "P1", 100);
        product.changeName("P2");
        expect(product.name).toBe("P2");
    });

    it("should change price", () => {
        const product = new Product("2", "P1", 100);
        product.changePrice(234);
        expect(product.price).toBe(234);
    });
});