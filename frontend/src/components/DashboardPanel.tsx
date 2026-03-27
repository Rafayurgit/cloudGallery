import type { AuthUser, FileItem } from "../lib/api";

type DashboardPanelProps = {
  user: AuthUser;
  files: FileItem[];
  status: string;
  loadingFiles: boolean;
  onRefreshFiles: () => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onConnectGoogle: () => Promise<void>;
  onLogout: () => void;
};

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const DashboardPanel = ({
  user,
  files,
  status,
  loadingFiles,
  onRefreshFiles,
  onUploadFile,
  onDeleteFile,
  onConnectGoogle,
  onLogout
}: DashboardPanelProps) => {
  return (
    <section className="section-block">
      <div className="dashboard-head surface-card">
        <div>
          <p className="eyebrow">Signed in</p>
          <h2>{user.name}</h2>
          <p className="meta-copy">
            {user.email} - {user.plan} plan
          </p>
        </div>
        <div className="dashboard-head__actions">
          <button className="btn" type="button" onClick={onConnectGoogle}>
            Connect Google
          </button>
          <button className="btn" type="button" onClick={onRefreshFiles}>
            Refresh files
          </button>
          <button className="btn" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="surface-card">
        <label className="upload-row">
          <span>Upload file</span>
          <input
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUploadFile(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
        {status ? <p className="status-line">{status}</p> : null}
      </div>

      <div className="surface-card">
        <h3>Your files</h3>
        {loadingFiles ? (
          <p className="meta-copy">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="meta-copy">No files yet. Connect Google and upload your first file.</p>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <li key={file._id} className="file-list__item">
                <div>
                  <strong>{file.fileName}</strong>
                  <p className="meta-copy">
                    {file.provider} - {formatBytes(file.size)}
                  </p>
                </div>
                <button className="btn" type="button" onClick={() => void onDeleteFile(file._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default DashboardPanel;
