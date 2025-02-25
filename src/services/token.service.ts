const blacklistedTokens: Set<string> = new Set();

export function blacklistToken(token: string): void {
	blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
	return blacklistedTokens.has(token);
}
