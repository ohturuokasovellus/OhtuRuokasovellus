# How getNutrients() works

getNutrients() in backend/services/calculateNutrients.js uses papaparse module for reading from a csv file. At the moment it reads a file called example_nutrients.csv, which must be located in backend/ directory.

## Example csv file

Here is an example of the form that the csv file must follow:
```bash
id,tuoteryhmä,name,energia laskennallinen (kJ),rasva (g),rasvahapot tyydyttyneet (g),hiilihydraatti imeytyvä (g),sokerit (g),kuitu kokonais- (g),proteiini (g),suola (mg),CO2 (g/100g tuotetta), kasvis
1,vihannekset,potato,50,1,0.5,10,1,5,0.1,0.1,5,true
2,fishes,fried fish,150,4,2,0,0,0,20,600,10,false
```

## Important things to know

Words and numbers must be separated with commas, and numbers must use periods as decimal separators!
