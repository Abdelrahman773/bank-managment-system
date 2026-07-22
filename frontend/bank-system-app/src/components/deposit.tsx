import { useState } from "react";
import "../styles/deposit.css";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

function Deposit() {
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async () => {
        if (!amount) return;
        setStatus("loading");
        const token = localStorage.getItem("token")
        try {
            const res = await fetch("http://127.0.0.1:5000/get_deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}`},
                body: JSON.stringify({
                    balance: Number(amount),
                }),
            });


            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="success-card">
                <div className="success-ico">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <div className="success-title">Deposit complete</div>
                <div className="success-amt">+EGP {Number(amount).toLocaleString()}</div>
                <div className="success-sub">
                    Your balance has been updated.
                </div>
                <button
                    className="submit-btn"
                    style={{ marginTop: "1.5rem" }}
                    onClick={() => {
                        setStatus("idle");
                        setAmount("");
                    }}
                >
                    Make another deposit
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="page-title">Deposit</div>
            <div className="page-sub">Add funds to your account</div>

            <div className="form-card">
                <h2>Add funds</h2>
                {status === "error" && (
                    <div className="error-msg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Deposit failed. Please try again.
                    </div>
                )}
                <div className="field">
                    <label>Amount (EGP)</label>
                    <input
                        className="amount"
                        placeholder="0.00"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="quick-amounts">
                    {QUICK_AMOUNTS.map((qa) => (
                        <div
                            key={qa}
                            className={`qa-chip ${Number(amount) === qa ? "active" : ""}`}
                            onClick={() => setAmount(qa.toString())}
                        >
                            +{qa.toLocaleString()}
                        </div>
                    ))}
                </div>

                <div className="info-box">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Funds are added immediately and reflected in your available balance.
                </div>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={status === "loading" || !amount || !(parseInt(amount) > 0)}
                >
                    {status === "loading" ? (
                        "Processing..."
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v10m-5-5l5 5 5-5" />
                            </svg>
                            Confirm deposit
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Deposit;