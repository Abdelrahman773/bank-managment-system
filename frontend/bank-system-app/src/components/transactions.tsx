import { useState } from "react";
import "../styles/transactions.css";

interface Transaction {
    to_username: string;
    from_username: string;
    transfared_balance: number;
}

interface TransactionsProps {
    username: string;
    transactions_data: Transaction[];
}
const PAGE_SIZE = 5;

function Transactions({username,transactions_data}:TransactionsProps) {
    
    const transactions = transactions_data;
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"all" | "received" | "sent">("all");
    const [page, setPage] = useState(1);

  

    const filtered = transactions
        .filter((tx) => {
            if (tab === "received") return tx.to_username === username;
            if (tab === "sent") return tx.from_username === username;
            return true;
        })
        .filter((tx) => {
            const term = search.toLowerCase();
            return (
                tx.to_username.toLowerCase().includes(term) ||
                tx.from_username.toLowerCase().includes(term) ||
                tx.transfared_balance.toString().includes(term)
            );
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <div className="page-title">Transactions</div>
            <div className="section-card">
                <div className="tabs">
                    {(["all", "received", "sent"] as const).map((t) => (
                        <div
                            key={t}
                            className={`tab ${tab === t ? "active" : ""}`}
                            onClick={() => {
                                setTab(t);
                                setPage(1);
                            }}
                        >
                            {t === "all" ? "All" : t === "received" ? "Received" : "Sent"}
                        </div>
                    ))}
                </div>

                <div className="search-row">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="search-input"
                        placeholder="Search by username or amount…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-ico">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6" />
                                <line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" />
                                <line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" />
                                <line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                        </div>
                        <div className="empty-title">No transactions found</div>
                        <div className="empty-sub">Try adjusting your search or filters</div>
                    </div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>To</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((tx, i) => {
                                    const isCredit = tx.to_username === username;
                                    return (
                                        <tr key={i}>
                                           
                                            <td>
                                                <div className="cell-user">
                                                    <div className="cell-av">
                                                        {tx.to_username.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    {tx.to_username}
                                                </div>
                                            </td>
                                            <td className={`cell-amt ${isCredit ? "cr" : "db"}`}>
                                                {isCredit ? "+" : "−"}
                                                {tx.transfared_balance.toLocaleString()} EGP
                                            </td>
                                            <td>
                                                <span className={`chip ${isCredit ? "success" : "fail"}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                    {isCredit ? "Received" : "Sent"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <div className="page-info">
                                Showing {paginated.length} of {filtered.length} transactions
                            </div>
                            <div className="page-btns">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <div
                                        key={p}
                                        className={`page-btn ${page === p ? "active" : ""}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Transactions;