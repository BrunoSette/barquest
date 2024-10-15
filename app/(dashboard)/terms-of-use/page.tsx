// pages/terms.js
import React from "react";
import Head from "next/head";

const TermsOfUse = () => {
  return (
    <>
      <Head>
        <title>Terms of Use - Barquest</title>
        <meta name="description" content="Terms of Use for Barquest" />
      </Head>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-6">Terms of Use</h1>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Copyright Notice</h2>
            <p>
              All materials available on{" "}
              <span className="font-bold">www.barquest.ca</span> are protected
              by copyright laws. This includes, but is not limited to, all
              practice questions and supplementary materials.
            </p>
            <p>
              Any unauthorized reproduction, dissemination, or use of any
              content provided by Barquest will result in legal action pursued
              to the fullest extent permitted by law.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing or using the{" "}
              <span className="font-bold">www.barquest.ca</span> website
              (&quot;Site&quot;) or purchasing any services or materials through
              the Site (&quot;Services&quot;), you agree to these Terms of Use
              (the &quot;Agreement&quot;). This Agreement applies whether or not
              you purchase any services or materials from the Site.
            </p>
            <p>
              If you do not agree to these terms, please discontinue using the
              Site immediately.
            </p>
            <p>
              You confirm that you have the legal right and authority to enter
              into this Agreement and to comply with its terms.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
            <p>
              Please review our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              for details on how we handle your personal information.
            </p>
            <p>
              Barquest takes reasonable precautions to secure the data
              transmitted through the Site but does not guarantee the absolute
              security of any information, including credit card details. We
              recommend reviewing privacy policies of any third-party service
              providers, especially those processing payments on our behalf.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              Barquest reserves the right to modify these Terms of Use at any
              time. Any changes will be posted on the Site, and your continued
              use of the Site after changes are posted constitutes your
              acceptance of the revised terms. If you disagree with any updates,
              please stop using the Site immediately.
            </p>
          </section>
          {/* Add more sections as necessary following the same format */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Site Access and Use</h2>
            <p>
              Barquest grants you a non-exclusive, non-transferable, limited
              right to access and use the Site for personal purposes only.
            </p>
            <p className="font-bold">You may not:</p>
            <ul className="list-disc list-inside">
              <li>Use the Site for commercial purposes.</li>
              <li>
                Reproduce, distribute, or modify any materials from the Site
                without written permission.
              </li>
              <li>
                Share, resell, or distribute any purchased materials, including
                practice exam questions.
              </li>
            </ul>
            <p>
              Any breach of these terms will result in the immediate termination
              of your right to use the Site and Services.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Registration Information and Account Security
            </h2>
            <p>
              To use certain features of the Site, you must provide accurate
              registration information. You are responsible for maintaining the
              security of your account, including your username and password.
            </p>
            <p className="font-bold">You agree to:</p>
            <ul className="list-disc list-inside">
              <li>Not share your account credentials with others.</li>
              <li>
                Notify Barquest immediately of any unauthorized use of your
                account.
              </li>
              <li>
                Be responsible for all activities conducted under your account.
              </li>
            </ul>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment and Billing</h2>
            <p>
              You must pay all applicable fees for the Services you purchase.
              Barquest uses Stripe for payment processing, and your use of such
              services is subject to their terms and conditions.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Submission of Information
            </h2>
            <p>
              Except for financial information, you should not submit any
              confidential or proprietary information through the Site.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Publicity</h2>
            <p>
              Feedback, testimonials, or comments provided by you to Barquest
              may be made publicly available unless you expressly request
              confidentiality in writing.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Links to Third-Party Content
            </h2>
            <p>
              Our Site may contain links to third-party websites, including
              payment processors. These links do not constitute endorsements or
              recommendations of these third parties. Barquest is not
              responsible for the content or services provided by these
              third-party sites.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Intellectual Property
            </h2>
            <p>
              All content on this Site—including text, graphics, images, and
              software—remains the intellectual property of Barquest or its
              licensors. You may not copy, modify, or distribute any content
              without our express written consent.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prohibited Actions</h2>
            <p className="font-bold">You agree not to:</p>
            <ul className="list-disc list-inside">
              <li>Infringe on third-party intellectual property rights.</li>
              <li>
                Use automated systems (e.g., robots, spiders) to interact with
                the Site.
              </li>
              <li>Upload viruses, malware, or any harmful code.</li>
              <li>Share, resell, or distribute any content from the Site.</li>
              <li>
                Attempt to gain unauthorized access to any portion of the Site.
              </li>
            </ul>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Disclaimer and Limitation of Liability
            </h2>
            <p>
              Barquest makes no guarantees or warranties regarding the
              effectiveness of its practice exams or your exam results. Use of
              this Site is at your own risk. Barquest will not be liable for any
              damages, including but not limited to lost profits, business
              interruption, or data loss, arising from your use of the Site or
              Services.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Barquest and its
              affiliates from any claims, damages, or expenses arising from your
              use of the Site or Services, including any breach of this
              Agreement.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Amendments and Waivers
            </h2>
            <p>
              No amendments to this Agreement will be valid unless posted on the
              Site by Barquest. Waivers of any breach of this Agreement must be
              made in writing and signed by the affected party.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Assignment</h2>
            <p>
              You may not transfer your rights or obligations under this
              Agreement without the prior written consent of Barquest.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p>
              If any provision of this Agreement is found invalid or
              unenforceable, the remaining provisions will continue in full
              force.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Notice and Communication
            </h2>
            <p>
              By using the Site, you consent to receive electronic
              communications from Barquest. Notices will be sent to your
              registered email or posted on the Site.
            </p>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
            <p>
              In the event of any disputes related to this Agreement or the
              Services, you agree to resolve the issue through binding
              arbitration in Ontario, Canada, or through small claims court if
              the amount in dispute qualifies.
            </p>
          </section>
          <p>Last Updated: October 14, 2024</p>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;
