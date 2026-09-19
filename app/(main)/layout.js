import { checkUser } from "@/lib/checkUser";

const MainLayout = async ({ children }) => {
  await checkUser();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
