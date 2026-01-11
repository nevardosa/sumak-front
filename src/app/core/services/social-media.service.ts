import { Injectable } from '@angular/core';
import { SocialMediaLink, SocialPlatform } from '../models/social-media.models';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  private readonly socialLinks: readonly SocialMediaLink[] = [
    {
      platform: 'instagram',
      url: APP_CONSTANTS.SOCIAL_MEDIA.INSTAGRAM.URL,
      label: APP_CONSTANTS.SOCIAL_MEDIA.INSTAGRAM.LABEL,
      handle: APP_CONSTANTS.SOCIAL_MEDIA.INSTAGRAM.HANDLE,
      ariaLabel: `Visitar perfil de ${APP_CONSTANTS.SOCIAL_MEDIA.INSTAGRAM.LABEL} de Sumak Gourmet`
    },
    {
      platform: 'facebook',
      url: APP_CONSTANTS.SOCIAL_MEDIA.FACEBOOK.URL,
      label: APP_CONSTANTS.SOCIAL_MEDIA.FACEBOOK.LABEL,
      handle: APP_CONSTANTS.SOCIAL_MEDIA.FACEBOOK.HANDLE,
      ariaLabel: `Visitar página de ${APP_CONSTANTS.SOCIAL_MEDIA.FACEBOOK.LABEL} de Sumak Gourmet`
    },
    {
      platform: 'tiktok',
      url: APP_CONSTANTS.SOCIAL_MEDIA.TIKTOK.URL,
      label: APP_CONSTANTS.SOCIAL_MEDIA.TIKTOK.LABEL,
      handle: APP_CONSTANTS.SOCIAL_MEDIA.TIKTOK.HANDLE,
      ariaLabel: `Visitar perfil de ${APP_CONSTANTS.SOCIAL_MEDIA.TIKTOK.LABEL} de Sumak Gourmet`
    }
  ] as const;

  get links(): readonly SocialMediaLink[] {
    return this.socialLinks;
  }

  getLinkByPlatform(platform: SocialPlatform): SocialMediaLink | undefined {
    return this.socialLinks.find(link => link.platform === platform);
  }

  openSocialLink(platform: SocialPlatform): void {
    const link = this.getLinkByPlatform(platform);
    if (link) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  }

  trackSocialClick(platform: SocialPlatform): void {
    console.log(`Social media clicked: ${platform}`);
  }
}