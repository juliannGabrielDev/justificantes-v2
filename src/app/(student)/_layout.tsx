// import TopAppBar from '@/components/ui/top-app-bar';
import { Stack } from "expo-router";

export default function StudentLayout() {
	return (
		<>
			{/* <TopAppBar /> */}
			<Stack screenOptions={{ headerShown: false }} />
		</>
	);
}
