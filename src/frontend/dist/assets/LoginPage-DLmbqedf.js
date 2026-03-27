import { ac as useInternetIdentity, a2 as useNavigate, u as useUserProfile, ae as useCreateUserProfile, r as reactExports, k as ue, j as jsxRuntimeExports } from "./index-D4lUgCCM.js";
import { B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-iyETJf1A.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const createProfile = useCreateUserProfile();
  const [name, setName] = reactExports.useState("");
  const [showNamePrompt, setShowNamePrompt] = reactExports.useState(false);
  const isAuthenticated = loginStatus === "success" || loginStatus === "idle" && identity !== void 0 && !identity.getPrincipal().isAnonymous();
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      if (!isProfileLoading && profile === null) {
        setShowNamePrompt(true);
      } else if (profile) {
        navigate("/");
      }
    }
  }, [isAuthenticated, profile, isProfileLoading, navigate]);
  reactExports.useEffect(() => {
    if (loginStatus === "loginError") {
      ue.error("Login failed. Please try again.");
    }
  }, [loginStatus]);
  const handleLogin = () => {
    if (loginStatus === "initializing") {
      ue.error("Still initializing, please wait a moment and try again.");
      return;
    }
    try {
      login();
    } catch (_error) {
      ue.error("Login failed. Please try again.");
    }
  };
  const handleCreateProfile = async () => {
    if (!name.trim()) {
      ue.error("Please enter your name");
      return;
    }
    try {
      await createProfile.mutateAsync(name.trim());
      ue.success("Profile created successfully!");
      navigate("/");
    } catch (_error) {
      ue.error("Failed to create profile. Please try again.");
    }
  };
  if (showNamePrompt) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border w-full max-w-md border-2 border-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "glow-text text-center font-display text-2xl", children: "Welcome to DJ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center text-muted-foreground", children: "Please tell me your name so I can address you properly." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Your name",
            value: name,
            onChange: (e) => setName(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleCreateProfile(),
            className: "border-primary/50 bg-card text-lg focus-visible:ring-primary",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleCreateProfile,
            disabled: createProfile.isPending,
            className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
            size: "lg",
            "data-ocid": "login.submit_button",
            children: createProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Creating Profile..."
            ] }) : "Continue"
          }
        )
      ] }) })
    ] }) });
  }
  const isButtonDisabled = loginStatus === "logging-in";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text mb-4 font-display text-6xl font-bold tracking-wider md:text-8xl", children: "DJ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground md:text-2xl", children: "Your Personal AI Assistant" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border w-full max-w-md border-2 border-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-center font-display text-2xl text-primary", children: "Access System" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center", children: "Secure decentralized authentication via Internet Identity" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleLogin,
            disabled: isButtonDisabled,
            className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
            size: "lg",
            "data-ocid": "login.primary_button",
            children: loginStatus === "initializing" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Initializing..."
            ] }) : loginStatus === "logging-in" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Connecting..."
            ] }) : "Login with Internet Identity"
          }
        ),
        loginStatus === "initializing" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-xs text-muted-foreground", children: "Loading authentication system..." }),
        loginStatus !== "logging-in" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-xs text-muted-foreground/70", children: "A secure login window will open. Allow popups if prompted." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2026. Built with love using caffeine.ai" }) })
  ] });
}
export {
  LoginPage
};
