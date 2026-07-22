import { useState } from "react";
import "../styles/transfer.css";

interface transfer {
    sender_username: string;
}

function Transfer({sender_username} : transfer) {
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const token = localStorage.getItem("token")
    
    const handleSubmit = async () => {
        if (!receiver || !amount) return;
        setStatus("loading");

        try {
            const res = await fetch("http://localhost:5000/transfer", {
                method: "POST",
                
                headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    sender_username: sender_username,
                    receiver_username: receiver,
                    transferred_balance: Number(amount),
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
                <div className="success-title">Transfer complete</div>
                <div className="success-amt">EGP {Number(amount).toLocaleString()}</div>
                <div className="success-sub">
                    Sent to <strong>{receiver}</strong> successfully.
                </div>
                <button
                    className="submit-btn"
                    style={{ marginTop: "1.5rem" }}
                    onClick={() => {
                        setStatus("idle");
                        setReceiver("");
                        setAmount("");
                    }}
                >
                    Send another transfer
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="page-title">Transfer</div>
            <div className="page-sub">Send money to another Nile Bank user</div>

            <div className="form-card">
                <h2>Send money</h2>
                {status === "error" && (
                    <div className="error-msg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Transfer failed — insufficient balance or invalid recipient.
                    </div>
                )}

                <div className="field">
                    <label>From (your username)</label>
                    <input value={sender_username} disabled />
                </div>

                <div className="swap-row">
                    <div className="swap-line"></div>
                    <div className="swap-ico">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
                        </svg>
                    </div>
                    <div className="swap-line"></div>
                </div>

                <div className="field">
                    <label>To (recipient username)</label>
                    <input
                        placeholder="Receiver Username"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                    />
                </div>

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

                <div className="info-box">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Funds are verified before transfer. Insufficient balance will return a failure response.
                </div>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={status === "loading" || !receiver || !amount || !(parseInt(amount) > 0)}
                >
                    {status === "loading" ? (
                        "Sending..."    
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Send transfer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Transfer;