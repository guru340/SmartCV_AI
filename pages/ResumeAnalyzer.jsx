import { useState } from "react";

import {
  Upload, Button, Tabs, Typography,
  Input, Divider, Alert, Spin, Row, Col, message,
} from "antd";
import {
  InboxOutlined, FileTextOutlined, RocketOutlined,
  CheckCircleOutlined, CloseCircleOutlined, BulbOutlined,
  ClearOutlined, ThunderboltOutlined, TrophyOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";

const { Dragger } = Upload;
const { TextArea } = Input;

const API_BASE = "https://smartcv-aii.onrender.com/api/resume";
const BLUE = "#1565C0";
const BLUE_LIGHT = "#E3F0FF";
const BLUE_MID = "#1976D2";

function safeParseJson(raw) {
  if (!raw) return null;
  try {
    const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(clean);
  } catch { return null; }
}

function Navbar() {
  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #e8edf3",
      padding: "0 32px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 8px rgba(21,101,192,0.07)",
    }}>
      <img
        src="logo (2).png"
        alt="SmartCV AI"
        style={{ height: 44, objectFit: "contain", display: "block" }}
      />
      <div style={{
        background: BLUE_LIGHT,
        color: BLUE,
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 14px",
        borderRadius: 20,
        letterSpacing: "0.03em",
      }}>
        AI Powered
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${BLUE} 0%, #1976D2 60%, #42A5F5 100%)`,
      padding: "52px 32px 44px",
      textAlign: "center",
      color: "#fff",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", opacity: 0.8, marginBottom: 14, textTransform: "uppercase" }}>
        Smart Resume Intelligence
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 700, margin: "0 0 14px", color: "#fff", lineHeight: 1.2 }}>
        Analyze &amp; Optimize Your Resume
      </h1>
      <p style={{ fontSize: 15, opacity: 0.88, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.65 }}>
        Get AI-powered insights, skill extraction, quality scores, and ATS compatibility checks in seconds.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
        {[
          { icon: <ThunderboltOutlined />, label: "Instant Analysis" },
          { icon: <TrophyOutlined />, label: "Quality Score" },
          { icon: <CheckCircleOutlined />, label: "ATS Check" },
        ].map(({ icon, label }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 7,
            fontSize: 13, opacity: 0.92,
            background: "rgba(255,255,255,0.13)",
            padding: "7px 16px", borderRadius: 24,
          }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreGauge({ score, label }) {
  const numeric = typeof score === "number" ? score : parseFloat(score);
  const pct = isNaN(numeric) ? 0 : Math.round((numeric / 10) * 100);
  const color = pct >= 70 ? "#22C55E" : pct >= 50 ? "#F59E0B" : "#EF4444";
  const grade = pct >= 80 ? "Excellent" : pct >= 70 ? "Very Good" : pct >= 50 ? "Average" : "Needs Work";
  const gradeBg = pct >= 70 ? "#DCFCE7" : pct >= 50 ? "#FEF9C3" : "#FEE2E2";
  const gradeColor = pct >= 70 ? "#166534" : pct >= 50 ? "#92400E" : "#991B1B";

  return (
    <div style={{ textAlign: "center" }}>
      <Progress
        type="circle"
        percent={pct}
        format={() => (
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>
              {isNaN(numeric) ? "—" : numeric}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>/10</div>
          </div>
        )}
        strokeColor={color}
        trailColor="#F1F5F9"
        strokeWidth={8}
        size={130}
      />
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{label}</div>
        <span style={{
          display: "inline-block", marginTop: 5,
          background: gradeBg, color: gradeColor,
          fontSize: 11, fontWeight: 600, padding: "2px 12px", borderRadius: 20,
        }}>
          {grade}
        </span>
      </div>
    </div>
  );
}

function RawFallback({ raw }) {
  return (
    <div style={{
      marginTop: 20, background: "#fff", border: "1px solid #E2E8F0",
      borderRadius: 16, padding: "20px 24px",
    }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: "#64748b", marginBottom: 10 }}>AI Response</div>
      <pre style={{
        background: "#F8FAFC", border: "1px solid #E2E8F0",
        padding: 14, borderRadius: 8, fontSize: 12,
        overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#475569",
      }}>
        {raw}
      </pre>
    </div>
  );
}

function AnalyzeResult({ raw }) {
  const parsed = safeParseJson(raw);
  if (!parsed) return <RawFallback raw={raw} />;

  const score = parsed.overallScore ?? parsed.score ?? parsed.quality ?? parsed.rating ?? parsed.overallQuality ?? "—";
  const skills = parsed.skills ?? parsed.keySkills ?? parsed.extractedSkills ?? [];
  const improvements = parsed.improvements ?? parsed.suggestions ?? parsed.recommendedImprovements ?? [];

  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Score + Skills */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
        <div style={{
          background: "linear-gradient(90deg, #EFF6FF 0%, #F0FDF4 100%)",
          padding: "18px 24px", borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <TrophyOutlined style={{ color: BLUE, fontSize: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>Resume Analysis Result</span>
        </div>
        <div style={{ padding: "28px 24px" }}>
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} sm={8} style={{ textAlign: "center" }}>
              <ScoreGauge score={score} label="Overall Score" />
            </Col>
            {skills.length > 0 && (
              <Col xs={24} sm={16}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: BLUE_LIGHT,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FileTextOutlined style={{ color: BLUE, fontSize: 14 }} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>Extracted Skills</span>
                  <span style={{
                    background: BLUE_LIGHT, color: BLUE,
                    fontSize: 11, fontWeight: 700, padding: "1px 9px", borderRadius: 20,
                  }}>
                    {skills.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{
                      background: BLUE_LIGHT, color: BLUE,
                      border: "1px solid #BFDBFE",
                      fontSize: 12, fontWeight: 500,
                      padding: "4px 11px", borderRadius: 7,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>

      {/* Improvements */}
      {improvements.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(90deg, #FFFBEB 0%, #FFF7ED 100%)",
            padding: "18px 24px", borderBottom: "1px solid #FEF3C7",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <BulbOutlined style={{ color: "#D97706", fontSize: 16 }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>Suggested Improvements</span>
          </div>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {improvements.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "12px 16px",
                background: i % 2 === 0 ? "#FAFAFA" : "#fff",
                border: "1px solid #F1F5F9",
                borderRadius: 10,
              }}>
                <div style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${BLUE} 0%, #42A5F5 100%)`,
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 1, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>
                  {typeof item === "string" ? item : item.suggestion ?? JSON.stringify(item)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AtsResult({ raw }) {
  const parsed = safeParseJson(raw);
  if (!parsed) return <RawFallback raw={raw} />;

  const score = parsed.atsScore ?? parsed.score ?? "—";
  const matched = parsed.matchedKeywords ?? parsed.matched ?? [];
  const missing = parsed.missingKeywords ?? parsed.missing ?? [];
  const summary = parsed.summary ?? "";
  const numeric = parseFloat(score);
  const pct = isNaN(numeric) ? 0 : Math.round((numeric / 10) * 100);

  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Score + Summary */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
        <div style={{
          background: "linear-gradient(90deg, #EFF6FF 0%, #F0FDF4 100%)",
          padding: "18px 24px", borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <RocketOutlined style={{ color: BLUE, fontSize: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>ATS Compatibility Report</span>
        </div>
        <div style={{ padding: "28px 24px" }}>
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} sm={8} style={{ textAlign: "center" }}>
              <ScoreGauge score={score} label="ATS Score" />
              <div style={{ marginTop: 14, background: "#F1F5F9", borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`, height: "100%", borderRadius: 99,
                  background: pct >= 70 ? "#22C55E" : pct >= 50 ? "#F59E0B" : "#EF4444",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>{pct}% match rate</div>
            </Col>
            {summary && (
              <Col xs={24} sm={16}>
                <div style={{ fontWeight: 600, fontSize: 12, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Summary
                </div>
                <p style={{
                  margin: 0, fontSize: 13, lineHeight: 1.7, color: "#374151",
                  padding: "14px 18px",
                  background: "#F8FAFF",
                  borderLeft: `3px solid ${BLUE}`,
                  borderRadius: "0 10px 10px 0",
                }}>
                  {summary}
                </p>
              </Col>
            )}
          </Row>
        </div>
      </div>

      {/* Keywords */}
      <Row gutter={[16, 16]}>
        {matched.length > 0 && (
          <Col xs={24} md={12}>
            <div style={{
              background: "#fff", border: "1px solid #BBF7D0",
              borderRadius: 16, overflow: "hidden",
            }}>
              <div style={{
                background: "#F0FDF4", padding: "14px 20px",
                borderBottom: "1px solid #BBF7D0",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <CheckCircleOutlined style={{ color: "#16A34A", fontSize: 14 }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: "#166534" }}>Matched Keywords</span>
                <span style={{
                  marginLeft: "auto", background: "#DCFCE7", color: "#166534",
                  fontSize: 11, fontWeight: 700, padding: "1px 9px", borderRadius: 20,
                }}>
                  {matched.length}
                </span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 7 }}>
                {matched.map((k, i) => (
                  <span key={i} style={{
                    background: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0",
                    fontSize: 12, fontWeight: 500, padding: "4px 11px", borderRadius: 7,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <CheckCircleOutlined style={{ fontSize: 10 }} /> {k}
                  </span>
                ))}
              </div>
            </div>
          </Col>
        )}
        {missing.length > 0 && (
          <Col xs={24} md={12}>
            <div style={{
              background: "#fff", border: "1px solid #FECACA",
              borderRadius: 16, overflow: "hidden",
            }}>
              <div style={{
                background: "#FFF5F5", padding: "14px 20px",
                borderBottom: "1px solid #FECACA",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <CloseCircleOutlined style={{ color: "#DC2626", fontSize: 14 }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: "#991B1B" }}>Missing Keywords</span>
                <span style={{
                  marginLeft: "auto", background: "#FEE2E2", color: "#991B1B",
                  fontSize: 11, fontWeight: 700, padding: "1px 9px", borderRadius: 20,
                }}>
                  {missing.length}
                </span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 7 }}>
                {missing.map((k, i) => (
                  <span key={i} style={{
                    background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA",
                    fontSize: 12, fontWeight: 500, padding: "4px 11px", borderRadius: 7,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <CloseCircleOutlined style={{ fontSize: 10 }} /> {k}
                  </span>
                ))}
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

function FileUploadZone({ onFileChange, file }) {
  return (
    <Dragger
      name="file" multiple={false} accept=".pdf,.docx,.doc,.txt"
      beforeUpload={(f) => { onFileChange(f); return false; }}
      onRemove={() => onFileChange(null)}
      fileList={file ? [{ uid: "-1", name: file.name, status: "done" }] : []}
      maxCount={1}
      style={{ borderRadius: 12 }}
    >
      <div style={{ padding: "10px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: BLUE_LIGHT, margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <InboxOutlined style={{ fontSize: 26, color: BLUE }} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 5px" }}>
          Drop your resume here
        </p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
          or <span style={{ color: BLUE, fontWeight: 600 }}>click to browse</span> — PDF, DOCX, TXT
        </p>
      </div>
    </Dragger>
  );
}

function LoadingCard({ tip }) {
  return (
    <div style={{
      marginTop: 20, background: "#fff", border: "1px solid #E2E8F0",
      borderRadius: 16, padding: "44px 24px", textAlign: "center",
    }}>
      <Spin size="large" />
      <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", marginTop: 16, marginBottom: 4 }}>{tip}</div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>This may take a few seconds…</div>
    </div>
  );
}

const btnStyle = {
  height: 42, paddingInline: 24, borderRadius: 10, fontWeight: 600,
  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)`,
  border: "none", fontSize: 13,
};

function AnalyzeTab() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: fd });
      if (!res.ok) { const t = await res.text(); throw new Error(`Server error ${res.status}: ${t}`); }
      const data = await res.json();
      setResult(data.answer);
      message.success("Analysis complete!");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "0 0 16px 16px", padding: 24 }}>
        <FileUploadZone onFileChange={setFile} file={file} />
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <Button type="primary" icon={<FileTextOutlined />} onClick={handleAnalyze}
            disabled={!file || loading} loading={loading} style={btnStyle}>
            Analyze Resume
          </Button>
          <Button icon={<ClearOutlined />} disabled={loading}
            onClick={() => { setFile(null); setResult(null); setError(null); }}
            style={{ height: 42, borderRadius: 10, fontSize: 13 }}>
            Clear
          </Button>
        </div>
      </div>
      {loading && <LoadingCard tip="Analyzing your resume with AI..." />}
      {error && <Alert type="error" message="Error" description={error} style={{ marginTop: 16, borderRadius: 12 }} showIcon />}
      {result && !loading && <AnalyzeResult raw={result} />}
    </div>
  );
}

function AtsTab() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!file || !jd.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("jd", jd);
      const res = await fetch(`${API_BASE}/ats-check`, { method: "POST", body: fd });
      if (!res.ok) { const t = await res.text(); throw new Error(`Server error ${res.status}: ${t}`); }
      const data = await res.json();
      setResult(data.answer);
      message.success("ATS check complete!");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "0 0 16px 16px", padding: 24 }}>
        <FileUploadZone onFileChange={setFile} file={file} />
        <div style={{ marginTop: 22 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#374151",
            marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE, display: "inline-block" }} />
            Job Description
          </div>
          <TextArea value={jd} onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here to check how well your resume matches…"
            rows={5} style={{ borderRadius: 10, fontSize: 13, borderColor: "#E2E8F0", resize: "none" }}
          />
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <Button type="primary" icon={<RocketOutlined />} onClick={handleCheck}
            disabled={!file || !jd.trim() || loading} loading={loading} style={btnStyle}>
            Check ATS Score
          </Button>
          <Button icon={<ClearOutlined />} disabled={loading}
            onClick={() => { setFile(null); setJd(""); setResult(null); setError(null); }}
            style={{ height: 42, borderRadius: 10, fontSize: 13 }}>
            Clear
          </Button>
        </div>
      </div>
      {loading && <LoadingCard tip="Running ATS compatibility check..." />}
      {error && <Alert type="error" message="Error" description={error} style={{ marginTop: 16, borderRadius: 12 }} showIcon />}
      {result && !loading && <AtsResult raw={result} />}
    </div>
  );
}

export default function ResumeAnalyzer() {
  const tabItems = [
    {
      key: "analyze",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 500, padding: "4px 0" }}>
          <FileTextOutlined /> Resume Analysis
        </span>
      ),
      children: <AnalyzeTab />,
    },
    {
      key: "ats",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 500, padding: "4px 0" }}>
          <RocketOutlined /> ATS Check
        </span>
      ),
      children: <AtsTab />,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <Navbar />
      <Hero />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 20px 72px" }}>
        <Tabs
          defaultActiveKey="analyze"
          items={tabItems}
          size="large"
          tabBarStyle={{
            background: "#fff",
            borderRadius: "16px 16px 0 0",
            paddingInline: 20,
            borderBottom: "1px solid #E2E8F0",
            marginBottom: 0,
          }}
        />
      </div>
    </div>
  );
}
