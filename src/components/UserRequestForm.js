import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function UserRequestForm() {
    // State variables for form inputs
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [accessLevel, setAccessLevel] = useState('Basic Access');
    const [reason, setReason] = useState('');

    // Blockchain state variables
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    // Ethereum contract address and ABI
    const contractAddress = "0xb6Ac4687592aA238ed6B80F8443F27626632C9D0"; // Replace with your actual contract address
    const abi =  [
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

    // Initialize connection to the Ethereum wallet and smart contract
    useEffect(() => {
        const connectWallet = async () => {
            try {
                // Initialize the provider and request access to the user's Ethereum account
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []); // Request access to MetaMask
                const signer = provider.getSigner(); // Get the signer to sign transactions
                setProvider(provider);
                setSigner(signer);

                // Get the user's Ethereum address
                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);

                // Connect to the contract using the signer
                const contract = new ethers.Contract(contractAddress, abi, signer);
                setContract(contract);
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        };
        connectWallet();
    }, []);

    // Function to submit the access request to the smart contract
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure all required fields are filled in
        if (!name || !employeeId || !email || !accessLevel) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Call the contract's requestAccess function with form inputs
            const tx = await contract.requestAccess(
                name,
                parseInt(employeeId), // Employee ID as uint256
                email,
                accessLevel,
                reason || "N/A", // Provide a default reason if not provided
                "username", // Placeholder for username
                "password" // Placeholder for password
            );

            await tx.wait(); // Wait for the transaction to be confirmed

            // Notify the user and reset form fields
            alert(`Request submitted for ${name} with access level: ${accessLevel}`);
            setName('');
            setEmployeeId('');
            setEmail('');
            setAccessLevel('Basic Access');
            setReason('');
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit the request. Please try again.");
        }
    };

    return (
        <div className="user-form">
            <h2>Request Access</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="employeeId">Employee ID:</label>
                <input
                    type="text"
                    id="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                />

                <label htmlFor="email">Company Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="accessLevel">Requested Access Level:</label>
                <select
                    id="accessLevel"
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                >
                    <option>Basic Access</option>
                    <option>Admin Access</option>
                    <option>Developer Access</option>
                </select>

                {accessLevel !== 'Basic Access' && (
                    <>
                        <label htmlFor="reason">Reason for Access:</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a reason for higher access"
                            required
                        ></textarea>
                    </>
                )}

                <button type="submit" className="button-primary">Submit Request</button>
            </form>
        </div>
    );
}

export default UserRequestForm;
