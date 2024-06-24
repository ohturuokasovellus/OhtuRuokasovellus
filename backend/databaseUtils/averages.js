const { sql } = require('../database');

/** Get average CO2 emissions per meal of all user purchases. */
const getAvgCo2Emissions = async () => {
    const result = await sql`
    SELECT AVG(m.co2_emissions) as avg_co2_emissions
    FROM meals m
    JOIN purchases p ON m.meal_id = p.meal_id
    JOIN users u ON p.user_id = u.user_id;
    `;
    return result.at(0).avg_co2_emissions ?? 0;
};

/** Get average CO2 emissions per meal purchased by a single user */
const getAvgCo2EmissionsByUser = async (userId) => {
    const result = await sql`
    SELECT AVG(m.co2_emissions) as avg_co2_emissions
    FROM meals m
    JOIN purchases p ON m.meal_id = p.meal_id
    JOIN users u ON p.user_id = u.user_id
    WHERE u.user_id = ${userId}
    `;
    return result.at(0).avg_co2_emissions ?? 0;
};

/** Get average CO2 emissions per meal purchased by selected gender.
 * @param {string} gender
*/
const getAvgCo2EmissionsByGender = async (gender) => {
    const result = await sql`
    SELECT AVG(m.co2_emissions) AS avg_co2_emissions
    FROM meals m
    JOIN purchases p ON m.meal_id = p.meal_id
    JOIN users u ON p.user_id = u.user_id
    WHERE pgp_sym_decrypt(u.gender::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${gender}
    `;
    return result.at(0).avg_co2_emissions ?? 0;
};

/** Get average CO2 emissions per meal purchased by selected age group.
 * @param {array} ageGroup [startYear, endYear]
*/
const getAvgCo2EmissionsByAgeGroup = async (ageGroup) => {
    const result = await sql`
      SELECT AVG(m.co2_emissions) AS avg_co2_emissions
      FROM meals m
      JOIN purchases p ON m.meal_id = p.meal_id
      JOIN users u ON p.user_id = u.user_id
      WHERE
      pgp_sym_decrypt(u.birth_year::bytea,
      ${process.env.DATABASE_ENCRYPTION_KEY})::int
      BETWEEN ${ageGroup[0]} AND ${ageGroup[1]}
    `;
    return result.at(0).avg_co2_emissions ?? 0;
};

/** Get average macronutrients per meal of all user purchases. */
const getAvgMacronutrients= async () => {
    const result = await sql`
      SELECT AVG(m.carbohydrates) AS avg_carbohydrates,
             AVG(m.fat) AS avg_fat,
             AVG(m.protein) AS avg_protein
      FROM meals m
      JOIN purchases p ON m.meal_id = p.meal_id
      JOIN users u ON p.user_id = u.user_id
    `;

    return {
        avgCarbohydrates: result.at(0).avg_carbohydrates ?? 0,
        avgFat: result.at(0).avg_fat ?? 0,
        avgProtein: result.at(0).avg_protein ?? 0
    };
};

/** Get average macronutrients per meal purchased by a single user */
const getAvgMacronutrientsByUser = async (userId) => {
    const result = await sql`
      SELECT AVG(m.carbohydrates) AS avg_carbohydrates,
             AVG(m.fat) AS avg_fat,
             AVG(m.protein) AS avg_protein
      FROM meals m
      JOIN purchases p ON m.meal_id = p.meal_id
      JOIN users u ON p.user_id = u.user_id
      WHERE u.user_id = ${userId}
    `;

    return {
        avgCarbohydrates: result.at(0).avg_carbohydrates ?? 0,
        avgFat: result.at(0).avg_fat ?? 0,
        avgProtein: result.at(0).avg_protein ?? 0
    };
};

/** Get average macronutrients per meal purchased by selected gender.
 * @param {string} gender
*/
const getAvgMacronutrientsByGender = async (gender) => {
    const result = await sql`
      SELECT AVG(m.carbohydrates) AS avg_carbohydrates,
             AVG(m.fat) AS avg_fat,
             AVG(m.protein) AS avg_protein
      FROM meals m
      JOIN purchases p ON m.meal_id = p.meal_id
      JOIN users u ON p.user_id = u.user_id
      WHERE pgp_sym_decrypt(u.gender::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${gender}
    `;

    return {
        avgCarbohydrates: result.at(0).avg_carbohydrates ?? 0,
        avgFat: result.at(0).avg_fat ?? 0,
        avgProtein: result.at(0).avg_protein ?? 0
    };
};
/** Get average macronutrients per meal purchased by selected age group.
 * @param {array} ageGroup [startYear, endYear]
*/
const getAvgMacronutrientsByAgeGroup = async (ageGroup) => {
    const result = await sql`
      SELECT AVG(m.carbohydrates) AS avg_carbohydrates,
             AVG(m.fat) AS avg_fat,
             AVG(m.protein) AS avg_protein
      FROM meals m
      JOIN purchases p ON m.meal_id = p.meal_id
      JOIN users u ON p.user_id = u.user_id
      WHERE
      pgp_sym_decrypt(u.birth_year::bytea,
      ${process.env.DATABASE_ENCRYPTION_KEY})::int
      BETWEEN ${ageGroup[0]} AND ${ageGroup[1]}
    `;

    return {
        avgCarbohydrates: result.at(0).avg_carbohydrates ?? 0,
        avgFat: result.at(0).avg_fat ?? 0,
        avgProtein: result.at(0).avg_protein ?? 0
    };
};

module.exports = {
    getAvgCo2Emissions,
    getAvgCo2EmissionsByUser,
    getAvgCo2EmissionsByGender,
    getAvgCo2EmissionsByAgeGroup,
    getAvgMacronutrients,
    getAvgMacronutrientsByUser,
    getAvgMacronutrientsByGender,
    getAvgMacronutrientsByAgeGroup
};
