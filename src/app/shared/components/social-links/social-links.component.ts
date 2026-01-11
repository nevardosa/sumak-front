import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaService } from '../../../core/services/social-media.service';
import { SocialMediaLink, SocialPlatform } from '../../../core/models/social-media.models';

export type SocialDisplayStyle = 'horizontal' | 'vertical' | 'grid';
export type SocialSize = 'sm' | 'md' | 'lg';
export type SocialVariant = 'default' | 'minimal' | 'filled';

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialLinksComponent {
  @Input() displayStyle: SocialDisplayStyle = 'horizontal';
  @Input() size: SocialSize = 'md';
  @Input() variant: SocialVariant = 'default';
  @Input() showLabels = false;
  @Input() showHandles = false;

  private readonly socialMediaService = inject(SocialMediaService);

  get socialLinks(): readonly SocialMediaLink[] {
    return this.socialMediaService.links;
  }

  get containerClasses(): string {
    const styleClasses = {
      horizontal: 'flex items-center space-x-4',
      vertical: 'flex flex-col space-y-4',
      grid: 'grid grid-cols-3 gap-4'
    };
    return styleClasses[this.displayStyle];
  }

  getLinkClasses(platform: SocialPlatform): string {
    const baseClasses = 'inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sumak-gold focus:ring-offset-2 rounded-full';
    
    const sizeClasses = {
      sm: 'w-10 h-10 p-2',
      md: 'w-12 h-12 p-2.5',
      lg: 'w-14 h-14 p-3'
    };

    const variantClasses = {
      default: 'text-text-secondary hover:text-sumak-gold hover:bg-sumak-gold/10 border border-gray-200 hover:border-sumak-gold/30',
      minimal: 'text-text-body hover:text-sumak-green hover:bg-sumak-green/10',
      filled: this.getFilledClasses(platform)
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  private getFilledClasses(platform: SocialPlatform): string {
    const platformColors = {
      instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 shadow-lg hover:shadow-xl',
      facebook: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
      tiktok: 'bg-black text-white hover:bg-gray-900 shadow-lg hover:shadow-xl'
    };
    return `${platformColors[platform]} transform hover:scale-105`;
  }

  onSocialClick(platform: SocialPlatform): void {
    this.socialMediaService.trackSocialClick(platform);
    this.socialMediaService.openSocialLink(platform);
  }

  trackByPlatform(index: number, link: SocialMediaLink): string {
    return link.platform;
  }
}