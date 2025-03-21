import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="container flex flex-col justify-center h-screen items-center w-screen">
      <div className="mx-auto w-full sm:w-[350px] flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            認証済みの方はメール認証もご利用できます
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
