import axios from 'axios';
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';
import { Platform } from 'react-native';


const ResearchData = () => {
    const styles = createStyles();

    const getResearchData = async () => {
        let response = null;
        try {
            response = await axios.get(`${apiUrl}/research-data/`);
            if (!response.data) return;
            console.log(response);
            download(response);
        } catch (error) {
            console.log(error);
        }
    };

    const download = async data => {
        if (Platform.OS === 'web') {
            const uri = 'data:application/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(data));
            // eslint-disable-next-line no-undef
            const link = document.createElement('a');
            link.href = uri;
            link.download = 'research_data.json';
            // eslint-disable-next-line no-undef
            document.body.appendChild(link);
            link.click();
            // eslint-disable-next-line no-undef
            document.body.removeChild(link);
        }
    };

    useEffect(() => {
        getResearchData();
    }, []);

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container} id='bar-chart'>
            </View>
        </ScrollView>
    );
};

export default ResearchData;
