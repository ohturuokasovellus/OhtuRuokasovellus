import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Pressable, Text } from 'react-native';
// import { styles } from '../styling/styles';

// const languages = [
//     { code: 'eng', lang: 'English' },
//     { code: 'fin', lang: 'Suomi' },
// ];

const LanguageSwitch = () => {
    const { i18n } = useTranslation();
  
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
  
    return (
        <View>
            {/* {languages.map((lng) => {
                return (
                    <Pressable className=
                        {lng.code === i18n.language ? 'selected' : ''}
                    key={lng.code}
                    onPress={() => changeLanguage(lng.code)}
                    >
                        <Text>
                            {lng.lang}
                        </Text>
                    </Pressable> */}
            {/* ); */}
            {/* })} */}
            <Pressable id='english_button'
                onPress={() => changeLanguage('eng')}
            >
                <Text style={{ color: 'white' }}>
                    {'English'}
                </Text>
            </Pressable>
            <Pressable id='suomi_button'
                onPress={() => changeLanguage('fin')}
            >
                <Text style={{ color: 'white' }}>
                    {'Suomi'}
                </Text>
            </Pressable>

        </View>
    );
};

export default LanguageSwitch;