"use client";

import { useAuth, useInsforge } from "@insforge/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoaded, isSignedIn } = useAuth();
  const { verifyEmail, resendVerificationEmail } = useInsforge();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const getErrorMessage = (value: unknown, fallback: string) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const maybeError = (value as { error?: unknown }).error;
      if (typeof maybeError === "string") return maybeError;
      if (maybeError && typeof maybeError === "object") {
        const message = (maybeError as { message?: unknown }).message;
        if (typeof message === "string") return message;
      }
      const message = (value as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
    return fallback;
  };

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
      setNeedsVerification(true);
      setNotice("We sent a 6-digit verification code to your email.");
      setSubmitting(false);
      return;
    }

    router.replace("/");
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!verificationCode.trim()) {
      setError("Please enter the verification code from your email.");
      return;
    }

    setVerifying(true);
    setError(null);

    const result = await verifyEmail(verificationCode.trim(), email);

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      setError(
        getErrorMessage(result.error, "Verification failed. Please try again."),
      );
      setVerifying(false);
      return;
    }

    router.replace("/");
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);

    const result = await resendVerificationEmail(email);

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      setError(
        getErrorMessage(
          result.error,
          "Could not resend code. Please try again.",
        ),
      );
      setResending(false);
      return;
    }

    setNotice("A new verification code was sent to your email.");
    setResending(false);
  };

  if (needsVerification) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleVerifyCode}
          className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Verify your email</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to {email}.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification code</Label>
            <Input
              id="verificationCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="310105"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              required
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {notice ? <p className="text-sm text-green-600">{notice}</p> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={!isLoaded || verifying}
          >
            {verifying ? "Verifying..." : "Verify code"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={!isLoaded || resending}
          >
            {resending ? "Sending..." : "Resend code"}
          </Button>
        </form>
      </div>
    );
  }

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
