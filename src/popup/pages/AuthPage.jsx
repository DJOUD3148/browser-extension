import { Icon56GlobeOutline } from "@vkontakte/icons";
import { Button, Placeholder } from "@vkontakte/vkui";
import React from "react";

const AuthPage = ({ onLogin }) => {
	return (
		<div className="ext-auth-page">
			<Placeholder
				header="StealthSurf VPN"
				icon={<Icon56GlobeOutline />}
				action={
					<Button size="l" onClick={onLogin}>
						Войти в аккаунт
					</Button>
				}
			>
				Войдите в свой аккаунт для продолжения работы с расширением.
			</Placeholder>
		</div>
	);
};

export default AuthPage;
