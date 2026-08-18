import { Link } from "expo-router";
import { Text, View } from "react-native";

const App = () => {
	return (
		<View>
			<Text className="mt-40">App</Text>
			<Link href="/(student)/(tabs)">Student</Link>
		</View>
	);
};

export default App;
