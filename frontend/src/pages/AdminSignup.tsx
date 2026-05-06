import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminSignup } from "../lib/hooks/api/useAuth";

export default function AdminSignupPage() {
  const navigate = useNavigate();

  const { mutate: useSignup, isPending: isAdminSignupPending } =
    useAdminSignup();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    useSignup(formData, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <div className="flex  items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600">
            Sign in
          </Link>
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Full name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full rounded-2xl border border-border bg-background px-4 py-3"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 block w-full rounded-2xl border border-border bg-background px-4 py-3"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="mt-1 block w-full rounded-2xl border border-border bg-background px-4 py-3"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              checked={formData.termsAccepted}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  termsAccepted: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-foreground"
            >
              I accept the terms
            </label>
          </div>

          <button
            type="submit"
            disabled={isAdminSignupPending}
            className="w-full rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {isAdminSignupPending ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
