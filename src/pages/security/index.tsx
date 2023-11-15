import React from 'react';
import SecurityCompliance from './SecurityCompliance';
import SecurityVulnerabilities from './SecurityVulnerabilities';
import ApplicationVulnerabilities from './ApplicationVulnerabilities';
const Security = () => {
    return (
        <><SecurityCompliance />
        <SecurityVulnerabilities />
        <ApplicationVulnerabilities/>
        </>
    );
}

export default Security;
