import { useCallback } from "react";
import { useSnackbar } from "notistack";

/**
 * Hook that returns a function to show snackbar notifications.
 * @returns {(text: string, duration?: number) => void} Show snackbar function
 */
const useSnackbarHandler = () => {
	const { enqueueSnackbar } = useSnackbar();

	return useCallback(
		(text, duration = 2500) => {
			enqueueSnackbar(text, {
				autoHideDuration: duration,
				anchorOrigin: {
					vertical: "top",
					horizontal: "center",
				},
				className: "ext-snackbar",
			});
		},
		[enqueueSnackbar],
	);
};

export default useSnackbarHandler;
