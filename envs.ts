import { EnvNotFoundError } from "./errors";

type Envs = {
	PORT: number;
};

function getEnv<T extends keyof Envs>(key: T, defaultValue?: string): string {
	const value = process.env[key] ?? defaultValue;
	if (!value) {
		throw new EnvNotFoundError(key);
	}
	return value;
}

export const envs: Envs = {
	PORT: Number.parseInt(getEnv("PORT", "3000")),
};
