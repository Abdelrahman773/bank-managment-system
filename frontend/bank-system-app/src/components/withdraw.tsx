import { useState } from "react";
import "../styles/withdraw.css";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];
interface withdraw {
    balance:number;
}
function Withdraw({balance}:withdraw) {
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const parsedAmount = Number(amount);
    const exceedsBalance = parsedAmount > balance;
    const token = localStorage.getItem("token")


    const handleSubmit = async () => {
        if (!amount || exceedsBalance) return;
        setStatus("loading");

        try {
            const res = await fetch("http://127.0.0.1:5000/get_withdraw", {
                method: "POST",
                headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
                body: JSON.stringify({
                    amount: parsedAmount,
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
                <div className="success-title">Withdrawal complete</div>
                <div className="success-amt">−EGP {parsedAmount.toLocaleString()}</div>
                <div className="success-sub">
                    Your balance has been updated.
                </div>
                <button
                    className="submit-btn"
                    style={{ marginTop: "1.5rem" }}
                    onClick={() => {
                        setStatus("idle");
                        setAmount(amount);
                    }}
                >
                    Make another withdrawal
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="page-title">Withdraw</div>
            <div className="page-sub">Cash out from your account</div>

            <div className="two-col">
                <div>
                    <div className="form-card">
                        <h2>Cash out</h2>

                        {status === "error" && (
                            <div className="error-msg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                Withdrawal failed. Please try again.
                            </div>
                        )}

                        {exceedsBalance && amount && (
                            <div className="warn-box">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                Amount exceeds your available balance of EGP {balance.toLocaleString()}.
                            </div>
                        )}

                        <div className="field">
                            <label>Amount (EGP)</label>
                            <input
                                className={`amount ${exceedsBalance && amount ? "warn" : ""}`}
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
                                    className={`qa-chip ${parsedAmount === qa ? "active" : ""}`}
                                    onClick={() => setAmount(qa.toString())}
                                >
                                    −{qa.toLocaleString()}
                                </div>
                            ))}
                        </div>

                        <div className="info-box">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            Balance cannot go below zero. Withdrawals are processed instantly.
                        </div>

                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={status === "loading" || !amount || exceedsBalance || !(parseInt(amount) > 0)}
                        >
                            {status === "loading" ? (
                                "Processing..."
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 17V7m-5 5l5-5 5 5" />
                                    </svg>
                                    Confirm withdrawal
                                </>
                            )}
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Withdraw;