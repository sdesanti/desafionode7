const request = require("supertest");
const server = require("../index.js");

describe("Operaciones CRUD de cafes", () => {
  it("GET /cafes retorna 200 y arreglo con al menos un objeto", async () => {
    const { body, status } = await request(server).get("/cafes");
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBeGreaterThan(0);
  });

  it("DELETE /cafes/:id devuelve status code 404 si el id no existe", async () => {
    const fakeId = 999;
    const response = await request(server).delete(`/cafes/${fakeId}`).set("Authorization", "Bearer token");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "No se encontró ningún cafe con ese id");
  });

  it("POST /cafes agrega nuevo cafe y devuelve status code 201", async () => {
    const newCafe = { id: 5, nombre: "Latte" };
    const response = await request(server).post("/cafes").send(newCafe);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: newCafe.id, nombre: newCafe.nombre }),
      ])
    );
  });

  it("PUT /cafes/:id devuelve status code 400", async () => {
    const payload = { id: 5, nombre: "Espresso" };
    const response = await request(server).put("/cafes/3").send(payload);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "El id del parámetro no coincide con el id del café recibido"
    );
  });
});
