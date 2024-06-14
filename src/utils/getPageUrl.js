import axios from 'axios';
import apiUrl from '../utils/apiUrl';

async function getPageURL(){
    try {
        const response = await axios.get(
            `${apiUrl}/webpageURL/`
        );
        const webpageURL = response.data;
        return webpageURL;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export { getPageURL };