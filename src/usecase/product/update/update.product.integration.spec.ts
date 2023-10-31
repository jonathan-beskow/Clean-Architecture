import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test create product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async() => {

        const productRepository = new ProductRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "product1", 100);
        await productRepository.create(product);

        const input = {
            id: product.id,
            name: "Product Updated",
            price: 200
        }

        const output = await useCase.execute(input);

        expect(output).toEqual(input)

    })
})