# How to use fonts

First, download a font file. Use only .ttf or .otf files, because they are the only ones that work with all platforms in Expo.

Add your font files to 
```
assets/fonts
```
directory.

Make sure that the names of the font files do not contain special characters like "-". Upper and lower case letters and numbers are fine. Other characters might cause problems in different platforms


In 
```
App.jsx
```
add a new line inside "fonts" in
```
    "plugins": [
      "expo-router",
      [
        "expo-font",
        {
          "fonts": []
        }
      ]
    ],
```

The line should be of the form
```
"./assets/fonts/FontName.fileEnding"
```
All lines should be separated by commas.

For example:
```
    "plugins": [
      "expo-router",
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/font1.ttf", "./assets/fonts/font2.otf"]
        }
      ]
    ],
```

In 
```
App.json
```
add a new line inside useFonts() function.

The line should be 
```
'FontName': require('./assets/fonts/FontName.fileEnding'),
```

For example:
```
'Jacquard12Regular': require('./assets/fonts/Jacquard12Regular.ttf'),
```

Finally, add
```
fontFamily: 'FontName'
```

to any style of a text you want.

## In case of errors

You might have to wait for the fonts to load. Here is a tutorial for that: https://docs.expo.dev/develop/user-interface/fonts/#wait-for-fonts-to-load