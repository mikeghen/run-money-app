import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PrivacyPolicyPage = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1>Privacy Policy</h1>
          <p><strong>Effective Date:</strong> July 20, 2024</p>
          <p>Run Money ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("App") and website ("Site"). Please read this Privacy Policy carefully. By using our App and Site, you agree to the terms of this Privacy Policy.</p>

          <h2>Information We Collect</h2>
          <p>We may collect and process the following information about you:</p>
          <h3>Personal Information</h3>
          <ul>
            <li><strong>Registration Information:</strong> When you register for an account, we collect your name, email address, and other contact details.</li>
            <li><strong>Profile Information:</strong> You may provide additional information, such as your age, gender, and profile picture.</li>
          </ul>

          <h3>Activity Information</h3>
          <ul>
            <li><strong>Strava Integration:</strong> We collect your user ID, activity ID, distance, and time for each run tracked via Strava.</li>
            <li><strong>Staking Information:</strong> We collect information about the amount of USDC you stake and your staking activity.</li>
          </ul>

          <h3>Technical Information</h3>
          <ul>
            <li><strong>Device Information:</strong> We collect information about the device you use to access our App and Site, including your IP address, browser type, and operating system.</li>
            <li><strong>Usage Information:</strong> We collect information about your interactions with our App and Site, such as the pages you visit and the features you use.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our App and Site.</li>
            <li>Process your transactions and manage your staking activities.</li>
            <li>Track your running activities and calculate your rewards.</li>
            <li>Communicate with you, including sending updates and notifications.</li>
            <li>Improve our App and Site, and develop new features and services.</li>
            <li>Ensure the security and integrity of our App and Site.</li>
            <li>Comply with legal obligations and enforce our policies.</li>
          </ul>

          <h3>Strava User Data</h3>
          <p>If you use Strava data, we collect specific data such as user ID, activity ID, distance, and time. This data will be used solely for tracking progress and calculating rewards within the Run Money app. We will not share Strava user data with third parties.</p>

          <h2>Sharing Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Your Consent:</strong> We may share your information with third parties if you have given us your consent to do so.</li>
            <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analysis.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
          </ul>

          <h2>Data Security</h2>
          <p>We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. This includes encryption and secure transmission protocols for data collected via Strava. However, no method of transmission over the internet or method of electronic storage is completely secure.</p>

          <h2>Your Choices</h2>
          <p>You have the following choices regarding your information:</p>
          <ul>
            <li><strong>Access and Update:</strong> You can access and update your personal information through your account settings.</li>
            <li><strong>Opt-Out:</strong> You can opt-out of receiving promotional communications from us by following the instructions in those communications.</li>
            <li><strong>Delete Account:</strong> You can request the deletion of your account by contacting us at the email address provided below.</li>
          </ul>

          <h3>Data Deletion</h3>
          <p>If you wish to delete your data, including Strava data, you can request its deletion through our support team. We will ensure that all relevant data is deleted promptly.</p>

          <h2>Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our App and Site. Your continued use of our App and Site after any changes take effect will constitute your acceptance of the revised Privacy Policy.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: <a href="mailto:info@runmoney.com">info@runmoney.com</a></p>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicyPage;
