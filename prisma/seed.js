import fs from "fs";
import { resolve, join } from "path";
import { parse } from "csv-parse";
import prisma from "../src/config/prisma.js";
import pkg from "@prisma/client";
// eslint-disable-next-line no-unused-vars
const { Food } = pkg;

const path = join(resolve(), "prisma/recipes.csv");

const stream = fs
  .createReadStream(path)
  .pipe(parse({ delimiter: ",", fromLine: 2 }));

/**
 * @type {Prisma.FoodCreateInput & {id:number}[]}
 */
const rows = [];


stream.on("data", async (r) => {
  rows.push({
    id: Number(r[0]),
    name: r[1],
    cookTime: r[2],
    prepTime: r[3],
    totalTime: r[4],
    ingredients: r[5],
    calories: Number(r[6]),
    fat: Number(r[7]),
    saturatedFat: Number(r[8]),
    cholesterol: Number(r[9]),
    sodium: Number(r[10]),
    carbohydrate: Number(r[11]),
    fiber: Number(r[12]),
    sugar: Number(r[13]),
    protein: Number(r[14]),
    instructions: r[15],
    imageUrl: r[16],
  });
});

stream.on("end", async () => {
  rows.forEach(async (row) => {
    await prisma.food.upsert({
      create: row,
      update: row,
      where: {
        id: row.id,
      },
    });
  });
});

stream.on("error", (e) => {
  console.log(e);
});
