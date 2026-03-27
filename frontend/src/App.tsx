import NavDock from "./components/NavDock";
import HeroSection from "./components/HeroSection";
import FeatureGrid from "./components/FeatureGrid";
import DeviceStrip from "./components/DeviceStrip";
import FlowPanel from "./components/FlowPanel";
import FooterBar from "./components/FooterBar";
import AuthPanel from "./components/AuthPanel";
import DashboardPanel from "./components/DashboardPanel";
import { useEffect, useMemo, useState } from "react";
import {
  deleteFile,
  getFiles,
  getGoogleAuthUrl,
  loginUser,
  refreshToken,
  registerUser,
  uploadFile,
  type AuthUser,
  type FileItem
} from "./lib/api";

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [status, setStatus] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const isLoggedIn = useMemo(() => Boolean(user && accessToken), [user, accessToken]);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const refreshed = await refreshToken();
        setAccessToken(refreshed.accessToken);
        setStatus("Session restored from refresh token.");
      } catch {
        setAccessToken(null);
      }
    };
    void hydrateSession();
  }, []);

  const handleRegister = async (payload: { tenantId: string; name: string; email: string; password: string }) => {
    setLoadingAuth(true);
    setAuthError("");
    try {
      await registerUser(payload);
      setStatus("Account created. Please login now.");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Register failed");
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogin = async (payload: { tenantId: string; email: string; password: string }) => {
    setLoadingAuth(true);
    setAuthError("");
    try {
      const result = await loginUser(payload);
      setUser(result.user);
      setAccessToken(result.accessToken);
      setStatus("Login successful.");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoadingAuth(false);
    }
  };

  const withToken = async <T,>(task: (token: string) => Promise<T>) => {
    if (!accessToken) throw new Error("Please login first.");
    try {
      return await task(accessToken);
    } catch (error) {
      if (error instanceof Error && /unauthorized|invalid token|refresh/i.test(error.message)) {
        const refreshed = await refreshToken();
        setAccessToken(refreshed.accessToken);
        return task(refreshed.accessToken);
      }
      throw error;
    }
  };

  const loadFiles = async () => {
    if (!isLoggedIn) return;
    setLoadingFiles(true);
    try {
      const list = await withToken((token) => getFiles(token));
      setFiles(list);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to fetch files");
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) void loadFiles();
  }, [isLoggedIn]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; provider?: string } | null;
      if (!data || data.type !== "oauth-connected") return;

      if (data.provider === "google") {
        setStatus("Google connected. Loading files...");
        void loadFiles();
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loadFiles]);

  const handleConnectGoogle = async () => {
    try {
      const data = await withToken((token) => getGoogleAuthUrl(token));

      // Open OAuth flow in a popup so the user doesn't lose the app state.
      const width = 820;
      const height = 720;
      const left = Math.max(0, Math.round((window.screen.width - width) / 2));
      const top = Math.max(0, Math.round((window.screen.height - height) / 2));

      const popup = window.open(
        data.url,
        "google-oauth",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=1`
      );

      if (!popup) {
        // Popup blockers: fallback to a full redirect.
        window.location.href = data.url;
        return;
      }

      setStatus("Connecting Google...");
      popup.focus();

      // Fallback: if the popup is closed manually, refresh.
      const timer = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(timer);
          void loadFiles();
        }
      }, 800);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to connect provider");
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      await withToken((token) => uploadFile(token, file));
      setStatus("File uploaded.");
      await loadFiles();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await withToken((token) => deleteFile(token, fileId));
      setStatus("File deleted.");
      await loadFiles();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    setStatus("Logged out.");
  };

  return (
    <div className="app-shell">
      <NavDock />
      <main>
        <HeroSection />
        {!isLoggedIn ? (
          <>
            <AuthPanel loading={loadingAuth} onLogin={handleLogin} onRegister={handleRegister} error={authError} />
            <FeatureGrid />
            <DeviceStrip />
            <FlowPanel />
          </>
        ) : user ? (
          <DashboardPanel
            user={user}
            files={files}
            status={status}
            loadingFiles={loadingFiles}
            onRefreshFiles={loadFiles}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
            onConnectGoogle={handleConnectGoogle}
            onLogout={handleLogout}
          />
        ) : null}
      </main>
      <FooterBar />
    </div>
  );
};

export default App;
