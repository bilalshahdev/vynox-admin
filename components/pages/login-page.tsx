"use client";
import LoginForm from "@/components/forms/LoginForm";
const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center md:gap-8 bg-secondary/50">
      <div className="space-y-4 p-4 md:p-8 bg-background rounded">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
