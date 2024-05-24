# Language localization

When creating text elements, add the text into language files found in the directory
```bash
src/lang/ 
```

To import the language files, only App.jsx has to import them with 
```bash
import './src/lang/i18n';
```

To use the imported language files add the following line to the start of the file that uses text elements.
```bash
import { useTranslation } from 'react-i18next';
```

Then, add this function to the function that returns a text element. The functions name HAS TO BE t, even though eslint won't like it. Otherwise the function won't work.
```bash
const {t} = useTranslation();
```

Then you can use text that has been defined in any of the language files in text elements, for example like this:
```bash
<Text>{t('GENERATE_A_URL')}</Text>
```


## How to add support for new languages

To support new languages, you first must add a JSON file corresponding to the language you want to use. Create the file inside the directory 
```bash
src/lang/ 
```
By default there is already files for english and finnish called 
```bash
en.json
```
and
```bash
fi.json
```

The language files should look something like this:
```bash
{
    "translation": {
        "TYPE_A_URL": "Type a URL",
        "GENERATE_A_URL": "Generate a URL",
        "TEXT_IDENTIFIER": "Some text to be used"
    }
}
```

Then, import the new language file in
```bash
src/lang/i18n.js
```

To import the file, use 
```bash
import language_identifier from './language.json';
```
Where language_identifier is a name that you will use in the next steps, and where ./language.json is the name of the language file you have created.
Then, add a new line in to the resources dictionary, so that it looks something like this:
```bash
const resources = {
    eng: engl,
    fin: finn,
    ...: ...,
    newLanguage: language_identifier,
};
```

## How to add new text into a language file

To add new text into a language file, write a new line containing a identifier and the text you want to use. For example:
```bash
{
    "translation": {
        "TYPE_A_URL": "Type a URL",
        "GENERATE_A_URL": "Generate a URL",
        "TEXT_IDENTIFIER": "Text identifiers value, just some text to be used"
    }
}
```

Remember to add the text identifier to all the language files, and to translate its text value into the correct language.