import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Tailwind,
  Section,
  Link,
} from "@react-email/components";

export const WelcomeEmail: React.FC = () => (
  <Html>
    <Head />
    <Preview>Welcome to BarQuest - Your Path to Ontario Bar Success</Preview>
    <Tailwind>
      <Body className="bg-gradient-to-b from-gray-100 to-gray-200 font-sans">
        <Container className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto my-8">
          <Section className="text-center mb-8">
            <Heading className="text-3xl font-bold text-orange-400 mb-2">
              Welcome to BarQuest!
            </Heading>
            <Text className="text-gray-600 text-lg">
              Your journey to becoming an Ontario lawyer starts here.
            </Text>
          </Section>

          <Section className="mb-8">
            <Text className="text-gray-700 mb-4 leading-relaxed">
              Congratulations on taking this crucial step towards your legal
              career in Ontario. We are thrilled to have you on board!
            </Text>
            <Text className="text-gray-700 mb-4 leading-relaxed">
              Our meticulously crafted practice exams are designed to give you
              the edge in your Ontario Bar Exam preparation.
            </Text>
          </Section>

          <Section className="text-center mb-8">
            <Button
              href="https://www.barquest.ca/dashboard/newtest"
              className="bg-orange-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
            >
              Start Your Exam Prep Now
            </Button>
          </Section>

          <Section className="border-t border-gray-200 pt-6 text-center">
            <Text className="text-sm text-gray-600 mb-4">
              Questions about our practice exams? Our support team is here to
              here to help! Just reply to this email.
            </Text>
          </Section>

          <Section className="mt-8 text-center">
            <Text className="text-sm text-gray-600 italic">
              Your feedback is invaluable to us. We&apos;d love to hear your
              thoughts on BarQuest!
            </Text>
          </Section>

          <Section className="mt-8 text-center">
            <Link
              href="https://barquest.ca"
              className="text-orange-600 hover:underline"
            >
              www.barquest.ca
            </Link>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
