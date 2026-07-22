import "../styles/overview.css";



interface Transaction {
    to_username:string;
    from_username:string;
    transfared_balance:number;
    
}

interface dashboard_info {
    username: string;
    balance: number;
    firstname:string;
    transactions_data:Transaction[];
}

function Overview({ firstname,username, balance, transactions_data}: dashboard_info) {    
    const transactions = transactions_data;
    return (
        <div>
            <div className="page-title">Hello, {firstname.toUpperCase()}</div>
            <div className="page-sub">Personal account</div>

            <div className="balance-hero">
                <div className="bh-label">Available balance</div>
                <div className="bh-amount">
                    <span>EGP</span>
                    {balance !== null ? balance : ""}
                </div>
                <div className="bh-row">

    <div className="bh-stat">
        <div className="bsl">Total received</div>
        <div className="bsv up">
            {transactions_data
                .filter(tx => tx.from_username !== username)
                .reduce((sum, tx) => sum + tx.transfared_balance, 0)}{" "}
            EGP
        </div>
    </div>
    <div className="bh-stat">
        <div className="bsl">Total sent</div>
        <div className="bsv dn">
            {transactions_data
                .filter(tx => tx.from_username === username)
                .reduce((sum, tx) => sum + tx.transfared_balance, 0)}{" "}
            EGP
        </div>
    </div>
    <div className="bh-stat">
        <div className="bsl">Username</div>
        <div className="bsv">{username}</div>
    </div>
</div>
            </div>


            <div className="tx-card">
                <div className="tx-head">
                    <div className="tx-title">Recent transactions</div>
                    </div>

                {transactions.length === 0 && (
                    <div className="tx-empty">No transactions yet</div>
                )}

                {(transactions.length > 4? transactions.slice(0,4) : transactions).map((tx, i) => {
                        const isDebit = tx.from_username != username;
                    return (
                        <div className="tx-item" key={i}>
                            <div className={`tx-ico ${isDebit ? "g" : "r"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {isDebit ? (
                                        <>
                                        <line x1="19" y1="5" x2="5" y2="19" />
                                        <polyline points="5 12 5 19 12 19" />
                                        </>
                                    ) : (
                                        <><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/></>
                                    )}
                                </svg>
                            </div>
                            <div className="tx-info">
                                <div className="tx-name">
                                    {isDebit ? `From ${tx.from_username}` : `To ${tx.to_username}`}
                                </div>
                                <div className="tx-date">Recent</div>
                            </div>
                            <div className={`tx-amt ${isDebit ? "cr" : "db"}`}>
                                {isDebit ? "+" : "−"}{tx.transfared_balance}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Overview;