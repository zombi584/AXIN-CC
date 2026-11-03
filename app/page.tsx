"use client";

import { useRef, useState } from "react";

type BuildMode = "source" | "loader" | "standalone";

export default function Home() {
  const [source, setSource] = useState("-- AXIN.CC Luau Protection Workbench\n-- Paste your Luau source here to prepare a build.\n\nprint(\"Hello, AXIN\")\n");
  const [mode, setMode] = useState<BuildMode>("source");
  const [level, setLevel] = useState("strong");
  const [status, setStatus] = useState("就绪");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function importFile(file?: File) {
    if (!file) return;
    if (!/\.(lua|luau|txt)$/i.test(file.name)) { setStatus("文件格式不支持"); return; }
    if (file.size > 2 * 1024 * 1024) { setStatus("文件超过 2 MB 编辑器限制"); return; }
    setSource(await file.text());
    setOutput("");
    setStatus(`已导入 ${file.name}`);
  }

  async function build() {
    if (!source.trim()) { setStatus("请先输入 Luau 源码"); return; }
    setBusy(true);
    setStatus("正在提交构建请求…");
    setOutput("");
    try {
      const response = await fetch("/api/build", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source, mode, level }) });
      const data = await response.json();
      setStatus(data.message || "构建服务暂不可用");
      setOutput(data.error ? `构建未执行：${data.error}\n\n当前仓库尚未接入真实编译器与 VM。` : JSON.stringify(data, null, 2));
    } catch {
      setStatus("无法连接构建 API");
      setOutput("请确认本地开发服务或部署服务已启动。");
    } finally { setBusy(false); }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setStatus("输出已复制");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">A</span><span>AXIN<span className="muted">.CC</span><small>LUAU PROTECTION PLATFORM</small></span></a>
        <nav><a href="#workbench">工作台</a><a href="#architecture">架构路线</a><a href="https://github.com/zombi584/AXIN-CC" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
        <span className="version">EARLY ACCESS · 0.1.0</span>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="pulse" /> LUAU CODE SECURITY WORKSPACE</div>
        <h1>保护你的代码，<em>掌控每次构建。</em></h1>
        <p>面向 Luau 项目的代码保护工作台。以语义保持、兼容性验证和可审计构建为基础，逐步构建自研编译与运行时体系。</p>
        <div className="hero-meta"><span><i /> 独立项目工作区</span><span><i /> 构建状态透明</span><span><i /> 版本化架构</span></div>
      </section>

      <section className="workbench" id="workbench">
        <div className="section-head"><div><div className="eyebrow">01 / BUILD WORKSPACE</div><h2>代码工作台</h2></div><span className="status"><b /> {status}</span></div>
        <div className="workspace-grid">
          <div className="editor-panel panel">
            <div className="panel-head"><div><span className="dot purple" /> SOURCE.LUAU</div><div className="editor-actions"><button onClick={() => fileRef.current?.click()}>导入文件</button><button onClick={() => { setSource(""); setOutput(""); setStatus("编辑器已清空"); }}>清空</button><input ref={fileRef} type="file" accept=".lua,.luau,.txt,text/plain" hidden onChange={e => importFile(e.target.files?.[0])} /></div></div>
            <textarea spellCheck={false} value={source} onChange={e => setSource(e.target.value)} aria-label="Luau source editor" />
            <div className="editor-foot"><span>{source.length.toLocaleString()} CHARACTERS</span><span>UTF-8 · LUAU / LUA / TXT · MAX 2 MB</span></div>
          </div>
          <aside className="config-panel panel">
            <div className="panel-head">BUILD CONFIGURATION <span>⚙</span></div>
            <label>输出模式<select value={mode} onChange={e => setMode(e.target.value as BuildMode)}><option value="source">保护源码</option><option value="loader">在线 Loader</option><option value="standalone">独立打包</option></select></label>
            <label>保护配置<select value={level} onChange={e => setLevel(e.target.value)}><option value="balanced">均衡</option><option value="strong">强保护</option><option value="compat">兼容优先</option></select></label>
            <div className="config-note"><strong>构建安全提示</strong><p>真实编译服务接入前，页面不会伪造混淆结果。Loader 模式未来将使用 HTTPS、可撤销令牌与服务端签名。</p></div>
            <button className="build-button" disabled={busy} onClick={build}>{busy ? "处理中…" : "运行构建检查　→"}</button>
            <div className="small-note">当前版本：前端工作台 / 编译引擎未接入</div>
          </aside>
        </div>
        <div className="output-panel panel"><div className="panel-head"><div><span className="dot green" /> BUILD OUTPUT</div><button onClick={copyOutput} disabled={!output}>复制输出</button></div><pre>{output || "构建输出将在这里显示。\n\n提示：当前 API 会明确返回引擎未配置状态，不会生成虚假的保护代码。"}</pre></div>
      </section>

      <section className="roadmap" id="architecture"><div className="eyebrow">02 / ENGINEERING ROADMAP</div><h2>从工作台到自研引擎</h2><p className="roadmap-intro">按可验证的工程阶段推进，不用空壳功能冒充完整保护能力。</p>
        <div className="roadmap-grid">
          <article><span>PHASE 01</span><h3>Web 工作台</h3><p>源码编辑、文件导入、构建配置、结果展示与移动端适配。</p><small className="done">前端骨架已提交</small></article>
          <article><span>PHASE 02</span><h3>Luau 前端与 IR</h3><p>词法/语法解析、作用域分析、闭包与 Upvalue 建模、规范化中间表示。</p><small>待开发</small></article>
          <article><span>PHASE 03</span><h3>字节码与 VM</h3><p>版本化指令集、解释器、Verifier、资源限制与语义一致性测试。</p><small>待开发</small></article>
          <article><span>PHASE 04</span><h3>托管与授权</h3><p>隔离构建 Worker、签名产物、令牌撤销、用户项目隔离与审计。</p><small>待开发</small></article>
        </div>
      </section>
      <footer><span>AXIN.CC <b>·</b> BUILD WITH PRECISION</span><span>保护强度以测试结果为准，不承诺绝对不可逆向。</span></footer>
    </main>
  );
}
