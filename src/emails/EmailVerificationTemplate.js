import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const EmailVerificationTemplate = ({
  name = "User",
  verificationLink = "https://example.com",
}) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={text}>
          Hello {name},
        </Text>
        <Text style={text}>
          Thanks for signing up. To complete your registration and start using our service, please click the button below to verify your email address.
        </Text>
        <Text style={text}>
          If you did not sign up for this account, you can safely ignore this email.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verify Email
          </Button>
        </Section>
        <Text style={text}>
          Thanks, {process.env.APP_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailVerificationTemplate;

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center",
  margin: "32px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 20px",
};
