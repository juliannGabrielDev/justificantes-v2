import CustomTabBar, { TabConfig } from "@/components/ui/custom-tab-bar";
import TopAppBar from "@/components/ui/top-app-bar";
import {
	brand,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
	ArrowUpTrayIcon,
	ClipboardDocumentListIcon,
	HomeIcon,
} from "react-native-heroicons/outline";

const STUDENT_TABS_CONFIG: Record<string, TabConfig> = {
	index: {
		label: "Inicio",
		color: brand.primary,
		Icon: HomeIcon,
	},
	upload: {
		label: "Subir",
		color: brand.tertiary,
		Icon: ArrowUpTrayIcon,
	},
	history: {
		label: "Historial",
		color: brand.secondary,
		Icon: ClipboardDocumentListIcon,
		contentColor: "onSurfaceDark",
	},
};

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.surface,
		},
	});

export default function TabsLayout() {
	const styles = useStyles(createStyles);
	const { colors } = useThemeColors();

	return (
		<View style={styles.container}>
			<TopAppBar />
			<Tabs
				tabBar={(props) => (
					<CustomTabBar {...props} config={STUDENT_TABS_CONFIG} />
				)}
				screenOptions={{
					headerShown: false,
					sceneStyle: { backgroundColor: colors.surface },
				}}
			/>
		</View>
	);
}
