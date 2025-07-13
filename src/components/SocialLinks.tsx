import * as Icons from './Icons';

import * as SocialLinkUrls from '@/lib/constants';

export default function SocialLinks() {
  return (
    <div className="flex flex-row items-center gap-8 md:gap-4 pt-2 md:pt-8 max-w-[224px] mx-auto">
      <a
        href={SocialLinkUrls.instagramLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icons.InstagramIcon />
      </a>
      <a
        href={SocialLinkUrls.tikTokLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icons.TiktokIcon />
      </a>
      <a
        href={SocialLinkUrls.facebookLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icons.FacebookIcon />
      </a>
    </div>
  );
}
