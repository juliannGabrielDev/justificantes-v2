import { Button } from "@/components/common/button";
import { StyledText } from "@/components/common/styled-text";
import { useHaptics } from "@/hooks/use-haptics";
import {
	radius,
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";
import { usePathname, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	ArrowUturnLeftIcon,
	Bars2Icon,
	BellIcon,
	PlusIcon,
	ScaleIcon,
	UserCircleIcon,
} from "react-native-heroicons/outline";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_SCREENS = ["/", "/upload", "/history"];
const ICON_BUTTON_SIZE = 52;
const ICON_SIZE = 28;

export interface TopAppBarProps {
	/** Route pushed by the create (+) button; button hidden when not provided */
	createRoute?: Href;
	/** Hide the notifications button */
	hideNotifications?: boolean;
	/** Route pushed by the notifications button */
	notificationsRoute?: Href;
	/** Route pushed by the profile menu item */
	profileRoute?: Href;
	/** Route pushed by the regulations menu item */
	regulationsRoute?: Href;
	/** Logout handler exposed in the menu */
	onLogout?: () => void;
}

function createStyles(c: ThemeColors) {
	return StyleSheet.create({
		container: {
			position: "absolute",
			left: spacing.xl,
			right: spacing.xl,
			zIndex: 50,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		iconSlot: {
			width: ICON_BUTTON_SIZE,
			height: ICON_BUTTON_SIZE,
		},
		iconButton: {
			width: ICON_BUTTON_SIZE,
			height: ICON_BUTTON_SIZE,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: radius.full,
			backgroundColor: c.surfaceContainer,
		},
		iconButtonPressed: {
			backgroundColor: c.surfaceContainerHover,
		},
		actionsRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: 6,
		},
		actionsCluster: {
			flexDirection: "row",
			overflow: "hidden",
			borderRadius: radius.full,
			backgroundColor: c.surfaceContainer,
		},
		menuPanel: {
			gap: spacing.lg,
			borderRadius: radius["3xl"],
			padding: spacing.lg,
			backgroundColor: c.surfaceContainer,
		},
		menuItem: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.md,
			paddingVertical: spacing.xs,
		},
		divider: {
			height: 1,
			backgroundColor: c.divider,
		},
	});
}

export default function TopAppBar({
	createRoute,
	hideNotifications = false,
	notificationsRoute = "/notifications" as Href,
	profileRoute = "/my-profile" as Href,
	regulationsRoute = "/regulations" as Href,
	onLogout,
}: TopAppBarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const insets = useSafeAreaInsets();
	const [menuVisible, setMenuVisible] = useState(false);
	const styles = useStyles(createStyles);
	const { colors } = useThemeColors();
	const haptics = useHaptics();

	const showBack = !TAB_SCREENS.includes(pathname);
	const showNotifications = !hideNotifications;
	const showCreate = !!createRoute;

	return (
		<View
			style={[styles.container, { top: insets.top + 4 }]}
			pointerEvents="box-none"
		>
			{/* Back button (left) */}
			<View style={styles.iconSlot}>
				{showBack && (
					<Animated.View
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(200)}
					>
						<Pressable
							onPress={() => {
								haptics.light();
								router.back();
							}}
							style={({ pressed }) => [
								styles.iconButton,
								pressed && styles.iconButtonPressed,
							]}
						>
							<ArrowUturnLeftIcon size={ICON_SIZE} color={colors.onSurface} />
						</Pressable>
					</Animated.View>
				)}
			</View>

			{/* Actions (right) */}
			<View style={styles.actionsRow}>
				<View>
					<Animated.View
						layout={LinearTransition.duration(200)}
						style={styles.actionsCluster}
					>
						{showCreate && (
							<Animated.View
								entering={FadeIn.duration(200)}
								exiting={FadeOut.duration(200)}
								layout={LinearTransition.duration(200)}
							>
								<Pressable
									onPress={() => {
										haptics.light();
										router.push(createRoute!);
									}}
									style={({ pressed }) => [
										styles.iconButton,
										pressed && styles.iconButtonPressed,
									]}
								>
									<PlusIcon size={ICON_SIZE} color={colors.onSurface} />
								</Pressable>
							</Animated.View>
						)}

						{showNotifications && (
							<Animated.View
								entering={FadeIn.duration(200)}
								exiting={FadeOut.duration(200)}
								layout={LinearTransition.duration(200)}
							>
								<Pressable
									onPress={() => {
										haptics.light();
										router.push(notificationsRoute);
									}}
									style={({ pressed }) => [
										styles.iconButton,
										pressed && styles.iconButtonPressed,
									]}
								>
									<BellIcon size={ICON_SIZE} color={colors.onSurface} />
								</Pressable>
							</Animated.View>
						)}

						<Animated.View layout={LinearTransition.duration(200)}>
							<Pressable
								onPress={() => {
									haptics.light();
									setMenuVisible(true);
								}}
								style={({ pressed }) => [
									styles.iconButton,
									pressed && styles.iconButtonPressed,
								]}
							>
								<Bars2Icon size={ICON_SIZE} color={colors.onSurface} />
							</Pressable>
						</Animated.View>
					</Animated.View>
				</View>

				{/* Dropdown menu */}
				{menuVisible && (
					<Modal
						transparent
						visible={menuVisible}
						animationType="none"
						onRequestClose={() => setMenuVisible(false)}
					>
						<GestureHandlerRootView style={{ flex: 1 }}>
							<Pressable
								style={{ flex: 1 }}
								onPress={() => {
									haptics.light();
									setMenuVisible(false);
								}}
							>
								<View
									style={{
										position: "absolute",
										top: insets.top + 16,
										right: spacing.xl,
									}}
								>
									<Animated.View
										entering={FadeIn.duration(150)}
										exiting={FadeOut.duration(150)}
										style={styles.menuPanel}
										className="shadow-lg"
									>
										{/* My profile */}
										<Pressable
											onPress={() => {
												haptics.light();
												setMenuVisible(false);
												router.push(profileRoute);
											}}
											style={({ pressed }) => [
												styles.menuItem,
												pressed && { opacity: 0.6 },
											]}
										>
											<UserCircleIcon size={24} color={colors.onSurface} />
											<StyledText weight="semibold">Mi perfil</StyledText>
										</Pressable>

										{/* Regulations */}
										<Pressable
											onPress={() => {
												haptics.light();
												setMenuVisible(false);
												router.push(regulationsRoute);
											}}
											style={({ pressed }) => [
												styles.menuItem,
												pressed && { opacity: 0.6 },
											]}
										>
											<ScaleIcon size={24} color={colors.onSurface} />
											<StyledText weight="semibold">Reglamento</StyledText>
										</Pressable>

										<View style={styles.divider} />

										<Button
											onPress={() => {
												haptics.light();
												setMenuVisible(false);
												onLogout?.();
											}}
											variant="secondary"
										>
											<Button.Text className="uppercase">
												Cerrar Sesión
											</Button.Text>
										</Button>
									</Animated.View>
								</View>
							</Pressable>
						</GestureHandlerRootView>
					</Modal>
				)}
			</View>
		</View>
	);
}
