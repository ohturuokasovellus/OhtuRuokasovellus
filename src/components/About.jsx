import { Text, View, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link } from '../Router';
import createStyles from '../styles/styles';

const About = (props) => {
    const {t} = useTranslation();
    const styles = createStyles();

    const SourceCodeLink = () => {
        const repositoryURL = 'https://github.com/'
        + 'ohturuokasovellus/OhtuRuokasovellus/';
        const openLink = () => {
            void Linking.openURL(repositoryURL);
        };

        return (
            <Text style={styles.body}>
                {t('LICENSE_DISCLAIMER') + t('VIEW_SOURCE')}
                <Text
                    style={styles.link}
                    onPress={openLink}
                    id='source-code-link'
                >
                    {t('HERE')}
                </Text>
                <Text>.</Text>
            </Text>
        );
    };

    return (
        <ScrollView style={styles.background}>
            <View style={[styles.container, { alignItems: 'center' }]}>
                <Text style={styles.h1}>{t('ABOUT')}</Text>
                <View style={styles.cardContainer}>
                    <Text style={styles.body}>{t('APP_DESCRIPTION')}</Text>
                    <Text style={styles.body}>
                        {t('NUTRISCORE_MAY_NOT_BE_CORRECT')}
                    </Text>
                    <SourceCodeLink />
                </View>
                {!props.userSession &&
                    <Text style={styles.body}>
                        <Link to='/login'>
                            <Text style={styles.link} id='login-link'>
                                {t('LOGIN')}
                            </Text>
                        </Link>
                        /
                        <Link to='/register'>
                            <Text style={styles.link} id='register-link'>
                                {t('REGISTER')}
                            </Text>
                        </Link>
                    </Text>
                }
            </View>
        </ScrollView>
    );
};

export default About;
