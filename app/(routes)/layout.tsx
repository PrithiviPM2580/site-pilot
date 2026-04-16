function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="">{children}</div>
    </main>
  );
}

export default HomeLayout;
