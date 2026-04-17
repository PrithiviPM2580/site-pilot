"use client";

import { useAuth } from "@insforge/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoaded, isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const result = await signUp(email, password);

    if ("error" in result && result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    if (
      "requireEmailVerification" in result &&
      result.requireEmailVerification
    ) {
      setNotice("Account created. Please verify your email before signing in.");
      setSubmitting(false);
      return;
    }

    router.replace("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Sign up</h1>
          <p className="text-sm text-muted-foreground">
            Create your account with email and password.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {notice ? <p className="text-sm text-green-600">{notice}</p> : null}

        <Button
          type="submit"
          className="w-full"
          disabled={!isLoaded || submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;
