import * as Icons from './Icons';

import * as SocialLinkUrls from '@/lib/constants';

export default function SocialLinks() {
  return (
    <>
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
    </>
  );
}
