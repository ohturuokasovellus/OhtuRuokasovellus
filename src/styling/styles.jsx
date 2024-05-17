import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeText: {
      position: 'flex',
      top: 0,
      left: 0,
      margin: 20,
      },
    login: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
    },
    register: {
      margin: 10,
    },
    logout: {
      position: 'absolute',
      top: 0,
      left: 0,
      margin: 20,
      },
      errorText: {
        color: 'red',
        marginBottom: 10,
      },
});

export { styles }