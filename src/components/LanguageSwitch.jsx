import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Pressable, Text } from 'react-native';

const LanguageSwitch = () => {
    const { i18n } = useTranslation();
  
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // eslint-disable-next-line no-undef
        localStorage.setItem('i18nextLng', lng);
    };
  
    return (
        <View>
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