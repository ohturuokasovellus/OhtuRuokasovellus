import { Text, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link } from '../Router';
import ExternalLink from './Survey';
import createStyles from '../styles/styles';

const About = (props) => {
    const {t} = useTranslation();
    const styles = createStyles();
    const repositoryUrl = 'https://github.com/'
        + 'ohturuokasovellus/OhtuRuokasovellus/';

    return (
        <ScrollView style={styles.background}>
            <View style={[styles.container, { alignItems: 'center' }]}>
                <Text style={styles.h1}>{t('ABOUT')}</Text>
                <View style={styles.cardContainer}>
                    <Text style={styles.body}>{t('APP_DESCRIPTION')}</Text>
                    <Text style={styles.body}>
                        {t('NUTRISCORE_MAY_NOT_BE_CORRECT')}
                    </Text>
                    <ExternalLink surveyUrl={repositoryUrl} 
                        textIdentifier={'LINK_TO_REPOSITORY'}/>
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