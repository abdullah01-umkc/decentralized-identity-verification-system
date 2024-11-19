import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AdminDashboard() {
    const navigate = useNavigate();

    // State variables for interacting with the blockchain
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    // State to store the list of requests fetched from the contract
    const [requests, setRequests] = useState([]);

    // Contract address and ABI
    const contractAddress = "0xc54F948311d482Ec4c78851480B00fEE94e3F5A3"; // Replace with your contract address
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_employeeId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_accessLevel",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_requestReason",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_username",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_password",
                    "type": "string"
                }
            ],
            "name": "requestAccess",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_employeeId",
                    "type": "uint256"
                }
            ],
            "name": "approveStatus",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_employeeId",
                    "type": "uint256"
                }
            ],
            "name": "disapproveStatus",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_employeeId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_password",
                    "type": "string"
                }
            ],
            "name": "fetchCredentials",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fetchAllIdentities",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                },
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                },
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_employeeId",
                    "type": "uint256"
                }
            ],
            "name": "removeRequestId",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "employeeId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "accessLevel",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "requestReason",
                    "type": "string"
                }
            ],
            "name": "AccessRequested",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "employeeId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "AccessApproved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "employeeId",
                    "type": "uint256"
                }
            ],
            "name": "AccessDisapproved",
            "type": "event"
        }
    ];

    // Connect to Ethereum wallet and contract
    useEffect(() => {
        const connectWallet = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                setProvider(provider);
                setSigner(signer);

                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);

                const contract = new ethers.Contract(contractAddress, abi, signer);
                setContract(contract);

                // Fetch requests when component mounts
                fetchRequests(contract);
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        };
        connectWallet();
    }, []);

    // Function to fetch pending requests from the contract
    const fetchRequests = async (contract) => {
        if (!contract) {
            console.error("Contract is not initialized.");
            return;
        }

        try {
            // Call fetchAllIdentities and destructure the returned arrays
            const [employeeIds, names, emails, accessLevels, requestReasons] = await contract.fetchAllIdentities();

            // Map the arrays into a structured array of request objects
            const fetchedRequests = employeeIds.map((id, index) => ({
                employeeId: id.toString(), // Convert BigNumber to string
                name: names[index],
                email: emails[index],
                accessLevel: accessLevels[index],
                requestReason: requestReasons[index],
            }));

            setRequests(fetchedRequests); // Update the state with structured requests
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    // Function to approve a request
    const approveRequest = async (employeeId) => {
        if (!contract) return;

        try {
            const tx = await contract.approveStatus(employeeId);
            await tx.wait();
            alert(`Request ${employeeId} approved!`);
            fetchRequests(contract);
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request.");
        }
    };

    // Function to disapprove a request
    const disapproveRequest = async (employeeId) => {
        if (!contract) return;

        try {
            const tx = await contract.disapproveStatus(employeeId);
            await tx.wait();
            alert(`Request ${employeeId} disapproved.`);
            fetchRequests(contract);
        } catch (error) {
            console.error("Error disapproving request:", error);
            alert("Failed to disapprove request.");
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Pending Approval Requests</p>
            <div className="request-list">
                {requests.map((request, index) => (
                    <div className="request-item" key={index}>
                        <p><strong>Name:</strong> {request.name}</p>
                        <p><strong>Employee ID:</strong> {request.employeeId}</p>
                        <p><strong>Email:</strong> {request.email}</p>
                        <p><strong>Access Level:</strong> {request.accessLevel}</p>
                        <p><strong>Request Reason:</strong> {request.requestReason}</p>
                        <button className="button-approve" onClick={() => approveRequest(request.employeeId)}>Approve</button>
                        <button className="button-danger" onClick={() => disapproveRequest(request.employeeId)}>Disapprove</button>
                    </div>
                ))}
            </div>
            <div>
                <button className="button-primary" onClick={() => fetchRequests(contract)}>Fetch Requests</button>
                <button className="button-primary" onClick={() => navigate('/credentials')}>See Existing Credentials</button>
            </div>
        </div>
    );
}

export default AdminDashboard;
