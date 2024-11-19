// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityManagement {
    struct Identity {
        string name;
        uint256 employeeId;
        string email;
        string accessLevel;
        string requestReason;
        bool accessStatus; // true if approved, false if not approved
        string username;
        string password; // Store as hash
    }

    mapping(uint256 => Identity) private identities; // Mapping of employeeId to Identity
    uint256[] private requestIds; // Array to keep track of all request IDs

    event AccessRequested(uint256 employeeId, string name, string email, string accessLevel, string requestReason);
    event AccessApproved(uint256 employeeId, string name);
    event AccessDisapproved(uint256 employeeId);

    // Request access - adds data to identities with accessStatus set to false
    function requestAccess(
        string memory _name,
        uint256 _employeeId,
        string memory _email,
        string memory _accessLevel,
        string memory _requestReason,
        string memory _username,
        string memory _password
    ) public {
        require(bytes(identities[_employeeId].name).length == 0, "Request already exists");

        // Store the identity with accessStatus set to false (not approved)
        identities[_employeeId] = Identity({
            name: _name,
            employeeId: _employeeId,
            email: _email,
            accessLevel: _accessLevel,
            requestReason: _requestReason,
            accessStatus: false,
            username : _username,
            password : _username // Not approved initially
        });

        requestIds.push(_employeeId);

        emit AccessRequested(_employeeId, _name, _email, _accessLevel, _requestReason);
    }

    // Approve status - updates accessStatus to true for a given employeeId
    function approveStatus(uint256 _employeeId) public {
        require(bytes(identities[_employeeId].name).length != 0, "Request does not exist");
        require(!identities[_employeeId].accessStatus, "Already approved");

        identities[_employeeId].accessStatus = true;
        identities[_employeeId].username = identities[_employeeId].email;
        identities[_employeeId].password = identities[_employeeId].name;


        emit AccessApproved(_employeeId, identities[_employeeId].name);
    }

    // Disapprove status - removes the identity request
    function disapproveStatus(uint256 _employeeId) public {
        require(bytes(identities[_employeeId].name).length != 0, "Request does not exist");

        delete identities[_employeeId];
        removeRequestId(_employeeId);

        emit AccessDisapproved(_employeeId);
    }

    // Helper function to remove an employeeId from requestIds array
    function removeRequestId(uint256 _employeeId) internal {
        for (uint256 i = 0; i < requestIds.length; i++) {
            if (requestIds[i] == _employeeId) {
                requestIds[i] = requestIds[requestIds.length - 1];
                requestIds.pop();
                break;
            }
        }
    }

    // Fetch credentials - return username and password if approved
    function fetchCredentials(uint256 _employeeId, string memory _password) public view returns (string memory, string memory) {
        require(identities[_employeeId].accessStatus, "Access not approved");

        Identity memory identity = identities[_employeeId];
        return (identity.username, "Password Protected");
    }

    // Fetch all identities - returns details for dashboard
    function fetchAllIdentities() public view returns (
        uint256[] memory,
        string[] memory,
        string[] memory,
        string[] memory,
        string[] memory
    ) {
        uint256 totalRequests = requestIds.length;

        uint256[] memory employeeIds = new uint256[](totalRequests);
        string[] memory names = new string[](totalRequests);
        string[] memory emails = new string[](totalRequests);
        string[] memory accessLevels = new string[](totalRequests);
        string[] memory requestReasons = new string[](totalRequests);

        for (uint256 i = 0; i < totalRequests; i++) {
            uint256 employeeId = requestIds[i];
            Identity memory identity = identities[employeeId];

            employeeIds[i] = employeeId;
            names[i] = identity.name;
            emails[i] = identity.email;
            accessLevels[i] = identity.accessLevel;
            requestReasons[i] = identity.requestReason;
        }

        return (employeeIds, names, emails, accessLevels, requestReasons);
    }
}
