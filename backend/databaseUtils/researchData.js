const { sql } = require('../database');

/**
 * Fetch all meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      restaurant_id: number, 
*      co2_emissions: string
*  }[]>}
*/
const getResearchData = async () => {
    const thisYear = new Date().getFullYear();
    const researchData = await sql`
        SELECT 
            meals.meal_id,
            meals.name,
            meals.price AS price_in_cents,
            COUNT(purchases.meal_id) AS purchases_from_all,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int) 
                BETWEEN 15 AND 18
                THEN purchases.user_id END) AS purchases_from_15_18,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int) 
                BETWEEN 19 AND 25
                THEN purchases.user_id END) AS purchases_from_19_25,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 26 AND 35
                THEN purchases.user_id END) AS purchases_from_26_35,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 36 AND 45
                THEN purchases.user_id END) AS purchases_from_36_45,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 46 AND 55
                THEN purchases.user_id END) AS purchases_from_46_55,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 56 AND 65
                THEN purchases.user_id END) AS purchases_from_56_65,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int) > 65
                THEN purchases.user_id END) AS purchases_from_over_65,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.gender::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'man' 
                THEN purchases.user_id END) AS purchases_from_man,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.gender::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'woman' 
                THEN purchases.user_id END) AS purchases_from_woman,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.gender::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'other' 
                THEN purchases.user_id END) AS purchases_from_other,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'primary'
                THEN purchases.user_id END) AS purchases_from_education_primary,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'secondary'
                THEN purchases.user_id END) 
                AS purchases_from_education_secondary,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) 
                    = 'vocational specialised'
                THEN purchases.user_id END) 
                AS purchases_from_education_vocational_specialised,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'lowest tertiary'
                THEN purchases.user_id END) 
                AS purchases_from_education_lowest_tertiary,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'bachelors'
                THEN purchases.user_id END) 
                AS purchases_from_education_bachelors,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'masters'
                THEN purchases.user_id END) AS purchases_from_education_masters,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'doctoral'
                THEN purchases.user_id END) 
                AS purchases_from_education_doctoral,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'below 1500'
                THEN purchases.user_id END) AS purchases_from_below_1500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '1500-2500'
                THEN purchases.user_id END) AS purchases_from_1500_2500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '2500-3500'
                THEN purchases.user_id END) AS purchases_from_2500_3500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '3500-4500'
                THEN purchases.user_id END) AS purchases_from_3500_4500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '4500-5500'
                THEN purchases.user_id END) AS purchases_from_4500_5500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'over 5500'
                THEN purchases.user_id END) AS purchases_from_over_5500,
            COUNT(CASE 
                WHEN evaluations.eval_key = 1 
                AND evaluations.eval_value = 1
                THEN evaluations.user_id END) 
                AS purchases_from_climate_importance_1,
            COUNT(CASE 
                WHEN evaluations.eval_key = 1 
                AND evaluations.eval_value = 2
                THEN evaluations.user_id END) 
                AS purchases_from_climate_importance_2,
            COUNT(CASE 
                WHEN evaluations.eval_key = 1 
                AND evaluations.eval_value = 3
                THEN evaluations.user_id END) 
                AS purchases_from_climate_importance_3,
            COUNT(CASE 
                WHEN evaluations.eval_key = 1 
                AND evaluations.eval_value = 4
                THEN evaluations.user_id END) 
                AS purchases_from_climate_importance_4,
            COUNT(CASE 
                WHEN evaluations.eval_key = 1 
                AND evaluations.eval_value = 5
                THEN evaluations.user_id END) 
                AS purchases_from_climate_importance_5,
            COUNT(CASE 
                WHEN evaluations.eval_key = 2 
                AND evaluations.eval_value = 1
                THEN evaluations.user_id END) 
                AS purchases_from_nutritional_importance_1,
            COUNT(CASE 
                WHEN evaluations.eval_key = 2 
                AND evaluations.eval_value = 2
                THEN evaluations.user_id END) 
                AS purchases_from_nutritiona_importancel_2,
            COUNT(CASE 
                WHEN evaluations.eval_key = 2 
                AND evaluations.eval_value = 3
                THEN evaluations.user_id END) 
                AS purchases_from_nutritional_importance_3,
            COUNT(CASE 
                WHEN evaluations.eval_key = 2 
                AND evaluations.eval_value = 4
                THEN evaluations.user_id END) 
                AS purchases_from_nutritional_importance_4,
            COUNT(CASE 
                WHEN evaluations.eval_key = 2 
                AND evaluations.eval_value = 5
                THEN evaluations.user_id END) 
                AS purchases_from_nutritional_importance_5
        FROM 
            meals
        LEFT JOIN 
            purchases
        ON 
            meals.meal_id = purchases.meal_id
        LEFT JOIN 
            users
        ON 
            purchases.user_id = users.user_id
        LEFT JOIN 
            evaluations
        ON 
            users.user_id = evaluations.user_id
        GROUP BY 
            meals.meal_id;
    `;

    return researchData;
};

module.exports = {
    getResearchData
};