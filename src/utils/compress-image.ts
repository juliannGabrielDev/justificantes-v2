import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const MAX_SIZE_MB = 1;

export async function compressImageToUnder1Mb(
	uri: string,
	assetSize?: number,
): Promise<string> {
	let currentUri = uri;

	try {
		let currentSizeInMb = assetSize ? assetSize / (1024 * 1024) : 0;

		if (!currentSizeInMb) {
			const res = await fetch(currentUri);
			const contentLength = res.headers.get("content-length");
			if (contentLength) {
				currentSizeInMb = parseInt(contentLength, 10) / (1024 * 1024);
			}
		}

		if (currentSizeInMb > 3) {
			const manipResult = await manipulateAsync(
				currentUri,
				[{ resize: { width: 1600 } }],
				{ compress: 0.7, format: SaveFormat.JPEG },
			);
			currentUri = manipResult.uri;
		}

		if (currentSizeInMb > 6) {
			const manipResult = await manipulateAsync(
				currentUri,
				[{ resize: { width: 1200 } }],
				{ compress: 0.5, format: SaveFormat.JPEG },
			);
			currentUri = manipResult.uri;
		}

		if (currentSizeInMb > 10) {
			const manipResult = await manipulateAsync(
				currentUri,
				[{ resize: { width: 800 } }],
				{ compress: 0.4, format: SaveFormat.JPEG },
			);
			currentUri = manipResult.uri;
		}

		if (currentSizeInMb > MAX_SIZE_MB) {
			const manipResult = await manipulateAsync(currentUri, [], {
				compress: 0.5,
				format: SaveFormat.JPEG,
			});
			currentUri = manipResult.uri;
		}
	} catch (err) {
		console.error("[compressImageToUnder1Mb] Error compressing image:", err);
	}

	return currentUri;
}
