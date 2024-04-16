import mongoose from "mongoose";
import { Food } from "../../schema/real/Food.js";
import { faker } from '@faker-js/faker';

const createDemoData = async (count) => {
  const foods = [];

  for (let i = 0; i < count; i++) {
    const food = new Food({
      user_id: faker.string.uuid(),
      food_startDt: faker.date.recent().toISOString().split("T")[0],
      food_endDt: faker.date.recent().toISOString().split("T")[0],
      food_total_kcal: faker.number.int(),
      food_total_carb: faker.number.int(),
      food_total_protein: faker.number.int(),
      food_total_fat: faker.number.int(),
      food_section: [{
        food_part_val: faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz", 5),
        food_title_val: faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz", 5),
        food_brand : faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz", 5),
        food_count : faker.number.int(),
        food_serv : faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz", 5),
        food_gram : faker.number.int(),
        food_kcal : faker.number.int(),
        food_carb : faker.number.int(),
        food_protein : faker.number.int(),
        food_fat : faker.number.int(),
      }],
      food_regdate: faker.date.recent().toISOString().split("T")[0],
      food_update: faker.date.recent().toISOString().split("T")[0],
    });
    foods.push(food);
  };

  await Food.insertMany(foods);
  console.log(JSON.stringify(foods, null, 2));
};

createDemoData(10)
.then(() => {
  console.log("Data inserted successfully!");
  mongoose.disconnect();
})
.catch((error) => {
  console.error("Error inserting data: ", error);
  mongoose.disconnect();
});
