// app/layout.tsx or app/layout.js

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex justify-center flex-col items-center w-full  ">
      {children}
    </main>
  );
}
