export interface SocialMediaLink {
  readonly platform: SocialPlatform;
  readonly url: string;
  readonly label: string;
  readonly handle: string;
  readonly ariaLabel: string;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok';

export interface SocialMediaConfig {
  readonly [key: string]: {
    readonly URL: string;
    readonly LABEL: string;
    readonly HANDLE: string;
  };
}