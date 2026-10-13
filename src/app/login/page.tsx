import { AuthForm } from "@/components/auth-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Welcome back to Cortex Notes</CardDescription>
        </CardHeader>
        <AuthForm type="login" />
      </Card>
    </div>
  );
}
