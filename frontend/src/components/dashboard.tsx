import NavBar from "./NavBar";
import { useState } from "react";
import "../styles/dashboard.css";
import Overview from "./overview";
import Transfer from "./transfer";
import Transactions from "./transactions";
import Deposit from "./deposit";
import { useEffect } from "react";
import Withdraw from "./withdraw";

interface DashboardData {
    username: string;
    firstname: string;
    balance:number;
}

interface Transaction  {
    to_username:string;
    from_username:string;
    transfared_balance:number;
}



function Dashboard() {
    const [content, setContent] = useState("overview");
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);    
    const [transactionsData, setTransactionsData] = useState<Transaction []>([]);   
    const token = localStorage.getItem("token")
    useEffect(() => {


        fetch("http://127.0.0.1:5000/dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            }
        })
        .then(res => {  
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            return res.json();
        })
        .then(data => {
            setDashboardData(data);
        })
        .catch(err => {
            console.log(err);
        });


    fetch("http://127.0.0.1:5000/get_transactions", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }
            return res.json();
        })
        .then(data => {
            setTransactionsData(data.transactions);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);



    useEffect(() => {
        console.log(transactionsData)

    }, [transactionsData]);

    
    return (
        <div className="container">
            <NavBar username={dashboardData?.username ?? ""} />

            <div className="dashboard-body">
                <aside className="side-panel">

                    <div className="side-panel-section"><h3>Main</h3></div>

                    <button
                        onClick={() => setContent("overview")}
                        className={content === "overview" ? "active" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                        Overview
                    </button>

                    <button
                        onClick={() => setContent("transfer")}
                        className={content === "transfer" ? "active" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                        Transfer
                    </button>

                    <button
                        onClick={() => setContent("transactions")}
                        className={content === "transactions" ? "active" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                        Transactions
                    </button>

                    <div className="side-panel-section"><h3>Payments</h3></div>

                    <button
                        onClick={() => setContent("deposit")}
                        className={content === "deposit" ? "active" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10m-5-5l5 5 5-5"/></svg>
                        Deposit
                    </button>

                    <button
                        onClick={() => setContent("withdraw")}
                        className={content === "withdraw" ? "active" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 17V7m-5 5l5-5 5 5"/></svg>
                        Withdraw
                    </button>

                    <div className="side-panel-footer">
                        <div className="user-pill">
                            <div className="user-avatar">{dashboardData?.username[0].toUpperCase()}</div>
                            <div>
                                <div className="user-info-name">{dashboardData?.username ?? ""}</div>
                                <div className="user-info-role">Personal account</div>
                            </div>
                        </div>
                    </div>

                </aside>

                <main className="main-content">
                    {content === "overview" && <Overview
                        username={dashboardData?.username ?? ""}
                        balance={dashboardData?.balance ?? 0}
                        firstname={dashboardData?.firstname ?? ""}
                        transactions_data={transactionsData}

                    />}
                    {content === "transfer"      && <Transfer sender_username={dashboardData?.username ?? ""}/>}
                    {content === "transactions"  && <Transactions username={dashboardData?.username ?? ""} transactions_data={transactionsData}/>}
                    {content === "deposit"       &&  <Deposit />}
                    {content === "withdraw"      && <Withdraw balance={dashboardData?.balance ?? 0} />}  
                </main>

            </div>
        </div>
    );
}

export default Dashboard;