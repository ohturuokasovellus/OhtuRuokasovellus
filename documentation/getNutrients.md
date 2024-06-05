# How getNutrients() works

getNutrients() in backend/services/calculateNutrients.js uses papaparse module for reading from a csv file. At the moment it reads a file called example_nutrients.csv, which must be located in backend/ directory.

## Example csv file

Here is an example of the form that the csv file must follow:
```bash
,carbohydrates,protein,fat,fiber,sugar,sodium,saturated_fat,unsaturated_fat,energy
potato,15.5,0.1,0.1,1,0.6,2.5,0,0,75,50
fried_fish,0,21.5,7.7,0,0,1135,1.6,0,155,150
```

## Important things to know

Words and numbers must be separated with commas, and numbers must use periods as decimal separators!

The first comma in the first line is important, as it is used to skip the first line when calculating nutrient values.
