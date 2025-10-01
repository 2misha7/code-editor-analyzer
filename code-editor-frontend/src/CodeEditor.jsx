import React, { useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";
import { diffLines } from "diff";

import { sampleCode, languageExtensions, snippets } from "./codeConfig";
import "../../../code-editor-analyzer/code-editor-frontend/src/App.css";

const CodeEditor = () => {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("// JavaScript sample code");
    const [history, setHistory] = useState([]);
    const [selectedCommit, setSelectedCommit] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analyzingCommitId, setAnalyzingCommitId] = useState(null);

    const hasUncommittedChanges =
        history.length === 0 || code !== history[history.length - 1].code;

    const handleCommit = () => {
        const lastCode = history.length ? history[history.length - 1].code : "";
        if (code === lastCode) return;

        const newCommit = { id: history.length, code };
        setHistory((prev) => [...prev, newCommit]);
        setSelectedCommit(history.length);
        setAiAnalysis("");
    };

    const handleAnalyzeCommit = async (commitId) => {
        const commit = history.find((c) => c.id === commitId);
        if (!commit) return;

        const baseCode = commitId === 0 ? "" : history[commitId - 1].code;

        setIsLoading(true);
        setAnalyzingCommitId(commitId);
        setAiAnalysis("");

        try {
            const response = await axios.post("/report", {
                initialCode: baseCode,
                modifiedCode: commit.code,
            });
            setAiAnalysis(response.data.content);
        } catch (error) {
            setAiAnalysis(`Error: ${error.response?.data || error.message}`);
        } finally {
            setIsLoading(false);
            setAnalyzingCommitId(null);
        }
    };

    const handleAnalyzeLastChanges = async () => {
        if (!hasUncommittedChanges) return;

        const lastCode = history.length ? history[history.length - 1].code : "";

        setIsLoading(true);
        setAnalyzingCommitId(null);
        setAiAnalysis("");


        try {
            const response = await axios.post("/report", {
                initialCode: lastCode,
                modifiedCode: code,
            });
            setAiAnalysis(response.data.content);
        } catch (error) {
            setAiAnalysis(`Error: ${error.response?.data || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getDiff = (oldStr, newStr) => {
        const diffs = diffLines(oldStr, newStr);
        return diffs.map((part, i) => (
            <span
                key={i}
                style={{
                    backgroundColor: part.added
                        ? "#2e4f2e"
                        : part.removed
                            ? "#4f2e2e"
                            : "#2a2a2a",
                    color: "#fff",
                    display: "block",
                    padding: "2px 6px",
                    fontFamily: "monospace",
                }}
            >
        {part.value}
      </span>
        ));
    };

    let diffToShow = "";
    if (selectedCommit !== null) {
        const commit = history[selectedCommit];
        const prevCode = selectedCommit === 0 ? "" : history[selectedCommit - 1].code;
        diffToShow = getDiff(prevCode, commit.code);
    }

    return (
        <div className="App">
            <div className="navbar">
                <select
                    value={language}
                    onChange={(e) => {
                        const newLang = e.target.value;
                        setLanguage(newLang);
                        setCode(`// ${newLang.charAt(0).toUpperCase() + newLang.slice(1)} sample code`);
                        setHistory([]);
                        setSelectedCommit(null);
                        setAiAnalysis("");
                    }}
                >
                    {Object.keys(sampleCode).map((lang) => (
                        <option key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="main-container">
                <div className="commit-history">
                    <h4>Commit History</h4>
                    {history.map((c) => (
                        <button
                            key={c.id}
                            className={selectedCommit === c.id ? "selected" : ""}
                            onClick={() => setSelectedCommit(c.id)}
                        >
                            Commit {c.id + 1}
                        </button>
                    ))}
                </div>

                <div className="editor-column">
                    <CodeMirror
                        value={code}
                        height="300px"
                        theme={oneDark}
                        extensions={[
                            languageExtensions[language],
                            keymap.of([indentWithTab]),
                            autocompletion({ override: [completeFromList(snippets[language])] }),
                        ]}
                        onChange={(value) => setCode(value)}
                        className="code-editor"
                    />

                    <div className="button-row">
                        <button className="button commit" onClick={handleCommit}>
                            Commit
                        </button>
                        {hasUncommittedChanges && (
                            <button
                                className="button analyze"
                                onClick={handleAnalyzeLastChanges}
                                disabled={isLoading}
                            >
                                {isLoading && analyzingCommitId === null ? "Analyzing..." : "Analyze Last Changes"}
                            </button>
                        )}
                    </div>

                    {/* Commit diff */}
                    {selectedCommit !== null && (
                        <div className="bottom-pane">
                            <h4>Changes in Commit {selectedCommit + 1}</h4>
                            <pre>{diffToShow}</pre>
                            <button
                                className="button analyze"
                                onClick={() => handleAnalyzeCommit(selectedCommit)}
                                disabled={isLoading}
                            >
                                {isLoading && analyzingCommitId === selectedCommit
                                    ? "Analyzing..."
                                    : `Analyze Commit ${selectedCommit + 1}`}
                            </button>
                        </div>
                    )}
                </div>

                <div className="ai-panel">
                    <div className="ai-panel-header">
                        {analyzingCommitId !== null
                            ? `AI Analysis for Commit ${analyzingCommitId + 1}`
                            : "AI Analysis for Latest Uncommitted Changes"}
                    </div>
                    <div className="ai-panel-content">
                        {aiAnalysis ? (
                            <textarea className="ai-textarea" value={aiAnalysis} readOnly />
                        ) : (
                            <div className="ai-placeholder">No AI analysis yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
