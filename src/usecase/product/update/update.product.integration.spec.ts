import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUsecase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUsecase(productRepository);

    const productInterface = ProductFactory.create("a", "product init", 100);

    await productRepository.create(productInterface);

    const input = {
      id: productInterface.id,
      name: "product update",
      price: 199,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual({
        id: input.id,
        name: input.name,
        price: input.price,
    });
  });
});
