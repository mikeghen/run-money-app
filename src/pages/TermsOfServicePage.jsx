import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TermsOfServicePage = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1>Terms of Service</h1>
          <p><strong>Effective Date:</strong> July 20, 2024</p>
          <p>These Terms of Service ("Terms") govern your use of the Run Money mobile application ("App") and website ("Site"). By accessing or using our App and Site, you agree to these Terms. If you do not agree to these Terms, do not use our App and Site.</p>

          <h2>Account Registration</h2>
          <p>To use our App and Site, you must register for an account. You agree to provide accurate and complete information during the registration process and to keep your account information up-to-date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

          <h2>Use of the App and Site</h2>
          <p>You agree to use our App and Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use our App and Site in any manner that could disable, overburden, or impair our servers or networks.</li>
            <li>Attempt to gain unauthorized access to any part of our App and Site.</li>
            <li>Use any automated means to access our App and Site for any purpose.</li>
            <li>Use our App and Site to infringe upon the rights of others.</li>
          </ul>

          <h2>Staking and Rewards</h2>
          <p>By staking USDC, you agree to the terms of our staking program. You understand that your staked USDC will earn interest and that failure to meet the activity requirements of your running club may result in the redistribution of your earned interest to other members. You may request to unstake your USDC at any time, but you must wait one week before you can withdraw your funds.</p>

          <h2>Compliance with Strava API Agreement</h2>
          <p>Your use of the Strava API is subject to the terms of the Strava API Agreement. You must adhere to the guidelines and restrictions set by Strava, including but not limited to the proper use and protection of Strava user data.</p>

          <h3>Strava Integration</h3>
          <p>Your use of Strava data is governed by the Strava API Agreement. Any data collected from Strava will be used solely for the purposes specified in your application and in compliance with Strava’s terms.</p>

          <h3>Prohibited Uses</h3>
          <p>You may not use the Strava API to create an application that competes with or replicates Strava. You may not use, store, or share Strava data for any unauthorized purposes.</p>

          <h2>Intellectual Property</h2>
          <p>All content and materials on our App and Site, including text, graphics, logos, and software, are the property of Run Money or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content or materials without our prior written permission.</p>

          <h2>Termination</h2>
          <p>We may terminate or suspend your account and access to our App and Site at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use our App and Site will immediately cease.</p>

          <h3>API Access Termination</h3>
          <p>Strava reserves the right to terminate or limit your access to the Strava API if you violate the terms of the Strava API Agreement. In such an event, you will no longer have access to Strava data through our application.</p>

          <h2>Disclaimer of Warranties</h2>
          <p>Our App and Site are provided on an "as is" and "as available" basis. We disclaim all warranties, whether express or implied, including the warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our App and Site will be uninterrupted, error-free, or secure.</p>

          <h2>Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use of or inability to use our App and Site; (b) any unauthorized access to or use of our servers and/or any personal information stored therein; (c) any interruption or cessation of transmission to or from our App and Site; or (d) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our App and Site by any third party.</p>

          <h2>Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Run Money is based, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in that jurisdiction.</p>

          <h2>Changes to These Terms</h2>
          <p>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our App and Site. Your continued use of our App and Site after any changes take effect will constitute your acceptance of the revised Terms.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: <a href="mailto:info@runmoney.com">info@runmoney.com</a></p>

          <p>By using our App and Site, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default TermsOfServicePage;
