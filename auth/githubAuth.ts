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
  const user = await fetchGitHubUser(authState.accessToken);

  return {
    tokens: {
      accessToken: authState.accessToken,
      accessTokenExpirationDate: authState.accessTokenExpirationDate,
      refreshToken: authState.refreshToken,
    },
    user,
  };
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
