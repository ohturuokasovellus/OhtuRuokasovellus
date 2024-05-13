import { Text, View } from "react-native"
import { Link } from '../Router'

const ExampleComponent = () => {
  return (
    <View>
      <Text>example component</Text>
      <Link to='/test'>
        <Text>Open test</Text>
      </Link>
    </View>
  )
}

export default ExampleComponent
