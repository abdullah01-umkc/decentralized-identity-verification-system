import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function CredentialsPage() {
    const [credentials, setCredentials] = useState([]);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    // Ethereum contract address and ABI
    const contractAddress = "0xb6Ac4687592aA238ed6B80F8443F27626632C9D0";
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
                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);

                const contract = new ethers.Contract(contractAddress, abi, signer);
                setContract(contract);
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        };
        connectWallet();
    }, []);

    // Function to fetch approved credentials from the contract
    const fetchCredentials = async () => {
        if (!contract) {
            alert("Contract not loaded.");
            return;
        }
        try {
            // Call the fetchAllIdentities function from the smart contract
            const [employeeIds, names, emails, accessLevels, requestReasons] = await contract.fetchAllIdentities();

            // Format the data into an array of objects and convert BigNumber IDs to strings
            const fetchedCredentials = employeeIds.map((id, index) => ({
                id: id.toString(), // Convert BigNumber to string
                name: names[index],
                email: emails[index],
                role: accessLevels[index],
                dateApproved: "N/A" // Placeholder, replace with actual date if available
            }));

            // Update the credentials state with the fetched data
            setCredentials(fetchedCredentials);
        } catch (error) {
            console.error("Error fetching credentials:", error);
            alert("Failed to fetch credentials. Please try again.");
        }
    };

    return (
        <div className="credentials-page">
            <h2>Approved Credentials</h2>
            <button onClick={fetchCredentials}>Fetch Credentials</button> {/* Button to fetch data */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {credentials.map((credential, index) => (
                        <tr key={index}>
                            <td>{credential.id}</td>
                            <td>{credential.name}</td>
                            <td>{credential.email}</td>
                            <td>{credential.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CredentialsPage;
