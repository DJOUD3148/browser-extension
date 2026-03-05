import { Button, Placeholder } from "@vkontakte/vkui";
import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, resetKey: 0 };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: 24 }}>
					<Placeholder
						header="Произошла ошибка"
						action={
							<Button
								onClick={() =>
									this.setState((prev) => ({
										hasError: false,
										error: null,
										resetKey: prev.resetKey + 1,
									}))
								}
							>
								Попробовать снова
							</Button>
						}
					>
						{this.state.error?.message ?? "Неизвестная ошибка"}
					</Placeholder>
				</div>
			);
		}

		return (
			<React.Fragment key={this.state.resetKey}>
				{this.props.children}
			</React.Fragment>
		);
	}
}

export default ErrorBoundary;
