import Product from "../../../domain/product/entity/product";
import UpdateProductUsecase from "./update.product.usecase";

const product = new Product("id", "product A", 10);

const input = {
  id: product.id,
  name: "product Updated",
  price: 15,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Unit test for customer update use case", () => {
  it("should update a customer", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUsecase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
