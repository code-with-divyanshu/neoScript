import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../lib/store";
import { useLogout } from "../../lib/hooks/api/useAuth";

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary-100 text-primary-700 dark:bg-slate-800 dark:text-primary-100"
      : "text-foreground/80 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5",
  ].join(" ");

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useStore((state) => state);
  const logoutMutation = useLogout();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="text-xl font-bold tracking-tight">
          MyBlog
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navClass}>
            About
          </NavLink>

          {!isAuthenticated ? (
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          ) : (
            <>
              <NavLink to="/blogs" className={navClass}>
                Blogs
              </NavLink>

              {user?.role === "admin" || user?.role === "author" ? (
                <NavLink to="/create-blog" className={navClass}>
                  Create Blog
                </NavLink>
              ) : null}
            </>
          )}
        </nav>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
              {isAuthenticated ? user?.name?.charAt(0)?.toUpperCase() : "U"}
            </span>

            <span className="hidden text-sm font-medium sm:block">
              {isAuthenticated ? user?.name : "User"}
            </span>

            <span className="text-xs text-muted">▼</span>
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-3 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl"
            >
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/signup");
                    }}
                    className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard");
                    }}
                    className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
