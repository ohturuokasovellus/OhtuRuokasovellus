
export default process.env.NODE_ENV === 'development' ?
    'http://localhost:8080/api' :
    '/api';
