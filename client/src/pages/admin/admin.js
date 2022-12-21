// Import Navigation Component
import NavigationBar from "../../components/navigation";
import { UserState } from "../../globalStore/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import {useNavigate} from "react-router-dom";
import imgBg from "../../static/home/img.svg";
// Custom Hooks
import {useReRouteIfNotSignedIn, useReRouteIfNotAdmin} from "../../customHooks/auth.hooks.js";

// MdOutlinePendingActions => Approved 
import { MdEmail, MdDescription } from 'react-icons/md';
import { Footer } from "../../components/footer";
// Loading State
import {Loading} from "../../components/loading.js";
import {FaRegMoneyBillAlt} from "react-icons/fa";
import {BsCashCoin, BsFillCalendarRangeFill, BsCalendar2Date} from "react-icons/bs"
import {BiHide, BiTimeFive } from "react-icons/bi";
import {GiMoneyStack} from "react-icons/gi";
import {AiFillMinusSquare, AiOutlineTransaction, AiOutlineUser} from "react-icons/ai";

//Styling
import "../css/admin.css";

/**
 * UserModel: {
    fullName: string;
    email: string;
    token: string;
    _id: string;
}
 */

/**
 * InvestmentModel  {
    "_id": "6337c4c16fffe65e1e9e9412",
    "amount": 8000,
    "yieldValue": 12198,
    "waitPeriod": 7,
    "currency": "dollars",
    "desc": "",
    "__v": 0,
    "deleted": false
  }
 */

  const bgStyle /**Object<String, String> */= {
    backgroundImage: `url(${imgBg})`, // SVG Background
    backgroundSize: "contain",
    minHeight: "250px",
    backgroundcolor: "white"
    
}


const investmentHeaders = (<div className="investment">
        <h4>Minimum Amount <BsCashCoin /></h4>
        <h4>% ROI <GiMoneyStack /></h4>
        <h4>Wait Period (Days) <BsFillCalendarRangeFill /></h4>
        {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
        <h4>Name <MdDescription /></h4>
        <h4>Update</h4>
    </div>)

const investmentFormHeaders = (<div className="investment">
        <h4>Minimum Amount <BsCashCoin /></h4>
        <h4>% ROI <GiMoneyStack /></h4>
        <h4>Wait Period (Days) <BsFillCalendarRangeFill /></h4>
        {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
        <h4>Name <MdDescription /></h4>
        <h4>Curency</h4>
    </div>)


const CreateInvestment /**: ReactComponent */ = props => {
    
    const token /**: JWTToken */ = props.token
    const updateInvestmentFormRef = useRef(null);
    
    const [investments /**: List<Investment> */, setInvestments /**: Funct<List<Investment>, T> */] = props.investmentsState;

    const [updateInvestment, setUpdateInvestment] = useState({
        amount: 0,
        yieldValue:0,
        waitPeriod: 0,
        desc: "No description",
        currency: "dollars"
    });

    /**
     * @desc Updates updateInvestment state
     */
     const updateInvestmentAction = (e) => {
       
        setUpdateInvestment(prevInvestment => ({...prevInvestment, 
                        [e.target.name]: e.target.value}));
        
    }
    const submitCreateInvestmentForm =async e => {
        e.preventDefault();
        const createInvestmentReq /**: Request */ = await fetch(`investment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(updateInvestment)
        })

        if(createInvestmentReq.ok){
            const createdInvestment /*: InvestmentModel */ = await createInvestmentReq.json();
            setInvestments(prevInv => {
                const addInvestment /*: Array<InvestmentModel> */ = prevInv.slice(0);
                addInvestment.push(createdInvestment);
                return addInvestment;
            })
            alert("Successfully created");
        } else{
            alert("Error creating Investment.Please try again")
        }
    }
    return (<div>
        {/* 
            * @desc manages creation of investment when an 
          */}
        <form className="updateInvestment" onSubmit={submitCreateInvestmentForm} >
            <h3 style={{textAlign: "center", padding: "10px"}}>Create Investment <button type="button" onClick={(e) => {
                e.preventDefault()
                updateInvestmentFormRef.current.classList.toggle("hide")}}>Hide</button></h3>
            
            <section ref={updateInvestmentFormRef}>
            {investmentFormHeaders}
            <div className="investment">
                <input type="number" min="1" 
                    required={true} value={updateInvestment.amount}
                    name="amount"
                    placeholder="Investment amount"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="1" 
                    required={true} value={updateInvestment.yieldValue}
                    name="yieldValue" placeholder="Return on Investment (%)"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="0" 
                    required={true} value={updateInvestment.waitPeriod}
                    name="waitPeriod" placeholder="Wait Period"
                    onChange={updateInvestmentAction}
                />
                {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
                <textarea type="string"
                    value={updateInvestment.desc}
                    name="desc" placeholder="description of the investment"
                    onChange={updateInvestmentAction}
                />

                <input type="string"
                    value={updateInvestment.currency}
                    name="currency"
                    onChange={updateInvestmentAction}
                />
            </div>
            <div className="investmentActions">
                <button type="submit">Create Investment</button>
            </div>
            </section>
            
        </form>
    </div>)
}

/**
 * 
 * @param {{user: UserState}} props 
 * @returns component for managing Investment
 */
const RetrieveAndUpdateInvestments /**: ReactComponent */= (props) => {
    const [investments /*: Array<investmentModel> */, 
            setInvestments /*: funct<Array<T>, Array<T>>  */] = useState([]);
    const [updateInvestment, setUpdateInvestment] = useState({
                amount: 0,
                yieldValue:0,
                waitPeriod: 0,
                desc: "No description",
                currency: "currency"
            });
    const updateInvestmentFormRef = useRef(null);
    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";
    async function getAllInvestments() {
        const retrieveInvestmentReq /*: Request */ =  await fetch("/investment/retrieve");
        if(retrieveInvestmentReq.ok){
            const investments /*: List<InvestmentModel> */ = await retrieveInvestmentReq.json();
            setInvestments(prevInvestments /**: List<InvestmentModel> */ => investments);
        } else{
            alert("An error occured retrieving investments");
        }
    }
    
    useEffect(() => {
        getAllInvestments()
      
    }, [])

    function displayInvestmentAction(e){
        // get investmentId
        const _id /**: ObjectId */ = e.target.id;
        
        // Find investment with matching id
        const investment /*:InvestmentModel*/ =  investments.find(investment /**:InvestmentModel */ => 
            investment._id === _id            
        );
        if(investment != null){
            setUpdateInvestment(prevInvestment => investment)
            updateInvestmentFormRef.current.classList.remove("hide");
        } else {
            alert("Something went wrong, please try again")
        }
    }

    /**
     * @desc Updates updateInvestment state
     */
     const updateInvestmentAction = (e) => {
       
        setUpdateInvestment(prevInvestment => ({...prevInvestment, 
                        [e.target.name]: e.target.value}));
        
    }
    /**
     * 
     * @param {Array<InvestmentModel>} investments
     * @param {ObjectId} id
     * @param {InvestmentModel} newPayload 
     * @returns {Array<InvestmentModel>}
     */
    function findByIdAndUpdate(investments /*: Array<InvestmentModel>*/,id /**: ObjectId */, newPayload /*: InvestmentModel  */){
        const investmentsCopy /**: Array<InvestmentModel> */ = investments.slice(0);
        let found /**: boolean */ = false;
        let idxOfFound /*: number */= -1;
        for(let idx /**number */ = 0; idx < investments.length; idx++){
            const investment /*: InvestmentModel */ = investments[idx];
            if(investment._id === id){
                found = true;
                idxOfFound = idx;
                break;
            }
        }
        if(found){
            investmentsCopy[idxOfFound] = newPayload;
        }
        return investmentsCopy;
    }
    /**
     * 
     * @param {Event} e 
     * submits updated form to the back end
     */
    async function submitUpdateInvestmentForm(e){
        e.preventDefault();
        const saveUpdateReq = await fetch(`/investment/update/${updateInvestment._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
            body: JSON.stringify(updateInvestment)
        })
        if(saveUpdateReq.ok){
            await saveUpdateReq.json();
            setInvestments(prevInvestments =>findByIdAndUpdate(prevInvestments, 
                        updateInvestment._id, updateInvestment) );
            alert("Investment successfully updated");
        } else{
            alert("An error occured and updates could not be made")
        }
    }

    /**
     * 
     * @param {Array<InvestmentModel>} investments 
     * @param {ObjectId} id 
     * @returns {Array<InvestmentModel>} with investment with id removed
     */
    function findByIdAndDelete(investments /*: Array<InvestmentModel>*/,id /**: ObjectId */)/*: Array<InvestmentModel>*/{
        return investments.filter(investment => investment._id !== id);
    }

    async function deleteInvestmentAction(e){
        const deleteInvestmentReq /*: Request*/ = await fetch(`/investment/delete/${updateInvestment._id}`, {
            method: "DELETE"
        })
        if(deleteInvestmentReq.ok){
            setInvestments(prevInv => findByIdAndDelete(prevInv, updateInvestment._id));
            alert("successfully deleted investment");
        } else{
            alert("Failed to delete investment");
        }
    }
    return (<div className="investments">
        
        <CreateInvestment token={token} investmentsState={[investments, setInvestments]}/>
        {/* 
            * @desc manages update of investment when an investment is clicked
          */}
        <form className="updateInvestment hide" onSubmit={submitUpdateInvestmentForm} ref={updateInvestmentFormRef}>
            <h3 style={{textAlign: "center", padding: "10px"}}>Update Investment <button type="button" onClick={(e) => {
                e.preventDefault()
                updateInvestmentFormRef.current.classList.add("hide")}}>Hide</button></h3>
            {investmentFormHeaders}
            <div className="investment">
                <input type="number" min="0" 
                    required={true} value={updateInvestment.amount}
                    name="amount"
                    placeholder="Investment amount"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="0" 
                    required={true} value={updateInvestment.yieldValue}
                    name="yieldValue" placeholder="Return on Investment"
                    onChange={updateInvestmentAction}
                />
                <input type="number" min="0" 
                    required={true} value={updateInvestment.waitPeriod}
                    name="waitPeriod" placeholder="Wait Period"
                    onChange={updateInvestmentAction}
                />
                {/* <h4>Currency <MdOutlineAttachMoney /></h4> */}
                <textarea type="string"
                    value={updateInvestment.desc}
                    name="desc" placeholder="description of the investment"
                    onChange={updateInvestmentAction}
                />

                <input type="string"
                    value={updateInvestment.currency}
                    name="currency"
                    onChange={updateInvestmentAction}
                />
            </div>
            <div className="investmentActions">
                <button type="submit">Update Investment</button>
                <button type="button" id="delete" onClick={deleteInvestmentAction}>Delete Investment</button>
            </div>
        </form>




       <section>
        {investmentHeaders}
       {
         investments.map(investment /*: InvestmentModel */ => (
            <section className="investment" key={investment._id}>
                <div>{investment.amount} {investment.currency}</div>
                <div>{investment.yieldValue}%</div>
                <div>{investment.waitPeriod}</div>
               
                <div>{investment.desc || "No description"}</div>
                <div><button id={investment._id} onClick={displayInvestmentAction} className="activeInvestment">Update</button></div>
            </section>
         ))
       }
       </section>
    </div>)
}
/**
 * @Component
 * @param {*} props 
 * @returns JSX
 */
const ViewTransactionHistory = (props) => {
    const toggleRef = useRef();
    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";

    const [userTransactions, setUserTransactions] = useState([]);

    useEffect(() => {
        getTransactions()
    }, [])

    function toggleRefDisplay(){
        toggleRef.current.classList.toggle("hide");
    }
    // Get transactions
    async function getTransactions(){
        const userAcctTransactionsReq /**: Request */ = await fetch(`/transaction/gettransactions`, {
            headers: {
                authorization: token
            }
        })

        if(userAcctTransactionsReq.ok){
            const userAcctTransactionsRes /**: List<TransactionModel> */ = await userAcctTransactionsReq.json();
            setUserTransactions(prevTransactions => userAcctTransactionsRes.acctTransactions);
            // alert(JSON.stringify(userAcctTransactionsRes));
        }
    }
    return (
    <div className="container">
        <h3 className="containerDesc">
            Manage Investments
            <button onClick={toggleRefDisplay} className="toggleBtn">Display</button>
        </h3>
        <main className="toggleRef hide" ref={toggleRef}>
            <RetrieveAndUpdateInvestments />
        </main>
    </div>)
}

/**
 * @desc React Component for updating transactions
 * @param {} props 
 */
const PendingTransactionDisplay /**:ReactComponent */ = (props) => {
    const transactionContent /**Ref */ = useRef(null);
     
    const token /**:String */ = props.token;
    
    const transaction /**: TransactionModel(Populated) */ = props.transaction;

    const hideEventResponse /**Ref */ = useRef(null);
    // Keep track of current transaction and mail
    const [currTransactionId /**ObjectId */, setCurrTransactionId /**Funct<T, T> */] = useState(transaction._id);
    const [currTransaction /**Object<string, string> */, setCurrTransaction /**Funct<T, T> */] = useState({
        status: transaction.status
    })
    const [currMail /**: Object<string, string> */, setCurrMail /**Funct<T, T> */] = useState({
        to: transaction.user.email,
        subject: `Status on ${transaction.investmentId.desc}`,
        html: ""
    });

    /**
     * @desc updates email body whenever transaction status is modified
     */
    function updateEmailText() /**void */{
        setCurrMail(prevMail => ({
            ...prevMail, html: `Dear ${transaction.user.fullName}, your status on the investment ${transaction.investmentId.desc}, with investment amount of ${transaction.amount}${transaction.currency} has been updated to ${currTransaction.status}`
        }));
    }
    useEffect(() => {
        updateEmailText()
    }, [currTransaction])

    const transactionContentDisplayAction /**Consumer<Event> */ = (e /**Event */) /**Void */ => {
        transactionContent.current.classList.toggle("hide");
    }

    function updateStatusAction(e /**EventObject */) /**void */{
        setCurrTransaction(prevStatus => ({...prevStatus, [e.target.name]: e.target.value}));
    }
    function updateMailAction(e /**EventObject */) /**void */{
        setCurrMail(prevVal => ({...prevVal, [e.target.name]: e.target.value}))
    }

    function hideResponseAction(e /**EventObject */) /*void*/{
        hideEventResponse.current.classList.add("hide");
    }
    function showResponseAction(){
        hideEventResponse.current.classList.remove("hide");
    }

    async function updateStatusAndSendMailAction(e /**EventObject */) /**void */{
        e.preventDefault();
        // Merge mail and status states
        const transactionAndMailBody /** Object<string, Object<string, string> */ = {
            transaction: currTransaction,
            mail: currMail
        };
        const transactionId /**ObjectId*/ = currTransactionId;

        // send Request
        const requestUrl /**String */ = `/transaction/update/${transactionId}`;
        const updateTransactionSendMailRequest /**Request */= await fetch(requestUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(transactionAndMailBody)
        })

        if(updateTransactionSendMailRequest.ok){
            const updateTransactionSendMailResponse /**Response */ = await updateTransactionSendMailRequest.json();
            if(updateTransactionSendMailResponse.updated){
                showResponseAction();
            }
        }

    }

    
    return (
        <div className="adminTransactionUpdateDiv">
            <h3 style={{display: "flex", justifyContent: "space-between"}}>
                <span>
                    {transaction.amount}{transaction.currency} {" "}
                    {transaction.investmentId.desc} by {" "}
                    {transaction.user.fullName}
                </span>
                 <button 
                 className="showBtn"
                 onClick={transactionContentDisplayAction}
                 >Update</button>
            </h3>
            <div ref={transactionContent} className="hide transactionContent">
                    
                <div>
                    
                    <section>
                        <h4>Transaction Name <AiOutlineTransaction /></h4>
                        <p>{transaction.investmentId.desc}</p>
                    </section>
                    <section>
                        <h4>Amount Invested <BsCashCoin /></h4>
                        <p>{transaction.amount}{transaction.currency}</p>
                    </section>


                    <section>
                        <h4>Investor <AiOutlineUser /></h4>
                        <p>
                            {transaction.user.fullName}
                        </p>
                    </section>
                    <section>
                        <h4>Investor Email <MdEmail /></h4>
                        <p>
                            {transaction.user.email}
                        </p>
                    </section>


                    <section>
                        <h4>Transaction Status</h4>
                        <p>
                            {transaction.status}
                        </p>
                    </section>
                    <section>
                        <h4>Transaction Date <BiTimeFive /></h4>
                        <p>
                            {transaction.updatedAt}
                        </p>
                    </section>
                </div>

                <form className="updateStatus" onSubmit={updateStatusAndSendMailAction}>
                    <h4>Update Status</h4>
                    <select value={currTransaction.status}
                    name="status"
                    onChange={updateStatusAction}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <div>
                        <h4>Accompanying Mail</h4>
                        <main>
                            <label htmlFor="subject">
                                <p>Subject: *</p>
                                <input id="subject"
                                name="subject"
                                value={currMail.subject}
                                required={true}
                                minLength={5}
                                onChange={updateMailAction}
                                />
                            </label>

                            <label htmlFor="subject">
                                <p>Email Body: *</p>
                                <textarea id="html"
                                name="html"
                                value={currMail.html}
                                required={true}
                                minLength={5}
                                onChange={updateMailAction}
                                />
                            </label>
                        </main>
                    </div>
                    <p className="hide" ref={hideEventResponse} >
                        Status successfully updated and email sent successfully
                        <button type="button" onClick={hideResponseAction}><BiHide /></button>
                    </p>
                    <button className={"goldBtn"}>
                        Update Status and Send Mail
                    </button>
                    
                </form>
            </div>
        </div>
    );

}



const UpdatePendingTransactions = (props) => {
    const [loading, setLoading] = useState(false);

    const [pendingTransactions, setPendingTransactions] = useState([]);
    const toggleRef = useRef();

   const [transactionsStatus, setTransactionsStatus] = useState("pending");

    const User /*: UserModel */= props.user || {};
    const token  /* JWTToken */= "Bearer " + User.token || "";
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    useEffect(() => {
        getPendingTransactions();
    }, [])
    // Get Pending transactions
    async function getPendingTransactions(status /** enum {pending, approved, rejected}*/ = "pending") /**void */{
        setLoading(true);
        const transactionsReq /**: Request */ = await fetch(`/transaction/filtertransactions?status=${status}`, {
            headers: {
                authorization: token
            }
        });
        if(transactionsReq.ok){
            setLoading(false);
            const transactionsRes /**: List<TransactionModel> */ = await transactionsReq.json();
            setPendingTransactions(transactions => transactionsRes);
        }
    }

    function getTransactionsWithStatus(e /**EventObject */) /**void */{
        // get currentstatus of button
        const selectedStatus /*string*/ = e.target.id;
        getPendingTransactions(selectedStatus);
        setTransactionsStatus(selectedStatus);

    }
    return (<div className="container">
        <h3 className="containerDesc">
            Update Transactions 
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>

        <main className="toggleRef hide" ref={toggleRef}>
            <section className="statuses">
                <button id="pending" 
                onClick={getTransactionsWithStatus}>
                    Pending
                </button>
                <button id="approved"
                onClick={getTransactionsWithStatus}>
                    Approved
                </button>
                <button id="rejected"
                onClick={getTransactionsWithStatus}>
                    Rejected
                </button>
            </section>
            {
                loading ?  <Loading /> :
                <>
                    <header>
                
                        <h3>
                        {transactionsStatus} Transactions
                        </h3>
                    </header>
                    <div className="transactionsContainer">
                        {
                            pendingTransactions.map(transaction => (
                                <div key={transaction._id}>
                                <PendingTransactionDisplay 
                                transaction={transaction}
                                token={token}
                                />
                                </div>
                            ))
                        }
                    </div>
                </>

            }
        </main>
            
    </div>)
}

const RequestFundAccount = (props) => {
    const toggleRef = useRef();

    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    
    return (<div className="container">
        <h3 className="containerDesc">
            View Transaction History
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>
        <main className="toggleRef hide" ref={toggleRef}>
            Hello, world
        </main>
    </div>)
}

/**
 * {
    "_id": "635ebdb27c7648eb991fc1c0",
    "acctId": {
      "_id": "632e039ea2e0889b2033ffd5",
      "acctHolderId": "632e039ea2e0889b2033ffd2",
      "acctTransactions": [],
      "__v": 0
    },
    "userId": {
      "_id": "632e039ea2e0889b2033ffd2",
      "fullName": "Samuel Atuma",
      "email": "atumasaake@gmail.com",
      "password": "abd63f0a5ba4f8df87602b1377cde0daf3e1e99e9f981d9c632d32750de304c3",
      "isAdmin": true,
      "isActive": true,
      "createdAt": "2022-09-23T19:06:06.147Z",
      "updatedAt": "2022-09-23T19:06:06.147Z",
      "__v": 0
    },
    "amount": 469199.9,
    "currency": "pula",
    "status": "pending",
    "viewed": "seen",
    "createdAt": "2022-10-30T18:08:50.165Z",
    "updatedAt": "2022-10-30T18:11:25.079Z",
    "__v": 0
  }
 */

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const UpdateWithdrawal = ({withdrawal /**Withdrawal */, token /**String */ }) => {
    const formSubmissionResponse /**Ref */= useRef(null); 
    const [withdrawalData /**Withdrawal */, 
    setWithdrawal /**Funct<T, T> */] = useState(withdrawal);
    // States
    const withdrawalDetailsRef /**Ref */ = useRef(null);
    const [mail /**{[Key: string]: string} */, setMail /**Funct<T, T> */] = useState({
        to: withdrawal?.userId?.email || "",
        subject: "Update on withdrawal",
        html: "..."
    });
    const [withdrawalForm /** {[Key: String]: String} */, 
    setWithdrawalForm /**Funct<T, T> */] = useState({
        viewed: withdrawal.viewed,
        status: withdrawal.status
    });
    const [loading /** boolean */, setLoading /**Funct<T, T> */] = useState(false);
    // Events
    const toggleWithdrawalDetails = (e /**EventObject */) /**Void */=> {
        withdrawalDetailsRef.current.classList.toggle("hide");
    }
    function updateMailAction(e /**EventObject */) /**: void */{
        setMail(currMailService => ({...currMailService, 
            [e.target.name]: e.target.value}))
    }
    function updateWithdrawalForm(e /**EventObject */) /** Void */{
        // Required just to reload the component
        setWithdrawalForm(currFormVal => ({...currFormVal,
        [e.target.name]: e.target.value}))

        // Here, withdrawal data is what is sent back with the form
        withdrawal[e.target.name] = e.target.value;
    }
    async function submitWithdrawalFormAction(e /**EventObject */) /**void */{
        e.preventDefault();

        // Arrange data to be submitted with form (Note withdrawal is gotten from withdrawal, not withdrawalForm)
        const {
            viewed /** String */,
            status /** String */
        } = withdrawal
        
        const form /** {[Key: String]: {[Key: String]: String}} */ = {
            mail: mail,
            withdrawal: {viewed, status}
        }
        const url /**: string */ = `/withdrawal/updatewithdrawal/${withdrawal._id}`;
        // Act
        setLoading(true)
        const req /**Request */ = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(form)
        });
        if(req.ok){
            setLoading(false)
            // show formSubmission response
            formSubmissionResponse.current.classList.remove("hide");
            const response /** Response */ = await req.json();

        }

    }

    function hideFormSubmissionResponse(e /**EventObject */) /*void*/{
        formSubmissionResponse.current.classList.add("hide");
    }

    return (
        loading ? <Loading />:
        <div className="withdrawalUpdateDiv">
            <h3 className="withdrawalUpdateh3">
                {withdrawal?.amount}{withdrawal?.currency} by {withdrawal?.userId?.fullName}
                <button className="goldBtn" 
                onClick={toggleWithdrawalDetails}>
                    Details
                </button>
                
            </h3>
            <div className="withdrawalDetails hide" 
            ref={withdrawalDetailsRef}>
                <div className="details">

                    <main>
                        <h4>
                        Requested Withdrawal
                             <FaRegMoneyBillAlt />
                        </h4>
                        <p>
                            {withdrawal?.amount}{withdrawal?.currency}
                        </p>
                    </main>

                    <main>
                        <h4>
                            Requested By
                             <AiOutlineUser />
                        </h4>
                        <p>
                            {withdrawal?.userId?.fullName}
                        </p>
                    </main>

                    
                    <main>
                        <h4>
                            Email
                             <MdEmail />
                        </h4>
                        <p>
                            {withdrawal?.userId?.email}
                        </p>
                    </main>

                    <main>
                        <h4>
                            Status
                        </h4>
                        <p>
                            {withdrawal?.status}
                        </p>
                    </main>

                    
                    <main>
                        <h4>
                            Date of Request
                            <BsCalendar2Date />
                        </h4>
                        <p>
                            {withdrawal?.createdAt}
                        </p>
                    </main>
                </div>
                <form className="updateWithdrawalForm" onSubmit={submitWithdrawalFormAction}>
                    <h3>Send mail and update withdrawal</h3>

                    <div className="withdrawalMail">
                        <h4>Email</h4>
                        <label htmlFor="subject">
                            Email Subject:
                            <input 
                            type="text"
                            value={mail.subject}
                            name="subject"
                            onChange={updateMailAction} />
                        </label>

                        <label htmlFor="html">
                            Email Body (Leave as ... if you don't want to send a mail):
                            <textarea 
                            type="text"
                            value={mail.html}
                            name="html"
                            onChange={updateMailAction} />
                        </label>
                    </div>

                    <div className="withdrawalUpdateFields">
                        <h4>Withdrawal Details</h4>

                        <label htmlFor="status">
                            Update Status:
                            <select 
                            name="status"
                            value={withdrawal?.status}
                            onChange={updateWithdrawalForm}>
                                <option value={"approved"} 
                                default={withdrawal?.status === "approved"}>
                                    Approved
                                </option>
                                <option value={"pending"} 
                                default={withdrawal?.status === "pending"}>
                                    Pending
                                </option>

                                <option value={"rejected"} 
                                default={withdrawal?.status === "rejected"}>
                                    Rejected
                                </option>
                            </select>
                        </label>

                        <label htmlFor="viewed">
                            Set viewed by admin:
                            <select 
                            name="viewed"
                            value={withdrawal?.viewed}
                            onChange={updateWithdrawalForm}>
                                <option value={"seen"} 
                                default={withdrawal?.viewed === "seen"}>
                                    Mark as Seen
                                </option>
                                <option value={"not seen"} 
                                default={withdrawal?.viewed === "not seen"}>
                                    Mark as Not Seen
                                </option>

                            </select>
                        </label>


                    </div>
                    <p className="withDrawalFormSubmissionResponseP hide" ref={formSubmissionResponse}>
                        Withdrawal was updated successfully
                        <button type="button" onClick={hideFormSubmissionResponse}>
                            <BiHide />
                        </button>

                    </p>
                    <button>Update withdrawal details</button>
                </form>
            </div>
        </div>
    );
}

/**
 * @desc Component for managing retrieval and update of withdrawals
 * @param {*} props 
 * @returns 
 */
const RetrieveAndUpdateWithdrawals = (props) => {
    /** States */
    const [loading, setLoading] = useState(false);
    const User /*: UserModel */= props.user || {};

    const [withdrawals /**Array<Withdrawal> */, 
        setWithdrawals /**Funct<T, T> */] = useState([]);

    const [withdrawalsViews /** Set */, 
        setWithdrawalsViews /**Funct<T, T> */] = useState(new Set());
    const [currView /** String */, setCurrView /**Funct<T, T> */] = useState("")
    const [withdrawalsForCurrView /**Array<Withdrawal> */,
        setWithdrawalsForCurrView  /** Funct<T, T */] = useState([]);

    const token  /* String */= "Bearer " + User.token || "";
    const toggleRef = useRef();

    // view manager
    const viewRefs /**:Ref */ = useRef([]);
    /**End of States */

    /** Effects */
    
    useEffect(() => {
        getAllWithdrawals()
    }, [])

    useEffect(() => {
        filterByView(currView);
    }, [currView])

    async function getAllWithdrawals() /** void */{
        setLoading(true);
        const getWithdrawalsReq /** Request */ = await fetch("/withdrawal/getwithdrawals", {
            method: "GET",
            headers: {
                Authorization: token
            }
        });
        if(getWithdrawalsReq.ok){
             setLoading(false);
             const getWithdrawals /**Array<Withdrawal> */ = await getWithdrawalsReq.json();

             // get available views
             const allViews /**Set<String> */ = new Set(getWithdrawals.map(withdrawal => withdrawal.viewed));

             // update withdrawalsView and withdrawals
             setWithdrawalsViews(allViews);
             setWithdrawals(getWithdrawals);
        }

    }


    //Events

    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }

    /**
     * 
     * @param {String} view 
     */
    function filterByView(view /**String */) /**void */{
        const currViewWithdrawals = withdrawals.filter(
            withdrawal /**Withdrawal */ => withdrawal.viewed === view
        );
        setWithdrawalsForCurrView(currViewWithdrawals);
    }

    function showView(e /**EventObject */) /**:Void */{
        // Remove clicked class from all viewRefs
        viewRefs.current.forEach(view /**HTMLElement */ => {
            view.classList.remove("clicked");
        })
        // Add to only current view
        const id /**number */= parseInt(e.target.id); 
        viewRefs.current[id].classList.add("clicked");
        
        const btnCurrView /** String */  = e.target.name ;
        setCurrView(btnCurrView);
        
    }

    return (<div className="container">
        <h3 className="containerDesc">
            Retrieve and Update Withdrawals
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>
        <main className="toggleRef hide" ref={toggleRef}>
            {
                loading ? 
                <Loading />: 
                <div>
                    <div className="withdrawalView">
                        {
                            // Handle view to display
                            Array.from(withdrawalsViews)
                                .map((view, idx) => (
                                    <button 
                                    id={idx}
                                    key={idx}
                                    name={view}
                                    ref={btn => viewRefs.current[idx] = btn}
                                    onClick={showView}>
                                        {view}
                                    </button>
                                ))
                        }
                    </div>
                    {
                        withdrawalsForCurrView.map(
                            (withdrawal, idx) => (
                                <div key={idx}>
                                   <UpdateWithdrawal withdrawal={withdrawal} 
                                   token={token}/>
                                </div>
                            )
                        )
                    }
                </div>
            }
        </main>
    </div>)
}

const HomePageIntro /**Component */ = (props /**{user: User} */) /**JSX */ => {
    // Props data
    const User /*: UserModel */= props.user || {};
    const token  /* String */= "Bearer " + User.token || "";
    // States
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState(null);
    const [intro /**Intro */, setIntro /**Funct<T, T> */] = useState({
        heading: "Heading for Intro",
        body: "Intro text goes in here",
        adminWhatsappNum: "",
        imgUrl: ""
    })

    const toggleRef /**Ref */ = useRef(null);


    // Effects
    useEffect(() => {
        getIntro();
    }, [])
    async function getIntro() /**void */{
        setLoading(true);

        const introReq /**Request */= await fetch(`/home/intro`)
        setLoading(false);
        if(introReq.ok){
            const res /**Response */ = await introReq.json();
            if(res.intro !== null){
                setIntro(res.intro);
            }
        }
    }
    

    

    // End of States
    

    // Events
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    function updateForm(e /**Event */) /**Void */{
        setIntro(prev => ({...prev, [e.target.name] : e.target.value}));
    }
    function updateImage(e /**Event */) /**Void */{
        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
    }
    async function submitFormAction(e /** Event */) /**void */{
        e.preventDefault();
        if(!img){
            alert("Please, add a valid image");
            return ;
        }
        // create form
        const formData /**FormData */ = new FormData();
        formData.append("heading", intro.heading);
        formData.append("body", intro.body);
        formData.append("adminWhatsappNum", intro.adminWhatsappNum);
        formData.append("img", img);
        // Update Intro form
        const url /**String */ =  "/home/intro";
        setLoading(true)
        const introReq /**Request */ = await fetch(url, {
            method: "POST",
            headers: {
                // "Content-Type": "multipart/form-data",
                "Authorization": token
            },
            body: formData
        });
        if(introReq.ok){
            setLoading(false);
            const introRes /**Response */ = await introReq.json();
            setIntro(introRes.intro);
        }
    }
    return (<div className="container">
    <h3 className="containerDesc">
        Update Home Page Intro
        <button onClick={toggleRefDisplay}>Display</button>
    </h3>
    <main className="toggleRef hide" ref={toggleRef}>
        {
            loading ? <Loading /> :
            <div className="intro"> 
                <main className="currIntroMain">
                    <div>
                        <h3>Intro Heading</h3>
                        <p>{intro.heading}</p>
                    </div>

                    <div>
                        <h3>Intro Body</h3>
                        <p>{intro.body}</p>
                    </div>

                    <div>
                        <h3>Admin Whatsapp Number</h3>
                        <p>{intro.adminWhatsappNum}</p>
                    </div>

                    <div>
                        <h3>Intro Display Image</h3>
                        {
                            !intro.imgUrl ? <p>
                                No image uploaded yet!
                            </p> : 
                            <div className="imageContainer">
                                
                                <img crossOrigin="anonymous" src={intro.imgUrl} alt="Intro display"/>
                            </div>
                        }
                    </div>


                </main>

                {/* Upload Intro Form */}
                <main className="introForm">
                    <form onSubmit={submitFormAction}>
                        <h2>Update Intro </h2>
                        <label htmlFor="heading">
                            <h3>Intro Heading</h3>
                            <textarea
                            name="heading"
                            required={true}
                            minLength={1}
                            value={intro.heading}
                            onChange={updateForm} />
                        </label>
                        <label htmlFor="body">
                            <h3>Intro Body</h3>
                            <textarea
                            name="body"
                            required={true}
                            value={intro.body} 
                            onChange={updateForm} />
                        </label>

                        

                        <label htmlFor="adminWhatsappNum">
                            <h3>Admin whatsapp Number (Start with country code e.g 234123456789)</h3>
                            <input
                            name="adminWhatsappNum"
                            required={true}
                            minLength={5}
                            placeholder={"234123456789"}
                            value={intro.adminWhatsappNum}
                            onChange={updateForm} />
                        </label>

                        <label htmlFor="img">
                            <h3>Intro Image</h3>
                            <input 
                            type="file" 
                            required={true}
                            accept="image/*"
                            name="img"
                            onChange={updateImage}
                            />
                        </label>
                        <button>Update Intro</button>
                    </form>
                </main>
            </div>
        }
    </main>
    </div>
    )
}







const StatsDTO/** {[key: string] : {[key: string] : string}} */ = {
    stats1: {
        data: String,
        desc: String,
    },
    stats2: {
        data: String,
        desc: String,
    },
    stats3: {
        data: String,
        desc: String,
    },
    stats4: {
        data: String,
        desc: String,
    }
}
const HomepageStats /**Component */= (props  /**{user: User} */) /**JSX */ => {
    // Props data
    const User /*: UserModel */= props.user || {};
    const token  /* String */= "Bearer " + User.token || "";
    const [loading /**boolean */, setLoading /**Funct<T, T> */] = useState(false);

    /**
     * 
     */
    const [stats /** StatsDTO */, setStats /** Funct<T, T> */] = useState({
        stats1: {
            data: "Stats Heading 1",
            desc: "Stats description 1",
        },
        stats2: {
            data: "Stats Heading 2",
            desc: "Stats description 2",
        },
        stats3: {
            data: "Stats Heading 3",
            desc: "Stats description 3",
        },
        stats4: {
            data: "Stats Heading 4",
            desc: "Stats description 4",
        }
    })

    const toggleRef /**Ref */ = useRef(null);

    // Effects
    useEffect(() => {
        fetchStats();
    }, [])
    async function fetchStats() /** void */{
        const url /** String */ = "/home/stats";
        setLoading(true);
        const req /**Request*/ = await fetch(url);
        setLoading(false);
        if(req.ok){
            const statsResp /**Response */ = await req.json();
            const stats /**StatsDTO */ = statsResp.stats;
            if(stats !== null){
                setStats(curr => stats);
            }
        }

    }
    
    // Events
    function toggleRefDisplay(e /**Event */) /**void */{
        toggleRef.current.classList.toggle("hide");
    }
    function updateStatsAction(e /** Event */) /**Void */{
        const currentStat /** String */ = e.target.name;
        const currentStatKey /** String */ = e.target.id;
        const updatedStats /** Stats */= {...stats}
        updatedStats[currentStat][currentStatKey] = e.target.value;
        setStats(updatedStats);
    }

    async function submitStatsAction(e /**void */){
        e.preventDefault();
        const postStatsUrl /** StatsUrl */ = "/home/stats";
        const req /**Response */ = await fetch(postStatsUrl, {
            method: "post",
            headers: {
                // "Content-Type": "multipart/form-data",
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(stats)
        })

        if(req.ok){
            alert("Stats Updated Succesfully")
        } else{
            alert("An error occured while trying to update stats, please try again");
        }

    }
    // Utils
    const statsToTuple = (stats /**{[Key: String]: {data: String, desc: String}} */) /**Array<Tuple<String, {data: String, desc: String}>> */ => {
        const flattened /**Array<Tuple<String, {data: String, desc: String}>> */ = [];
        for(const statKey /**Key */ in stats){
            // Put only keys with stat in them
            if(statKey.includes("stats")){
                const tuple /** Tuple<String, {data: String, desc: String}> */ = [statKey, stats[statKey]];
                flattened.push(tuple);
            }
        }
        return flattened;
    }
    return (
        <div className="container">
            <h3 className="containerDesc">
                 Update Home Page Statistics
                 <button onClick={toggleRefDisplay}>Display</button>
            </h3>
        
        <main className="toggleRef hide" ref={toggleRef}>
            
            <section className="adminStatsSection">
            <p>
                    Stats shows users statistics about your company/app.
                    E.g How many users use your app
                </p>
                
                    <div className="statsHolder">
                        {statsToTuple(stats).map((stat, idx) => (
                        <div key={idx}>
                            <h3>{stat[0]}</h3>
                            <section>
                                <h3>Data</h3>
                                <h4>{stat[1].data}</h4>
                                <h3>Description</h3>
                                <p>{stat[1].desc}</p>
                            </section>
                        </div>
                    ))}
                    </div>

                
                
                <form onSubmit={submitStatsAction} method="POST">
                    <h3>Update Stats</h3>
                    <br />
                    <h4>
                        Update Stats1 
                    </h4>
                    <label htmlFor="stats1">
                        <p>Data</p>
                        <input 
                        name="stats1" id="data"
                        value={stats.stats1.data}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                        />
                    </label>

                    <label htmlFor="stats1">
                        <p>Description</p>
                        <textarea 
                        name="stats1" id="desc"
                        value={stats.stats1.desc}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                        />
                    </label>


                    <br />
                    <h4>
                        Update Stats2
                    </h4>
                    <label htmlFor="stats2">
                        <p>Data</p>
                        <input 
                        name="stats2" id="data"
                        value={stats.stats2.data}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                        />
                    </label>

                    <label htmlFor="stats2">
                        <p>Description</p>
                        <textarea 
                        name="stats2" id="desc"
                        value={stats.stats2.desc}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                        />
                    </label>

                    <br />
                    <h4>
                        Update Stats3
                    </h4>
                    <label htmlFor="stats3">
                        <p>Data</p>
                        <input 
                        name="stats3" id="data"
                        value={stats.stats3.data}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                       
                        />
                    </label>

                    <label htmlFor="stats3">
                        <p>Description</p>
                        <textarea 
                        name="stats3" id="desc"
                        value={stats.stats3.desc}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                        />
                    </label>

                    <h4>
                        Update Stats4
                    </h4>
                    <label htmlFor="stats4">
                        <p>Data</p>
                        <input 
                        name="stats4" id="data"
                        value={stats.stats4.data}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                       
                        />
                    </label>

                    <label htmlFor="stats4">
                        <p>Description</p>
                        <textarea 
                        name="stats4" id="desc"
                        value={stats.stats4.desc}
                        onChange={updateStatsAction}
                        minLength = {2}
                        required={true}
                        />
                    </label>
                    <button>Update Stats</button>
                </form>
            </section>
        </main>
    </div>
    )

}
const howToEarnDTO = {
    desc: String,
    steps: [{title: String, details: String}]
}


const HomePageHowToEarn /** Component */ = (props /**{user: User} */) /**JSX */ => {
    // Props data
    const User /*: UserModel */= props.user || {};
    const token  /* String */= "Bearer " + User.token || "";
    
    // States
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState(null);
    const toggleRef /**Ref */ = useRef(null);
    const [howToEarnImage /**{imgUrl: String...}*/ , setHowToEarnImage] = useState({imgUrl: ""});


    // Effects
    useEffect(() => {
        fetchHowToEarnImage()
    }, [])
    async function fetchHowToEarnImage() /**Void */{
        setLoading(true)
        const howToEarnRequest /** Response */= await fetch("/home/howtoearnimage");
        setLoading(false);
        if(howToEarnRequest.ok){
            const response /**howToEarnImage */= await howToEarnRequest.json();
            console.log(response);
            setHowToEarnImage(response.howToEarnImage);
        }
    }
    // Events
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }

    function updateImage(e /**Event */) /**Void */{
        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
    }


    async function uploadImage(e /**Event */) /**void*/{
        e.preventDefault();
        if(!img){
            alert("Please, add a valid image");
            return ;
        }
        // create form
        const formData /**FormData */ = new FormData();
        formData.append("img", img);
        // Update Intro form
        const url /**String */ =  "/home/howtoearnimage";
        setLoading(true);
        const imageReq /**Request */ = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: formData
        });
        if(imageReq.ok){
            setLoading(false);
            const imageRes /**Response */ = await imageReq.json();
            setHowToEarnImage(imageRes.howToEarnImage)
        }
    }


    // How to Earn

    // States
    const [howToEarn /* howToEarnDTO**/, setHowToEarn /** Funct<T, T> */] = useState({
        desc: "",
        steps: [
            {title: "", details: ""},
            {title: "", details: ""},
            {title: "", details: ""},
            {title: "", details: ""},
            {title: "", details: ""},
        ]
    })

    function updateHowToEarn(newHowToEarn /**howToEarnDTO */ ) /* howToEarnDTO*/{
        let currentHowToEarn /**howToEarnDTO */= howToEarn;
        currentHowToEarn.desc = newHowToEarn?.desc || [];
        const steps /**var */= newHowToEarn?.steps || currentHowToEarn?.steps || [];
        for(let i /**int */ = 0; i < steps.length; i++){
            currentHowToEarn.steps[i] = steps[i];
        }
        return currentHowToEarn;
    }
    // Effects
    useEffect(() => {
        getHowToEarn()
    }, [])
    async function getHowToEarn(){
        const req /**Request*/ = await fetch("/home/howtoearn");
        if(req.ok){
            const newHowToEarn /**howToEarnDTO */ = await req.json();
            const updatedHowToEarn /* howToEarnDTO*/= updateHowToEarn(newHowToEarn.howToEarn);
            setHowToEarn(updatedHowToEarn);
        }
    }


    // Events
    function updateDescAction(e /**Event */) /** void */{
        setHowToEarn(prevData => ({...prevData, [e.target.name]: e.target.value}));
    }

    function updateStepAction(e /**Event */) /** void */{
        // get index position to change
        const idxToChange /** number */= parseInt(e.target.name);
        const updateHowToEarn /** howToEarn */ = {...howToEarn};
        const keyToChange /** String */ = e.target.id;
        updateHowToEarn.steps[idxToChange][keyToChange] = e.target.value;
        setHowToEarn(updateHowToEarn);
    }
    function trimSteps(){
        const toUpdate /**howToEarn */ = {...howToEarn}
        const updatedSteps /** Array<{title: String, details: String}> */ = [];

        for(let step of toUpdate.steps){
            if(step.title.trim() !== "" && step.details.trim() !== "")
                updatedSteps.push(step);
        }
        toUpdate.steps = updatedSteps;
        return toUpdate;
    }
    async function updateHowToEarnAction(e /**Event */) /** void */{
        e.preventDefault();
        const howToEarnJSON /**JSON<HowToEarnDTO> */= JSON.stringify(trimSteps())
        const url /** String */= "/home/howtoearn";
        setLoading(true);
        const request /**Response */ = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: howToEarnJSON
        })
        setLoading(false);
        if(request.ok){
            const response /**HowToEarnDTO */= await request.json();
            alert("How To Earn Updated Successfully");
        }
    }
    return (<>
        {
            loading ? <Loading /> :
            <div className="container">
                <h3 className="containerDesc">
                    Update Home Page How to Earn
                    <button onClick={toggleRefDisplay}>Display</button>
                </h3>

                <main className="toggleRef hide" ref={toggleRef}>
                    <div className="howToEarnImageDiv">
                        <h3>Current How to earn image</h3>
                        <section>
                            {
                                howToEarnImage?.imgUrl ?
                                <img crossOrigin="anonymous" src={howToEarnImage.imgUrl} style={{maxWidth: '100%'}} alt="How to earn image" /> : <h3>
                                    No image for how To earn uploaded yet
                                    </h3>
                            }
                        </section>

                        <form onSubmit={uploadImage}>
                            <h3>Update How to Earn Image</h3>
                            <label htmlFor="img">
                            <h3>Intro Image</h3>
                            <input 
                            type="file" 
                            required={true}
                            accept="image/*"
                            name="img"
                            onChange={updateImage}
                            />
                            <button>Upload Image</button>
                        </label>
                        </form>

                    </div>
                    

                    <form className="howToEarnDiv" onSubmit={updateHowToEarnAction}>
                        <h3>
                            Update How To Earn Steps
                        </h3>
                        <section>
                            <h4>Update current How to Earn Heading</h4>
                            
                            <label htmlFor="desc">
                                <textarea 
                                name="desc"
                                value={howToEarn.desc}
                                onChange={updateDescAction}                   
                                />
                            </label>
                        </section>
                        
                        <section>
                            <h3>Update Steps</h3>
                            {
                                howToEarn.steps.map((step, idx) => (
                                    <div key={idx}>
                                        <h4>Step{idx + 1}</h4>
                                        <h4>
                                            Update Step{idx + 1} Title (Optional)
                                        </h4>
                                        
                                        <label>
                                            <input 
                                            value={step.title}
                                            name={idx}
                                            id="title"
                                            onChange={updateStepAction}
                                            />
                                        </label>

                                        <h4>Update Step{idx + 1} Details (Optional)</h4>
                                        
                                        <label>
                                            <textarea 
                                            value={step.details}
                                            name={idx}
                                            id="details"
                                            onChange={updateStepAction}
                                            />
                                        </label>
                                    </div>
                                ))
                            }
                        </section>
                        <button>Update How to Earn</button>
                    </form>
                </main>

                
            </div>
        }
    </>
    )
}
const ReviewDTO = {
          imageUrl: String || null,
          name: String,
          gender: ["male","female"],
          rating: Number,
          review: String,
          country: String
}


const HomepageReview /** Component */ = (props /**{user: User} */) /**JSX */ => {
    // Props data
    const User /*: UserModel */= props.user || {};
    const token  /* String */= "Bearer " + User.token || "";
    // States
    const [loading /**boolean */, setLoading /** funct<T, T> */] = useState(false);
    const toggleRef /** Ref */  = useRef(null);

    const [reviews /**ReviewDTO */, setReviews /** Funct<T, T> */] = useState({
        reviews: [
            {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"}, {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"},
            {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"}, {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"},
            {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"}, {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"},
            {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"}, {name: "", gender: "male", rating: 5, review: "", imageUrl: "", country: "United States"}
            
        ]
    })
    // Effects
    useEffect(() => {
        getReviews();
    }, [])

    async function getReviews() /**void*/{
        setLoading(true);
        const url /**String */ = "/home/getreviews";
        const reviewsReq /** Request */= await fetch(url);
        setLoading(false);
        if(reviewsReq.ok){
            const review /**{review: Array<ReviewDTO>} */= await reviewsReq.json();
            if(review){
                imprintReviews(review.reviews);
            }
        }

    }

    // Utilities
    /**
     * 
     * @param {Array<ReviewDTO>} newReviews 
     */
    function imprintReviews(newReviews /**Array<ReviewDTO> */){
        
        let currReviews = reviews.reviews;
        let currReviewsLength /**number */ = currReviews.length;
        for(let i /**number */= 0; i < newReviews.length; i++){
            let newReview /**ReviewDTO */ = newReviews[i];
            if(i < currReviewsLength){
                currReviews[i] = newReview;
            } else{
                currReviews.push(newReview);
                currReviewsLength++;
            }
        }
        setReviews({reviews: currReviews});
    }

    // Events
    function toggleRefDisplay(e){
        toggleRef.current.classList.toggle("hide");
    }
    function changeCurrentImageAction(e /** Event */) /** void */{
         // get idx of review to update
         const idx /**number */ = parseInt(e.target.id);
         let currReviews /**Array<ReviewDTO> */ = reviews.reviews;
         
         // Update
         currReviews[idx] = {...currReviews[idx], imageUrl: ""};
         setReviews({reviews: currReviews});
    }
    // Events
    function updateReviewData(e /** Event */) /**void*/{
        // get idx of review to update
        const idx /**number */ = parseInt(e.target.id);
        let currReviews /**Array<ReviewDTO> */ = reviews.reviews;
        let key /**String */ = e.target.name;
        let value /**String || number */ = e.target.value;
        
        // Update
        currReviews[idx] = {...currReviews[idx], [key]: value};
        setReviews({reviews: currReviews});
    }

    /**
     * 
     * @returns reviews with name only
     */
    function removeInvalidReviews() /**Array<ReviewDTO>*/{
        // return reviews.reviews.filter(review => !review.name);
        let currentReviews  /** Array<ReviewDTO> */= reviews.reviews;
        let validReviews  /** Array<ReviewDTO> */= [];
        for(let review  /**ReviewDTO */of currentReviews){
            if(review.name?.trim()){
                validReviews.push(review);
            }
        }
        return validReviews;
    }
    async function submitReviewAction(e /** Event */) {
        // remove all invalid reviews (reviews without a name)
        setLoading(true);
        const validReviews /**Array<ReviewDTO>*/ = removeInvalidReviews();
        const reqBody /**JSON */ = JSON.stringify({reviews: validReviews});
        const url = "/home/addreviews";
        const addReviewsReq /** Response */ = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
            body: reqBody
        })
        setLoading(false);
        if(addReviewsReq.ok){
            getReviews();
        } else{
            alert("an error occured, please try again");
        }
    }
    return (
    <div className="container">
        <h3 className="containerDesc">
            Update Home Page Reviews
            <button onClick={toggleRefDisplay}>Display</button>
        </h3>

        <main className="toggleRef hide" ref={toggleRef}>
            {
                loading ? <Loading /> :
                <div className="adminReviewsDiv">
                    <h3>Update Reviews</h3>
                    {
                        reviews.reviews.map((review, idx) => (
                            <form key={idx} onSubmit={submitReviewAction}>
                                <h3>
                                    Reviewer {idx + 1}
                                </h3>
                                <h4>
                                (leave name blank to omit reviewer from reviews )
                                <br />
                                    Name of Reviewer e.g John Doe
                                    
                                </h4>

                                <label htmlFor="name">
                                    <input 
                                     name="name"
                                     value={review.name}
                                     id={idx}
                                     onChange={updateReviewData}
                                    />
                                </label>

                                <label htmlFor="country">
                                    <h4>
                                        Country of Reviewer
                                    </h4>
                                    <input 
                                     name="country"
                                     value={review.country}
                                     id={idx}
                                     onChange={updateReviewData}
                                    />
                                </label>

                                <label htmlFor="gender">
                                    <h4>
                                        Gender of Reviewer
                                    </h4>
                                    <select name="gender" 
                                     value={review.gender || "male"} 
                                     id={idx}
                                     onChange={updateReviewData}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </label>

                                <label htmlFor="review">
                                    <h4>
                                        Reviewer's review
                                    </h4>
                                    <textarea 
                                     name="review"
                                     value={review.review} 
                                     onChange={updateReviewData}
                                     id={idx}
                                     />
                                </label>

                                <label htmlFor="rating">
                                    <h4>
                                        Reviewer's rating
                                    </h4>
                                    <select name="rating" 
                                     value={review.rating} 
                                     id={idx}
                                     onChange={updateReviewData}>
                                        <option value={1}>1 star</option>
                                        <option value={2}>2 stars</option>
                                        <option value={3}>3 stars</option>
                                        <option value={4}>4 stars</option>
                                        <option value={5}>5 stars</option>
                                    </select>
                                </label>

                                <aside className="reviewImgAside">
                                    <h4>Reviewer's image</h4>
                                    { review.imageUrl ? (
                                    <div >
                                        <img crossOrigin="anonymous"
                                            src={review.imageUrl} alt="reviewer's profile picture"/>
                                            <button id={idx}
                                                type="button"
                                                onClick={changeCurrentImageAction}
                                                className={"reviewImgBtn"}
                                             >Change Current Image</button>
                                    </div>): (<>
                                    <p>Image would be auto created on submission of review</p>
                                    </>)}
                                </aside>
                                <button className="reviewSubmitButton">
                                    Update Review
                                </button>
                            </form>
                        ))
                    }
                </div>
            }
        </main>
    </div>  
    )
}





/**
 * @route /admin
 * @param {*} props 
 * @returns ReactComponent
 */
const UserAdminComponent /*: ReactComponent */ = (props) => {
    // Check if a user is admin
    useReRouteIfNotAdmin("/admin")
    const User = useRecoilValue(UserState);
    return (<div className="userAcctHomePage" style={{...bgStyle}}>
        <ViewTransactionHistory user={User}/>
        <UpdatePendingTransactions user={User}/>
        <RetrieveAndUpdateWithdrawals user={User}/>

        {/* Home Page Admin */}
       <HomePageIntro user={User} />
       <HomepageStats user={User} />
       <HomePageHowToEarn  user={User} />
       <HomepageReview user={User} /> 
       <Footer user={User} />
    </div>)
    
}



const AdminHomePage /*: React Component */= (props) => {
    return (<>
        <NavigationBar active='UserAccountHomePage'/>
        <UserAdminComponent/>
    </>)
}

export default AdminHomePage;