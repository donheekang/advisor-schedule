type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return <main className="mx-auto w-full max-w-7xl px-4 py-8">{children}</main>;
}
