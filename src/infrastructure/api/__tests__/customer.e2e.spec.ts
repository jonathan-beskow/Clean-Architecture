import { app, sequelize } from '../express'
import request from "supertest";

describe("E2E test for customer", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    })

    afterAll(async () => {
        await sequelize.close();
    });

    it("Should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345",
                }
            })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John");
        expect(response.body.address.street).toBe("Street");
    })

    it("should note create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
            })
        expect(response.status).toBe(500);
    })

    it("should list all customers", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345",
                }
            })
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Jane",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345",
                }
            })
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);
        const customer = listResponse.body.customers[0];
        expect(customer.name).toBe("John");
        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Jane");

        const listResponseXML = await request(app).get("/customer").set("Accept", "application/xml")
        .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    })
})