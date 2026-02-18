import Link from 'next/link';

const footerGroups = [
  {
    title: '서비스',
    links: [
      { href: '/pet-talker', label: '펫토커' },
      { href: '/cost-search', label: '진료비 검색' }
    ]
  },
  {
    title: '가이드',
    links: [{ href: '/blog', label: '블로그' }]
  },
  {
    title: '회사',
    links: [{ href: '/mypage', label: '마이페이지' }]
  }
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#1F2937]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Pet<span className="text-[#48B8D0]">Health</span>+
            </span>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-[#B28B84]">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-gray-500">© {new Date().getFullYear()} PetHealth+. All rights reserved.</p>
      </div>
    </footer>
  );
}
