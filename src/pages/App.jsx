import React, { useMemo, useRef, useState, useEffect } from "react";
import ImageTracer from "imagetracerjs";

const TRIAL_LIMIT = 2;

export default function App() {
  const [user, setUser] = useState(null);
  const [trialRemaining, setTrialRemaining] = useState(TRIAL_LIMIT);
  const [imgUrl, setImgUrl] = useState(null);
  const [svg, setSvg] = useState(null);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function verify() {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      const res = await fetch("/.netlify/functions/auth-verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    verify();
  }, []);

  const tracerOptions = useMemo(
    () => ({
      numberofcolors: 2,
      ltres: 1,
      qtres: 1,
      pathomit: 8,
      blurradius: 0,
      blurdelta: 20,
      scale: 1,
      viewbox: true,
    }),
    []
  );

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImgUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const trace = async () => {
    if (!imgUrl) return;
    if (trialRemaining <= 0) {
      alert("No trials left. Please contact admin.");
      return;
    }
    setBusy(true);

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const imgdata = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

    let svgStr = ImageTracer.imagedataToSVG(imgdata, tracerOptions);

    svgStr = svgStr
      .replace(/stroke="[^"]*"/g, 'stroke="none"')
      .replace(/fill="none"/g, "")
      .replace(/fill-rule="evenodd"/g, "");

    setSvg(svgStr);
    setBusy(false);

    const newTrials = trialRemaining - 1;
    setTrialRemaining(newTrials);
    localStorage.setItem("trialRemaining", newTrials.toString());
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engrave.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const goAdmin = () => {
    window.location.href = "/admin";
  };

  return (
    <div>
      <header className="header">
        <div className="container header-flex">
          <div className="brand">
            <h1>EngravePro Studio</h1>
            <div className="tag">Laser-Safe SVG Converter • v2.0</div>
          </div>
          <div className="header-right">
            <div className="tag">
              {user ? `Logged in as: ${user.email}` : "Checking login..."}
            </div>
            {user?.isAdmin && (
              <button className="btn" onClick={goAdmin}>
                Admin Dashboard
              </button>
            )}
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="card">
          <h3>Upload Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <button className="btn" onClick={trace} disabled={!imgUrl || busy}>
            {busy ? "Tracing…" : "Trace"}
          </button>
          <button className="btn" onClick={downloadSvg} disabled={!svg}>
            Download SVG
          </button>
          <p className="tag">Trials left: {trialRemaining}</p>

          <div style={{ marginTop: "1rem" }}>
            {imgUrl ? (
              <img
                ref={imgRef}
                src={imgUrl}
                alt="preview"
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <div>No image selected</div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
          {svg && (
            <div
              style={{ marginTop: "1rem" }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} EngravePro Studio — Laser-Safe Build
      </footer>
    </div>
  );
}