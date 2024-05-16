import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native"
import { Link, useNavigate } from '../Router'

const HomePage = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.user) {
      navigate('/login')
    }
  }, [])

  return !props.user
    ? navigate('/login') 
    : (
      <View>
        {props.user && 
          <Text style={styles.welcomeText}>Welcome, {props.user.username}
          </Text>
        }
        <Link to="/register">
          <Text>Open register</Text>
        </Link>
      </View>
    )
}

const styles = StyleSheet.create({
  welcomeText: {
    position: 'flex',
    top: 0,
    left: 0,
    margin: 20,
    },
});

export default HomePage
