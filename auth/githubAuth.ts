import { authorize, AuthorizeResult } from 'react-native-app-auth';
import type { AuthConfiguration } from 'react-native-app-auth';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
} from '@env';

const serviceConfiguration: NonNullable<AuthConfiguration['serviceConfiguration']> = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export interface GitHubUserProfile {
  login: string;
  name?: string;
  avatarUrl?: string;
}

export interface GitHubAuthSession {
  tokens: Pick<
    AuthorizeResult,
    'accessToken' | 'accessTokenExpirationDate' | 'refreshToken'
  >;
  user: GitHubUserProfile;
}

export async function signInWithGitHub(): Promise<GitHubAuthSession> {
  const config = buildAuthConfig();

  const authState = await authorize(config);
  const tokens = await exchangeGitHubCode({
    code: authState.authorizationCode,
    clientId: config.clientId,
    clientSecret: config.clientSecret || '',
    redirectUrl: config.redirectUrl,
    codeVerifier: authState.codeVerifier,
  });
  const user = await fetchGitHubUser(tokens.accessToken);

  return { tokens, user };
}

async function fetchGitHubUser(
  accessToken: string,
): Promise<GitHubUserProfile> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Unable to fetch GitHub profile. (${response.status}) ${errorBody}`,
    );
  }

  const payload = (await response.json()) as {
    login: string;
    name?: string;
    avatar_url?: string;
  };

  return {
    login: payload.login,
    name: payload.name,
    avatarUrl: payload.avatar_url,
  };
}

function buildAuthConfig(): AuthConfiguration {
  const clientId = requireEnv(GITHUB_CLIENT_ID, 'GITHUB_CLIENT_ID');
  const clientSecret = requireEnv(GITHUB_CLIENT_SECRET, 'GITHUB_CLIENT_SECRET');
  const redirectUrl = requireEnv(GITHUB_REDIRECT_URI, 'GITHUB_REDIRECT_URI');

  validateRedirectUri(redirectUrl);

  return {
    clientId,
    clientSecret,
    redirectUrl,
    scopes: ['read:user', 'user:email'],
    serviceConfiguration,
    additionalParameters: {
      allow_signup: 'false',
    },
    skipCodeExchange: true,
  };
}

function requireEnv(value: string | undefined, key: string) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    throw new Error(`Missing ${key}. Set it in your .env file.`);
  }

  if (trimmed.startsWith('your_') || trimmed.startsWith('REPLACE')) {
    throw new Error(`Replace the placeholder value for ${key} in your .env file.`);
  }

  return trimmed;
}

function validateRedirectUri(uri: string) {
  if (!uri.includes('://')) {
    throw new Error(
      'GITHUB_REDIRECT_URI must be a valid deep link (e.g., com.reactgauge://oauthredirect).',
    );
  }
}

async function exchangeGitHubCode({
  code,
  clientId,
  clientSecret,
  redirectUrl,
  codeVerifier,
}: {
  code?: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  codeVerifier?: string;
}): Promise<GitHubAuthSession['tokens']> {
  if (!code) {
    throw new Error('Missing authorization code from GitHub.');
  }

  const response = await fetch(serviceConfiguration.tokenEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUrl,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `GitHub token exchange failed (${response.status}): ${errorBody}`,
    );
  }

  const payload = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string;
  };

  const accessTokenExpirationDate =
    typeof payload.expires_in === 'number'
      ? new Date(Date.now() + payload.expires_in * 1000).toISOString()
      : undefined;

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    accessTokenExpirationDate,
  };
}
