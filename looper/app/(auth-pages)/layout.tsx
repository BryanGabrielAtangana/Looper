export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-full h-screen flex flex-col justify-center gap-12 items-center">
      {children}
    </div>
  );
}
