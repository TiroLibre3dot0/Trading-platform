import { useCallback, useEffect, useRef, useState } from "react";
import Card from "../components/common/Card";
import { getQlikConfig, listQlikApps, listQlikItems, pingQlik } from "../services/qlikApi";

type TabKey = "embed" | "api";

type QlikConfig = {
  host?: string;
  webIntegrationId?: string;
  appId?: string;
  apiKeySet?: boolean;
  ts?: string;
};

const EMBED_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/@qlik/embed-web-components@1.5.0/dist/index.min.js";

const QlikLab = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("embed");
  const [config, setConfig] = useState<QlikConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const [embedForm, setEmbedForm] = useState({ appId: "", objectId: "" });
  const [embedStatus, setEmbedStatus] = useState("Idle");
  const embedRef = useRef<HTMLDivElement | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const [apiState, setApiState] = useState<{
    loading: boolean;
    lastAction: string;
    lastError: string;
    lastResponse: unknown;
  }>({
    loading: false,
    lastAction: "",
    lastError: "",
    lastResponse: null,
  });

  useEffect(() => {
    setLoadingConfig(true);
    getQlikConfig()
      .then((data) => {
        setConfig(data);
        setEmbedForm((prev) => ({ ...prev, appId: data.appId || prev.appId }));
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load config";
        setConfigError(message);
      })
      .finally(() => setLoadingConfig(false));
  }, []);

  const ensureEmbedScript = useCallback(() => {
    if (window.customElements && window.customElements.get("qlik-embed")) {
      return Promise.resolve();
    }

    if (scriptRef.current) {
      if (scriptRef.current.dataset.loaded === "true") {
        return Promise.resolve();
      }
      return new Promise<void>((resolve, reject) => {
        scriptRef.current?.addEventListener("load", () => resolve(), { once: true });
        scriptRef.current?.addEventListener("error", () => reject(new Error("Failed to load Qlik embed script")), {
          once: true,
        });
      });
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = EMBED_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load Qlik embed script"));
      document.body.appendChild(script);
      scriptRef.current = script;
    });
  }, []);

  const handleRenderEmbed = useCallback(async () => {
    if (!embedForm.appId || !embedForm.objectId) {
      setEmbedStatus("Provide appId and objectId to render");
      return;
    }

    setEmbedStatus("Loading embed...");
    try {
      await ensureEmbedScript();
      if (!embedRef.current) return;
      embedRef.current.innerHTML = "";

      // Using the web component keeps us independent from SDK initialization code.
      const el = document.createElement("qlik-embed");
      if (config?.host) el.setAttribute("host", config.host);
      if (config?.webIntegrationId) el.setAttribute("web-integration-id", config.webIntegrationId);
      el.setAttribute("app-id", embedForm.appId);
      el.setAttribute("object-id", embedForm.objectId);
      el.setAttribute("style", "height:420px;width:100%;display:block;border-radius:16px;overflow:hidden;");

      embedRef.current.appendChild(el);
      setEmbedStatus("Embed rendered. If blank, double-check host, integration ID, and permissions.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to render embed";
      setEmbedStatus(`Failed: ${message}`);
    }
  }, [config?.host, config?.webIntegrationId, embedForm.appId, embedForm.objectId, ensureEmbedScript]);

  const runApiAction = useCallback(async (action: "ping" | "items" | "apps") => {
    setApiState((prev) => ({ ...prev, loading: true, lastAction: action, lastError: "" }));
    try {
      let response;
      if (action === "ping") response = await pingQlik();
      else if (action === "items") response = await listQlikItems();
      else response = await listQlikApps();

      setApiState({ loading: false, lastAction: action, lastError: "", lastResponse: response });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setApiState({ loading: false, lastAction: action, lastError: message, lastResponse: null });
    }
  }, []);

  return (
    <div className="section-shell py-10 space-y-8 text-white">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Labs</p>
        <h1 className="text-3xl font-semibold tracking-tight">Qlik Lab</h1>
        <p className="text-white/70 max-w-3xl">
          Prototype area to test Qlik embed and API flows without touching the production profile UI. The page reads
          configuration from env, loads the embed script once, and hits backend proxy endpoints.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {(["embed", "api"] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  activeTab === tab
                    ? "border-brand-400 bg-brand-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                {tab === "embed" ? "Embed test" : "API test"}
              </button>
            ))}
          </div>

          {activeTab === "embed" ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm text-white/80">
                  <span className="block text-xs uppercase tracking-[0.12em] text-white/50">App ID</span>
                  <input
                    value={embedForm.appId}
                    onChange={(e) => setEmbedForm((prev) => ({ ...prev, appId: e.target.value }))}
                    placeholder={config?.appId || "Enter app id"}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                  />
                </label>
                <label className="space-y-1 text-sm text-white/80">
                  <span className="block text-xs uppercase tracking-[0.12em] text-white/50">Object ID</span>
                  <input
                    value={embedForm.objectId}
                    onChange={(e) => setEmbedForm((prev) => ({ ...prev, objectId: e.target.value }))}
                    placeholder="Sheet or object id"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                <button
                  onClick={handleRenderEmbed}
                  className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white shadow-[0_10px_30px_rgba(0,102,255,0.25)] hover:translate-y-[-1px] transition"
                >
                  Render embed
                </button>
                <span className="text-white/60">{embedStatus}</span>
              </div>

              <div
                ref={embedRef}
                className="min-h-[320px] rounded-xl border border-white/10 bg-gradient-to-b from-white/5 via-[#0d1733]/60 to-[#050b18]"
              />

              <p className="text-xs text-white/60">
                Uses @qlik/embed-web-components (script loaded once). Host and webIntegrationId come from env; provide
                appId and objectId to target a sheet or chart.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => runApiAction("ping")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/15 bg-white/5 hover:border-brand-400/60 transition"
                  disabled={apiState.loading}
                >
                  Ping
                </button>
                <button
                  onClick={() => runApiAction("items")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/15 bg-white/5 hover:border-brand-400/60 transition"
                  disabled={apiState.loading}
                >
                  List items
                </button>
                <button
                  onClick={() => runApiAction("apps")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/15 bg-white/5 hover:border-brand-400/60 transition"
                  disabled={apiState.loading}
                >
                  List apps
                </button>
                {apiState.loading && <span className="text-sm text-white/60">Loading...</span>}
              </div>

              {apiState.lastAction && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white/80">{apiState.lastAction}</span>
                    {apiState.lastError ? (
                      <span className="text-rose-300">{apiState.lastError}</span>
                    ) : (
                      <span className="text-emerald-200">OK</span>
                    )}
                  </div>
                  <pre className="max-h-[320px] overflow-auto rounded-lg border border-white/10 bg-black/50 p-3 text-xs text-emerald-100/90">
                    {apiState.lastResponse ? JSON.stringify(apiState.lastResponse, null, 2) : "No response yet."}
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Config</p>
              <h2 className="text-xl font-semibold text-white">Env snapshot</h2>
            </div>
            {loadingConfig && <span className="text-xs text-white/60">Loading...</span>}
          </div>

          {configError && <div className="text-sm text-rose-300">{configError}</div>}

          <div className="space-y-2 text-sm text-white/80">
            <ConfigRow label="Host" value={config?.host || "Not set"} />
            <ConfigRow label="Web integration ID" value={config?.webIntegrationId || "Not set"} />
            <ConfigRow label="Default app ID" value={config?.appId || "Not set"} />
            <ConfigRow label="API key set" value={config?.apiKeySet ? "Yes (hidden)" : "No"} />
            {config?.ts && <ConfigRow label="Loaded" value={config.ts} />}
          </div>

          <p className="text-xs text-white/60">
            Values come from backend env (QLIK_HOST, QLIK_WEB_INTEGRATION_ID, QLIK_APP_ID, QLIK_API_KEY). API keys are
            never returned; only a boolean is shown here.
          </p>
        </Card>
      </div>
    </div>
  );
};

const ConfigRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
    <span className="text-white/60 text-xs uppercase tracking-[0.12em]">{label}</span>
    <span className="text-white text-sm text-right max-w-[240px] truncate" title={value}>
      {value}
    </span>
  </div>
);

export default QlikLab;
