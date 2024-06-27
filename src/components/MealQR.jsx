import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Platform, ScrollView } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useParams } from '../Router';
import { Button } from './ui/Buttons';
import QRCode from 'react-qr-code';
import createStyles from '../styles/styles';
import { getPageURL } from '../utils/getPageUrl';

const MealQR = () => {
    const {t} = useTranslation();
    const { mealPurchaseCode } = useParams();
    const [menuQRCode, setmenuQRCode] = useState('');
    const qrViewReference = useRef(null);
    const styles = createStyles();

    useEffect(() => {
        const fetchWebpageURL = async () => {
            const webpageURL = await getPageURL();
            if (webpageURL) {
                const urlToConfirm = webpageURL+'/purchase/'+mealPurchaseCode;
                setmenuQRCode(urlToConfirm);
            } else {
                console.log('couldnt get webpage URL');
            }
        };

        void fetchWebpageURL();
    }, [mealPurchaseCode]);

    const getMealQR = async () => {
        try {
            if (qrViewReference.current){
                const uri = await captureRef(qrViewReference, {
                    format: 'jpg',
                    quality: 1,
                });
                void download(uri);
            }
        } catch (error) {
            console.error(error);
        }
    };    
    
    const download = async uri => {
        if (Platform.OS === 'web') {
            // eslint-disable-next-line no-undef
            const link = document.createElement('a');
            link.href = uri;
            link.download = 'mealQR.jpg';
            // eslint-disable-next-line no-undef
            document.body.appendChild(link);
            link.click();
            // eslint-disable-next-line no-undef
            document.body.removeChild(link);
        } else {
            const fileUrl = FileSystem.documentDirectory + 'mealQR.jpg';
            await FileSystem.writeAsStringAsync(fileUrl, uri);
            await Sharing.shareAsync(fileUrl);
        }
    };

    if (!menuQRCode) {
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.body}>
                        Loading...
                    </Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.background}>
            <View style={[
                styles.container,
                {alignItems: 'center', justifyContent: 'center'}
            ]}>
                <Text style={styles.body}>
                    {t('QR_CODE_TO_MEAL_CONFIRM')}
                </Text>
                <View style={styles.qrContainer} ref={qrViewReference}
                    id='meal-qr-code'>
                    <QRCode size={500} style={{ height: 'auto',
                        maxWidth: '500px', width: '500px'}}
                    value={menuQRCode}/>
                </View>
                <Button styles={styles} onPress={getMealQR} 
                    text={t('DOWNLOAD')} id='download-meal-qr-code'>
                </Button>
            </View>

        </ScrollView>
    );
};

export default MealQR;
