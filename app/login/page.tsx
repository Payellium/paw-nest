
"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  const callbackUrl = searchParams.get("callbackUrl");

  const redirectTo =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/adopt";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-base text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10";

  const labelClass =
    "mb-1.5 block text-base font-medium text-[#334155]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:min-h-screen lg:py-5">
      {/* Decorative paw prints */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 top-16 rotate-[-20deg] text-7xl text-[#7C3AED]/[0.06] sm:left-8 sm:text-8xl"
      >
        🐾
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 right-0 rotate-[20deg] text-8xl text-[#7C3AED]/[0.06] sm:right-10 sm:text-9xl"
      >
        🐾
      </div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl shadow-[#7C3AED]/[0.07] md:grid-cols-[0.82fr_1.18fr]">
        {/* Welcome panel */}
        <section className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#E9D8FD] via-[#DFF4FF] to-[#D8F3DC] px-6 py-8 sm:px-9 md:px-8 lg:px-10 lg:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10"
          >
            🐾
          </div>

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-[#5B21B6] transition hover:text-[#7C3AED]"
            >
              <span className="text-2xl">🐾</span>
              PawNest
            </Link>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-medium text-[#6D28D9]">
              <span>💜</span>
              Welcome back, cat lover!
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#1E293B] sm:text-4xl">
              Your furry friends
              <br />
              missed you.
            </h1>

            <p className="mt-3 max-w-sm text-base leading-7 text-[#475569]">
              Sign in to continue your PawNest journey. Find your new
              companion, manage your adoption requests, and help more cats
              find loving homes.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm text-[#475569]">
                🐱 Cat adoption
              </span>
              <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm text-[#475569]">
                💗 Happy homes
              </span>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="flex flex-col justify-center px-6 py-8 sm:px-10 md:px-8 lg:px-12 lg:py-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
                Member access
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#1E293B]">
                Sign in
              </h2>

              <p className="mt-2 text-base text-[#64748B]">
                Welcome back! Enter your details below.
              </p>
            </div>

            {registered && (
              <div
                role="status"
                className="mb-4 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-sm leading-6 text-[#166534]"
              >
                Your account has been created successfully. You can now sign
                in.
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  required
                  maxLength={254}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${inputClass} pr-20`}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute inset-y-0 right-3 my-auto h-fit text-sm font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3.5 text-base font-semibold text-white shadow-md shadow-[#7C3AED]/20 transition hover:bg-[#6D28D9] hover:shadow-lg hover:shadow-[#7C3AED]/25 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E2E8F0]" />
              <span className="text-sm text-[#94A3B8]">
                New to PawNest?
              </span>
              <div className="h-px flex-1 bg-[#E2E8F0]" />
            </div>

            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-xl border border-[#DDD6FE] bg-white px-5 py-3 text-base font-semibold text-[#6D28D9] transition hover:border-[#7C3AED] hover:bg-[#F5F3FF] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
            >
              Create an account
            </Link>

            <p className="mt-5 text-center text-sm leading-6 text-[#94A3B8]">
              By signing in, you agree to help make every cat&apos;s world a
              little better. 🐾
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
          <span
            className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED]/20 border-t-[#7C3AED]"
            aria-label="Loading login page"
          />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
