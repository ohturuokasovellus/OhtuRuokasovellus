import { Text, View } from "react-native"
import { Link } from '../Router'

const Register = () => {
  return (
    <View>
      <Text>register</Text>
      <Link to='/'>
        <Text>home</Text>
      </Link>
    </View>
  )
}

export default Register