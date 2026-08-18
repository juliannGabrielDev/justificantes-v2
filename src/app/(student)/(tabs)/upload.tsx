import { Button } from "@/components/common/button";
import { StyledText } from "@/components/common/styled-text";
import DatePicker from "@/components/form/date-picker";
import ImagePicker from "@/components/form/image-picker";
import { Input } from "@/components/form/input";
import { createScreenStyles } from "@/styles/screen.styles";
import {
	brand,
	colors,
	radius,
	spacing,
	ThemeColors,
	useStyles,
} from "@/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		card: {
			flexDirection: "row",
			borderRadius: radius["2xl"],
			overflow: "hidden",
		},
		cardIconContainer: {
			padding: spacing.md,
			backgroundColor: brand.primary,
			justifyContent: "center",
			alignItems: "center",
		},
		cardBody: {
			flex: 1,
			padding: spacing.sm,
			gap: spacing.xs,
			backgroundColor: colors.surfaceContainer,
			justifyContent: "center",
		},
	});

const Upload = () => {
	const insets = useSafeAreaInsets();
	const styles = useStyles(createStyles);
	const screenStyles = useStyles(() => createScreenStyles(insets));

	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date());
	const [evidence, setEvidence] = useState<string | null>(null);

	return (
		<ScrollView
			contentContainerStyle={screenStyles.screen}
			showsVerticalScrollIndicator={false}
		>
			<StyledText
				variant="display"
				family="display"
				size="lg"
				weight="black"
				align="center"
			>
				Nuevo
			</StyledText>
			<View style={styles.card} className="shadow-sm">
				<View style={styles.cardIconContainer}>
					<UserCircleIcon size={24} color={colors.light.onSurface} />
				</View>
				<View style={styles.cardBody}>
					<StyledText variant="title" size="md" weight="medium">
						Julián Alejandro Gabriel Isidro
					</StyledText>
					<StyledText
						variant="body"
						size="md"
						weight="medium"
						color="onSurfaceVariant"
					>
						22039485876
					</StyledText>
				</View>
			</View>
			<View style={{ flexDirection: "row", gap: spacing.lg }}>
				<DatePicker
					label="Fecha"
					variant="tertiary"
					required
					value={date}
					onChange={setDate}
					style={{ flex: 1 }}
				/>
				<DatePicker
					label="Fecha"
					variant="secondary"
					required
					value={date}
					onChange={setDate}
					style={{ flex: 1 }}
				/>
			</View>
			<Input>
				<Input.Label required>Descripción</Input.Label>
				<Input.Container style={{ minHeight: 120, alignItems: "flex-start" }}>
					<Input.Icon icon={PencilSquareIcon} />
					<Input.Field
						placeholder="Motivo del justificante"
						multiline
						numberOfLines={6}
						style={{ minHeight: 100, textAlignVertical: "top" }}
					/>
				</Input.Container>
			</Input>
			<ImagePicker
				label="Elegir evidencia"
				required
				value={evidence}
				onChange={setEvidence}
			/>
			<Button size="super" style={{ alignSelf: "center" }}>
				{loading ? (
					<Button.Spinner size={32} />
				) : (
					<Button.Text>Enviar</Button.Text>
				)}
			</Button>
		</ScrollView>
	);
};

export default Upload;
