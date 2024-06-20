import axios from 'axios';
import { View, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';
import apiUrl from '../utils/apiUrl';


const ResearchData = () => {
    const { t } = useTranslation();
    const styles = createStyles();

    const getResearchData = async () => {
        let response = null;
        try {
            response = await axios.get(`${apiUrl}/research-data/`);
            if (!response.data) return;
            download(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const download = async data => {
        if (Platform.OS === 'web') {
            const uri = 'data:application/csv;charset=utf-8,' +
                encodeURIComponent(data);
            // eslint-disable-next-line no-undef
            const link = document.createElement('a');
            link.href = uri;
            link.download = 'research_data.csv';
            // eslint-disable-next-line no-undef
            document.body.appendChild(link);
            link.click();
            // eslint-disable-next-line no-undef
            document.body.removeChild(link);
        }
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container} id='bar-chart'>
                <Button
                    styles={styles} onPress={getResearchData}
                    text={t('DOWNLOAD')} id='export-user-data'
                />
            </View>
        </ScrollView>
    );
};

export default ResearchData;
