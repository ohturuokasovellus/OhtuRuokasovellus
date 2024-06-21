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
            COUNT(purchases.meal_id) AS purchase_count_all,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int) 
                BETWEEN 15 AND 18
                THEN purchases.user_id END) AS purchase_count_15_18,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int) 
                BETWEEN 19 AND 25
                THEN purchases.user_id END) AS purchase_count_19_25,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 26 AND 35
                THEN purchases.user_id END) AS purchase_count_26_35,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 36 AND 45
                THEN purchases.user_id END) AS purchase_count_36_45,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 46 AND 55
                THEN purchases.user_id END) AS purchase_count_46_55,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int)
                BETWEEN 56 AND 65
                THEN purchases.user_id END) AS purchase_count_56_65,
            COUNT(CASE 
                WHEN ${thisYear} - CAST(pgp_sym_decrypt(users.birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS int) > 65
                THEN purchases.user_id END) AS purchase_count_over_65,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.gender::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'man' 
                THEN purchases.user_id END) AS purchase_count_man,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.gender::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'woman' 
                THEN purchases.user_id END) AS purchase_count_woman,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.gender::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'other' 
                THEN purchases.user_id END) AS purchase_count_other,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'primary'
                THEN purchases.user_id END) AS purchase_count_education_primary,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'secondary'
                THEN purchases.user_id END) 
                AS purchase_count_education_secondary,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) 
                    = 'vocational specialised'
                THEN purchases.user_id END) 
                AS purchase_count_education_vocational_specialised,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'lowest tertiary'
                THEN purchases.user_id END) 
                AS purchase_count_education_lowest_tertiary,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'bachelors'
                THEN purchases.user_id END) 
                AS purchase_count_education_bachelors,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'masters'
                THEN purchases.user_id END) AS purchase_count_education_masters,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.education::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'doctoral'
                THEN purchases.user_id END) 
                AS purchase_count_education_doctoral,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'below 1500'
                THEN purchases.user_id END) AS purchase_count_below_1500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '1500-2500'
                THEN purchases.user_id END) AS purchase_count_1500_2500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '2500-3500'
                THEN purchases.user_id END) AS purchase_count_2500_3500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '3500-4500'
                THEN purchases.user_id END) AS purchase_count_3500_4500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = '4500-5500'
                THEN purchases.user_id END) AS purchase_count_4500_5500,
            COUNT(CASE 
                WHEN pgp_sym_decrypt(users.income::bytea, 
                ${process.env.DATABASE_ENCRYPTION_KEY}) = 'over 5500'
                THEN purchases.user_id END) AS purchase_count_over_5500
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
        GROUP BY 
            meals.meal_id;
    `;

    return researchData;
};

module.exports = {
    getResearchData
};