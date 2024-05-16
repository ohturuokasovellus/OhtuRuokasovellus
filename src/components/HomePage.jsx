import { useEffect } from "react";
import { Text, View } from "react-native"
import { useNavigate } from '../Router'
import { styles } from '../styling/styles'

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
      </View>
    )
}

export default HomePage
