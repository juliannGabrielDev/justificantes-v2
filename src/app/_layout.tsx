import {
	Inter_400Regular,
	Inter_400Regular_Italic,
	Inter_500Medium,
	Inter_500Medium_Italic,
	Inter_600SemiBold,
	Inter_600SemiBold_Italic,
	Inter_700Bold,
	Inter_700Bold_Italic,
	Inter_800ExtraBold,
	Inter_800ExtraBold_Italic,
	Inter_900Black,
	Inter_900Black_Italic,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useStyles, useThemeColors, type ThemeColors } from "@/use-theme";
import { AlertProvider } from "@/context/alert-context";
import { BlurTargetProvider } from "@/context/blur-target-context";

import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		"Inter-Regular": Inter_400Regular,
		"Inter-Regular-Italic": Inter_400Regular_Italic,
		"Inter-Medium": Inter_500Medium,
		"Inter-Medium-Italic": Inter_500Medium_Italic,
		"Inter-SemiBold": Inter_600SemiBold,
		"Inter-SemiBold-Italic": Inter_600SemiBold_Italic,
		"Inter-Bold": Inter_700Bold,
		"Inter-Bold-Italic": Inter_700Bold_Italic,
		"Inter-ExtraBold": Inter_800ExtraBold,
		"Inter-ExtraBold-Italic": Inter_800ExtraBold_Italic,
		"Inter-Black": Inter_900Black,
		"Inter-Black-Italic": Inter_900Black_Italic,
		"Alan-Sans-Bold": require("@/assets/fonts/alan-sans/AlanSans-Bold.ttf"),
		"Alan-Sans-ExtraBold": require("@/assets/fonts/alan-sans/AlanSans-ExtraBold.ttf"),
		"Alan-Sans-Black": require("@/assets/fonts/alan-sans/AlanSans-Black.ttf"),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<AlertProvider>
					<BlurTargetProvider>
						<AppContent />
					</BlurTargetProvider>
				</AlertProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

function createStyles(c: ThemeColors) {
	return StyleSheet.create({
		topInset: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			zIndex: 9999,
			backgroundColor: c.surface,
		},
		bottomInset: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			zIndex: 9999,
			backgroundColor: c.surface,
		},
	});
}

function AppContent() {
	const styles = useStyles(createStyles);
	const { isDark } = useThemeColors();
	const insets = useSafeAreaInsets();

	return (
		<>
			<StatusBar style={isDark ? "light" : "dark"} />
			<Slot />
			<View style={[styles.topInset, { height: insets.top }]} />
			<View style={[styles.bottomInset, { height: insets.bottom }]} />
		</>
	);
}
